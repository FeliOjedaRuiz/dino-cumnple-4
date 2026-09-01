// Event configuration — edit these values as needed
// PHONES: first entry is primary (used in Footer)
// INVITATION_URL: set PUBLIC_INVITATION_URL in .env for production

export const EVENT_DATE = new Date("2026-09-19T17:30:00+02:00");

export const EVENT_TIME = "17:30";

export const EVENT_DATE_ISO = "2026-09-19";

export const ADDRESS = "D'Locosparty, Granada";

export const GOOGLE_MAPS_URL =
  "https://www.google.com/maps?q=D%27Locosparty+Granada";

export const PHONES: { label: string; number: string }[] = [
  { label: "Mamá", number: "+34630173975" },
];

// Static URL used in Google Calendar details field
// In production set PUBLIC_INVITATION_URL env var
export const INVITATION_URL =
  import.meta.env.PUBLIC_INVITATION_URL || "https://tu-invitacion.netlify.app";

// Event duration in hours (start → end in Google Calendar)
export const EVENT_DURATION_HOURS = 2;

// Time zone identifier (IANA) used for the Google Calendar event
export const EVENT_TIMEZONE = "Europe/Madrid";
