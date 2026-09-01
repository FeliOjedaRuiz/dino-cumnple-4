import { useState, useRef, useEffect } from "react";
import { postRSVP } from "../lib/rsvp";
import { buildGoogleCalendarUrl } from "../lib/calendar";

type Choice = "yes" | "no" | null;
type ModalState = "closed" | "opening" | "open" | "closing";

// Must match the Tailwind transition duration (duration-300) on backdrop/content
const MODAL_TRANSITION_MS = 400;

export default function RSVPModal() {
  const [modalState, setModalState] = useState<ModalState>("closed");
  const [childName, setChildName] = useState("");
  const [siblingsChoice, setSiblingsChoice] = useState<Choice>(null);
  const [siblingsCount, setSiblingsCount] = useState(1);
  const [adultsChoice, setAdultsChoice] = useState<Choice>(null);
  const [adultsCount, setAdultsCount] = useState(1);
  const [allergens, setAllergens] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<number | null>(null);
  const resetTimerRef = useRef<number | null>(null);
  // Element that triggered the modal — used to restore focus on close (a11y)
  const triggerRef = useRef<HTMLElement | null>(null);

  function handleClose() {
    setError(null);
    setModalState("closing");
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
    }
    closeTimerRef.current = window.setTimeout(() => {
      setModalState("closed");
      // Restore focus to the element that opened the modal
      triggerRef.current?.focus();
      closeTimerRef.current = null;
    }, MODAL_TRANSITION_MS);
  }

  // Listen for StickyCTA's custom event to open
  useEffect(() => {
    function handleOpen() {
      // Capture the focused element (the trigger button) so we can restore it later
      const active = document.activeElement as HTMLElement | null;
      if (active && active !== document.body) {
        triggerRef.current = active;
      }
      setError(null);
      setModalState("opening");
    }
    window.addEventListener("open-rsvp-modal", handleOpen);
    return () => window.removeEventListener("open-rsvp-modal", handleOpen);
  }, []);

  // After mount with 'opening', schedule the transition to 'open' on the next
  // frame. This guarantees the browser paints the initial (invisible) state
  // before flipping to the visible state — otherwise the entry animation
  // wouldn't play.
  useEffect(() => {
    if (modalState !== "opening") return;
    const timer = window.setTimeout(() => setModalState("open"), 20);
    return () => window.clearTimeout(timer);
  }, [modalState]);

  // Lock body scroll and focus the first input when the modal is fully open.
  // Release scroll lock once the modal is fully closed (not just 'closing',
  // otherwise the page can't scroll until the close transition finishes).
  useEffect(() => {
    if (modalState === "open") {
      document.body.style.overflow = "hidden";
      const timer = setTimeout(() => {
        nameInputRef.current?.focus();
      }, 50);
      return () => {
        document.body.style.overflow = "";
        clearTimeout(timer);
      };
    }
    if (modalState === "closed") {
      document.body.style.overflow = "";
    }
  }, [modalState]);

  // Focus trap + ESC close. Only active while the modal is fully 'open' so
  // users can tab freely through the page during the entry/exit transitions.
  useEffect(() => {
    if (modalState !== "open" || !modalRef.current) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleClose();
        return;
      }
      if (e.key !== "Tab" || !modalRef.current) return;

      const focusable = modalRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (e.shiftKey) {
        if (active === first || !active || !modalRef.current.contains(active)) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (active === last || !active || !modalRef.current.contains(active)) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [modalState]);

  // Cleanup pending timers on unmount
  useEffect(() => {
    return () => {
      if (closeTimerRef.current !== null) window.clearTimeout(closeTimerRef.current);
      if (resetTimerRef.current !== null) window.clearTimeout(resetTimerRef.current);
    };
  }, []);

  function resetForm() {
    setChildName("");
    setSiblingsChoice(null);
    setSiblingsCount(1);
    setAdultsChoice(null);
    setAdultsCount(1);
    setAllergens("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const trimmed = childName.trim();
    if (!trimmed || trimmed.length < 1 || trimmed.length > 50) {
      setError("El nombre debe tener entre 1 y 50 caracteres.");
      return;
    }

    if (siblingsChoice === null) {
      setError("Por favor seleccioná si vienen hermanos.");
      return;
    }

    if (adultsChoice === null) {
      setError("Por favor seleccioná si vienen adultos.");
      return;
    }

    const adults =
      adultsChoice === "yes" ? Math.min(6, Math.max(1, adultsCount)) : 0;
    const siblings =
      siblingsChoice === "yes" ? Math.min(6, Math.max(1, siblingsCount)) : 0;

    const trimmedAllergens = allergens.trim();
    if (trimmedAllergens.length > 200) {
      setError("Las alergias deben tener máximo 200 caracteres.");
      return;
    }

    setSubmitting(true);

    const result = await postRSVP({
      childName: trimmed,
      adultsCount: adults,
      siblingsCount: siblings,
      allergens: trimmedAllergens || undefined,
    });

    setSubmitting(false);

    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.error || "Algo salió mal. Intentá de nuevo.");
    }
  }

  function handleCloseAndReset() {
    handleClose();
    // Reset form state shortly after the close transition completes
    if (resetTimerRef.current !== null) {
      window.clearTimeout(resetTimerRef.current);
    }
    resetTimerRef.current = window.setTimeout(() => {
      setSuccess(false);
      resetForm();
      resetTimerRef.current = null;
    }, MODAL_TRANSITION_MS);
  }

  if (modalState === "closed") return null;

  // Shared transition classes: backdrop fades, content pops (scale + fade).
  // When 'open' everything is visible; otherwise the modal is invisible and
  // non-interactive so the user can't click it during the exit animation.
  const isOpen = modalState === "open";
  const backdropClass = isOpen
    ? "opacity-100"
    : "opacity-0 pointer-events-none";
  const contentClass = isOpen
    ? "opacity-100 scale-100"
    : "opacity-0 scale-95";

  if (success) {
    return (
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 transition-opacity duration-[400ms] ${backdropClass}`}
        onClick={handleCloseAndReset}
        aria-hidden={!isOpen}
      >
        <div
          ref={modalRef}
          className={`bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center space-y-5 transition-all duration-[400ms] ${contentClass}`}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="rsvp-success-title"
        >
          <p className="text-5xl mb-2" aria-hidden="true">🎉</p>
          <h2
            id="rsvp-success-title"
            className="font-nunito font-bold text-xl text-celeste-700"
          >
            ¡Confirmado!
          </h2>
          <p className="font-quicksand text-gray-600">
            ¡Te esperamos el 19 de septiembre!
          </p>

          <a
            href={buildGoogleCalendarUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full px-5 py-3 rounded-full bg-tren-azul-500 hover:bg-tren-azul-600 active:bg-tren-azul-700 text-white font-fredoka font-bold text-base shadow-[0_4px_0_#155888] hover:shadow-[0_2px_0_#155888] hover:translate-y-0.5 active:translate-y-1 active:shadow-none transition-all duration-150"
            aria-label="Agendar en Google Calendar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Agendar en Google Calendar
          </a>

          <button
            type="button"
            onClick={handleCloseAndReset}
            className="w-full font-quicksand text-gray-500 text-sm hover:text-gray-700 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 transition-opacity duration-[400ms] ${backdropClass}`}
      onClick={handleClose}
      aria-hidden={!isOpen}
    >
      <div
        ref={modalRef}
        className={`bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transition-all duration-[400ms] ${contentClass}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="rsvp-title"
      >
        {/* Header */}
        <div className="bg-celeste-500 px-5 pt-5 pb-4 flex items-center justify-between">
          <h2
            id="rsvp-title"
            className="font-nunito font-bold text-lg text-white"
          >
            Confirmar asistencia
          </h2>
          <button
            onClick={handleClose}
            className="text-white/80 hover:text-white text-2xl leading-none w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="px-5 py-5 space-y-4">
          {/* Child name */}
          <div>
            <label
              htmlFor="childName"
              className="block font-quicksand font-semibold text-gray-700 text-sm mb-1"
            >
              Nombre completo del niño/a *
            </label>
            <input
              ref={nameInputRef}
              id="childName"
              type="text"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              maxLength={50}
              placeholder="Ej: Antonio Molina Sanz"
              className="w-full border border-gray-200 rounded-xl px-3 py-2 font-quicksand text-gray-800 focus:outline-none focus:ring-2 focus:ring-celeste-400 transition-shadow"
              aria-required="true"
            />
          </div>

          {/* Siblings radio + inline counter */}
          <fieldset className="flex flex-col gap-2 min-[360px]:flex-row min-[360px]:items-start min-[360px]:justify-between">
            <div className="flex flex-col gap-2 sm:flex-1">
              <legend className="block font-quicksand font-semibold text-gray-700 text-sm">
                ¿Vienen hermanos? *
              </legend>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="siblings"
                    value="yes"
                    checked={siblingsChoice === "yes"}
                    onChange={() => {
                      setSiblingsChoice("yes");
                      setSiblingsCount(1);
                    }}
                    className="accent-celeste-500"
                  />
                  <span className="font-quicksand text-gray-700 text-sm">Sí</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="siblings"
                    value="no"
                    checked={siblingsChoice === "no"}
                    onChange={() => setSiblingsChoice("no")}
                    className="accent-celeste-500"
                  />
                  <span className="font-quicksand text-gray-700 text-sm">No</span>
                </label>
              </div>
            </div>
            {siblingsChoice === "yes" && (
              <div className="flex items-center gap-2 min-[360px]:self-end">
                <button
                  type="button"
                  onClick={() => setSiblingsCount((c) => Math.max(1, c - 1))}
                  className="w-7 h-7 rounded-full bg-celeste-100 text-celeste-600 font-semibold text-sm flex items-center justify-center hover:bg-celeste-200 active:bg-celeste-300 transition-colors"
                  aria-label="Reducir hermanos"
                >
                  −
                </button>
                <span className="font-nunito font-semibold text-sm text-gray-800 w-5 text-center tabular-nums">
                  {siblingsCount}
                </span>
                <button
                  type="button"
                  onClick={() => setSiblingsCount((c) => Math.min(6, c + 1))}
                  className="w-7 h-7 rounded-full bg-celeste-100 text-celeste-600 font-semibold text-sm flex items-center justify-center hover:bg-celeste-200 active:bg-celeste-300 transition-colors"
                  aria-label="Aumentar hermanos"
                >
                  +
                </button>
              </div>
            )}
          </fieldset>

          {/* Adults radio + inline counter */}
          <fieldset className="flex flex-col gap-2 min-[360px]:flex-row min-[360px]:items-start min-[360px]:justify-between">
            <div className="flex flex-col gap-2 sm:flex-1">
              <legend className="block font-quicksand font-semibold text-gray-700 text-sm">
                ¿Vienen adultos? *
              </legend>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="adults"
                    value="yes"
                    checked={adultsChoice === "yes"}
                    onChange={() => {
                      setAdultsChoice("yes");
                      setAdultsCount(1);
                    }}
                    className="accent-celeste-500"
                  />
                  <span className="font-quicksand text-gray-700 text-sm">Sí</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="adults"
                    value="no"
                    checked={adultsChoice === "no"}
                    onChange={() => setAdultsChoice("no")}
                    className="accent-celeste-500"
                  />
                  <span className="font-quicksand text-gray-700 text-sm">No</span>
                </label>
              </div>
            </div>
            {adultsChoice === "yes" && (
              <div className="flex items-center gap-2 min-[360px]:self-end">
                <button
                  type="button"
                  onClick={() => setAdultsCount((c) => Math.max(1, c - 1))}
                  className="w-7 h-7 rounded-full bg-celeste-100 text-celeste-600 font-semibold text-sm flex items-center justify-center hover:bg-celeste-200 active:bg-celeste-300 transition-colors"
                  aria-label="Reducir adultos"
                >
                  −
                </button>
                <span className="font-nunito font-semibold text-sm text-gray-800 w-5 text-center tabular-nums">
                  {adultsCount}
                </span>
                <button
                  type="button"
                  onClick={() => setAdultsCount((c) => Math.min(6, c + 1))}
                  className="w-7 h-7 rounded-full bg-celeste-100 text-celeste-600 font-semibold text-sm flex items-center justify-center hover:bg-celeste-200 active:bg-celeste-300 transition-colors"
                  aria-label="Aumentar adultos"
                >
                  +
                </button>
              </div>
            )}
          </fieldset>

          {/* Allergens (optional) */}
          <div>
            <label
              htmlFor="allergens"
              className="block font-quicksand font-semibold text-gray-700 text-sm mb-1"
            >
              Alergias o intolerancias{" "}
              <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <textarea
              id="allergens"
              value={allergens}
              onChange={(e) => setAllergens(e.target.value)}
              maxLength={200}
              rows={3}
              placeholder="Ej: alergia severa al maní, celiaquía, no consume cerdo..."
              className="w-full border border-gray-200 rounded-xl px-3 py-2 font-quicksand text-gray-800 focus:outline-none focus:ring-2 focus:ring-celeste-400 transition-shadow resize-none"
            />
            <p className="font-quicksand text-gray-400 text-xs mt-1 text-right">
              {allergens.length}/200
            </p>
          </div>

          {/* Error message */}
          {error && (
            <p
              className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-3 py-2 font-quicksand text-sm"
              role="alert"
            >
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-celeste-500 hover:bg-celeste-600 active:bg-celeste-700 disabled:bg-celeste-300 text-white font-quicksand font-semibold py-2.5 rounded-xl transition-colors shadow-sm"
          >
            {submitting ? "Enviando..." : "Enviar confirmación"}
          </button>
        </form>
      </div>
    </div>
  );
}
