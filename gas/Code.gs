/**
 * GAS RSVP Endpoint — V8 runtime
 *
 * Deploy: https://script.google.com → New script → paste this code →
 * Deploy as Web App → Execute as: Me, Access: Anyone →
 * Copy the Deployment URL and paste into PUBLIC_RSVP_ENDPOINT in Netlify/.env
 *
 * IMPORTANT: Before deploying, edit YOUR_SHEET_ID_HERE below with your actual
 * Google Sheet ID (the long string in the Sheet URL).
 *
 * The Sheet must have a header row:
 *   Timestamp | Nombre del niño | Hermanos | Adultos | Alergias
 */

const SHEET_ID = "1tWkAFSO5HWx4ghr4KzVylt7d7WUX0p7f-5nNnS8Zh-o"; // ← Replace with your Sheet ID
const SHEET_NAME = "RSVPs - Cumple Dino 4"; // Sheet tab name
const HEADER = [
  "Timestamp",
  "Nombre del niño",
  "Hermanos",
  "Adultos",
  "Alergias",
];

/**
 * Handles POST requests with JSON body:
 *   {
 *     childName: string,
 *     adultsCount: number,       // 0..6
 *     siblingsCount: number,     // 0..6
 *     allergens?: string         // optional, max 200 chars
 *   }
 *
 * Returns:
 *   200 { success: true, timestamp: string }
 *   400 { success: false, error: string }
 */
function doPost(e) {
  let data;

  try {
    data = JSON.parse(e.postData.contents);
  } catch {
    return jsonResponse(400, {
      success: false,
      error: "Invalid JSON in request body.",
    });
  }

  // Validate childName
  const childName =
    typeof data.childName === "string" ? data.childName.trim() : "";
  if (childName.length < 1 || childName.length > 50) {
    return jsonResponse(400, {
      success: false,
      error: "childName must be between 1 and 50 characters.",
    });
  }

  // Validate adultsCount
  const adultsCount = Number(data.adultsCount);
  if (
    !Number.isInteger(adultsCount) ||
    adultsCount < 0 ||
    adultsCount > 6
  ) {
    return jsonResponse(400, {
      success: false,
      error: "adultsCount must be an integer between 0 and 6.",
    });
  }

  // Validate siblingsCount
  const siblingsCount = Number(data.siblingsCount);
  if (
    !Number.isInteger(siblingsCount) ||
    siblingsCount < 0 ||
    siblingsCount > 6
  ) {
    return jsonResponse(400, {
      success: false,
      error: "siblingsCount must be an integer between 0 and 6.",
    });
  }

  // Validate allergens (optional, max 200 chars)
  const allergens =
    typeof data.allergens === "string" ? data.allergens.trim() : "";
  if (allergens.length > 200) {
    return jsonResponse(400, {
      success: false,
      error: "allergens must be at most 200 characters.",
    });
  }

  // Append row to Sheet
  try {
    const sheet = getSheet();
    const timestamp = new Date().toISOString();
    sheet.appendRow([
      timestamp,
      childName,
      siblingsCount,
      adultsCount,
      allergens,
    ]);

    return jsonResponse(200, {
      success: true,
      timestamp: timestamp,
    });
  } catch (err) {
    return jsonResponse(500, {
      success: false,
      error: "Failed to append row to Sheet. Make sure the Sheet ID is correct.",
    });
  }
}

/**
 * Returns a Google Apps Script HtmlOutput with a JSON body and appropriate
 * status code.
 */
function jsonResponse(statusCode, body) {
  return ContentService.createTextOutput(JSON.stringify(body))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Returns the Sheet object for the configured SHEET_ID.
 * Creates the sheet if it doesn't exist (first run) and ensures the header
 * matches the expected schema, extending pre-existing 4-column sheets to
 * include "Hermanos" without shifting historical data.
 */
function getSheet() {
  let spreadsheet;
  try {
    spreadsheet = SpreadsheetApp.openById(SHEET_ID);
  } catch {
    throw new Error(
      `Could not open Sheet with ID "${SHEET_ID}". ` +
        "Make sure the Sheet ID is correct and the script has access to it."
    );
  }

  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADER);
    return sheet;
  }

  ensureHeaderRow(sheet);
  return sheet;
}

/**
 * Ensures the header row matches the expected schema. New sheets are filled
 * with the full header; pre-existing 4-column sheets get the "Hermanos" header
 * appended to the right (column E) without altering columns A-D.
 */
function ensureHeaderRow(sheet) {
  const lastColumn = sheet.getLastColumn();
  const firstRow = sheet.getRange(1, 1, 1, Math.max(lastColumn, HEADER.length));
  const existing = firstRow.getValues()[0].map(String);

  for (let i = 0; i < HEADER.length; i++) {
    if (existing[i] !== HEADER[i]) {
      if (i < existing.length) {
        // Existing value present but mismatched; only overwrite if empty.
        if (existing[i] === "") {
          sheet.getRange(1, i + 1).setValue(HEADER[i]);
        }
      } else {
        // Column is new; append the header value.
        sheet.getRange(1, i + 1).setValue(HEADER[i]);
      }
    }
  }
}

/**
 * For testing: open the script in the editor and run this function once
 * to verify the Sheet connection works.
 */
function testConnection() {
  const sheet = getSheet();
  Logger.log(`Connected to sheet: ${sheet.getName()}`);
}
