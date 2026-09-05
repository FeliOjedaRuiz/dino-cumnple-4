export interface RSVPData {
  childName: string;
  adultsCount: number;
  /** Number of siblings attending (0..6). 0 means none. */
  siblingsCount: number;
  /** Optional allergies, intolerances, or important notes (max 200 chars). */
  allergens?: string;
}

export interface RSVPResult {
  success: boolean;
  error?: string;
}

const TIMEOUT_MS = 10_000;

export async function postRSVP(data: RSVPData): Promise<RSVPResult> {
  const endpoint =
    "https://script.google.com/macros/s/AKfycbyYo63VJiQ33Z_D0F4SONPpcqfe73vopUSOfLIVVPUNP_HqlD6dXEE6okyezqzz7jQt/exec";

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const response = await fetch(endpoint, {
      method: "POST",
      // Use text/plain to avoid CORS preflight (GAS doesn't handle OPTIONS).
      // The body is still JSON; GAS parses it with JSON.parse in doPost.
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(data),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      return {
        success: false,
        error: `Error ${response.status}: no pudimos guardar tu confirmación. Intentá de nuevo.`,
      };
    }

    const json = await response.json();

    if (json.success === true) {
      return { success: true };
    }

    return {
      success: false,
      error: json.error || "No pudimos guardar tu confirmación. Intentá de nuevo.",
    };
  } catch (err: unknown) {
    if (err instanceof Error && err.name === "AbortError") {
      return {
        success: false,
        error: "La conexión se agotó. Intentá de nuevo.",
      };
    }
    return {
      success: false,
      error: "No pudimos guardar tu confirmación. Intentá de nuevo.",
    };
  }
}
