import {
  EVENT_DATE,
  EVENT_DURATION_HOURS,
  EVENT_TIMEZONE,
  GOOGLE_MAPS_URL,
  INVITATION_URL,
} from "./config";

/**
 * Formats a Date as `YYYYMMDDTHHmmssZ` for Google Calendar URLs.
 */
function toCalendarStamp(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${date.getUTCFullYear()}` +
    `${pad(date.getUTCMonth() + 1)}` +
    `${pad(date.getUTCDate())}` +
    `T` +
    `${pad(date.getUTCHours())}` +
    `${pad(date.getUTCMinutes())}` +
    `${pad(date.getUTCSeconds())}` +
    `Z`
  );
}

/**
 * Builds a Google Calendar "render" URL pre-filled with the event details
 * so the user only has to confirm and save.
 */
export function buildGoogleCalendarUrl(): string {
  const start = EVENT_DATE;
  const end = new Date(start.getTime() + EVENT_DURATION_HOURS * 60 * 60 * 1000);

  const dates = `${toCalendarStamp(start)}/${toCalendarStamp(end)}`;

  const details = [
    "🚂 ¡Subí a bordo! Te esperamos para celebrar el cumple de Dino.",
    "",
    "📅 19 de septiembre de 2026",
    "⏰ 17:30 hs",
    "📍 D'Locosparty — Av. Aragón, 3, 18230 Atarfe",
    "",
    "🎈 Habrá locomotoras, sorpresas y mucha diversión para los más peques.",
    "",
    "🗺️ Cómo llegar:",
    GOOGLE_MAPS_URL,
    "",
    "🔗 Invitación digital:",
    INVITATION_URL,
  ].join("\n");

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: "🎂 ¡Cumple de Dino! — 4 años",
    dates,
    ctz: EVENT_TIMEZONE,
    details,
    location: "D'Locosparty — Av. Aragón, 3, 18230 Atarfe",
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
