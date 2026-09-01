# GAS RSVP Endpoint — Deploy Guide

Manual deploy only. No CI/CD for the GAS side.

---

## Prerequisites

- A Google account (the account that deploys owns the Sheet)
- A Google Sheet (create one in Google Drive)

---

## Step 1 — Create the Google Sheet

1. Go to [sheets.new](https://sheets.new) (or Drive → New → Google Sheets)
2. Name the sheet: **RSVPs - Cumple Dino 4**
3. Rename the first tab to: **RSVPs - Cumple Dino 4**
4. Add a **header row** (Row 1):

   | A | B | C | D | E |
   |---|---|---|---|---|
   | Timestamp | Nombre del niño | Adultos | Alergias | Hermanos |

   > The script can also create this header automatically on the first run. If
   > your sheet already has the older 4-column header, the script will append
   > the "Hermanos" column (E) without shifting existing data.

5. Copy the **Sheet ID** from the URL:
   ```
   https://docs.google.com/spreadsheets/d/[THIS-IS-THE-SHEET-ID]/edit
   ```
   You'll need this for Step 3.

---

## Step 2 — Open Google Apps Script

1. Go to [script.google.com](https://script.google.com)
2. Click **+ New untitled project**
3. Rename the project: **RSVP - Cumple Dino 4** (click on "Untitled project" at the top)

---

## Step 3 — Paste the Code

1. Delete any existing code in `Code.gs` (the default `function myFunction() {}`)
2. Open `gas/Code.gs` from this project
3. Copy ALL the code
4. Paste it into the Apps Script editor
5. **Replace `YOUR_SHEET_ID_HERE`** (line 12) with your actual Sheet ID from Step 1
6. Optionally update `SHEET_NAME` if you named your sheet differently

---

## Step 4 — Save and Deploy

1. Click **Save** (💾) or Ctrl+S
2. Click **Deploy** → **New deployment**
3. Click the **Select type** gear icon ⚙️ → **Web app**
4. Fill in:
   - **Description**: `RSVP Endpoint v1`
   - **Execute as**: `Me`
   - **Who has access**: `Anyone`
5. Click **Deploy**
6. Google will ask you to authorize — click **Authorize access** → select your account → **Allow**
7. Copy the **Web app URL** — this is your `PUBLIC_RSVP_ENDPOINT`

---

## Step 5 — Configure the Frontend

1. In your `.env` file (or Netlify environment variables), set:

   ```
   PUBLIC_RSVP_ENDPOINT=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
   PUBLIC_INVITATION_URL=https://your-site.netlify.app
   ```

2. In `src/lib/config.ts`, the `INVITATION_URL` falls back to the hardcoded placeholder.
   For production, set `PUBLIC_INVITATION_URL` in Netlify.

---

## Step 6 — Test the Endpoint

### Test valid POST (with allergens and siblings):
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"childName":"Tomás","adultsCount":2,"siblingsCount":1,"allergens":"alergia severa al maní"}' \
  https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

Expected response:
```json
{"success":true,"timestamp":"2026-07-25T..."}
```

### Test valid POST (without allergens — optional):
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"childName":"Marta","adultsCount":1,"siblingsCount":0}' \
  https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

### Test invalid POST (missing childName):
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"childName":"","adultsCount":1,"siblingsCount":0}' \
  https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

Expected response:
```json
{"success":false,"error":"childName must be between 1 and 50 characters."}
```

### Check your Sheet:
After a successful POST, the Sheet should have a new row with timestamp, name, adult count, siblings count, and (optional) allergens.

---

## Troubleshooting

| Problem | Solution |
|---|---|
| `Could not open Sheet` error | Verify Sheet ID is correct and the Sheet is shared with the Google account running the script |
| CORS error in browser | GAS Web Apps handle CORS automatically — if you see CORS errors, check the URL is correct |
| `appendRow` fails silently | Run `testConnection()` from the Apps Script editor to diagnose |
| URL changes after re-deploy | Each deployment has a unique URL. Update `PUBLIC_RSVP_ENDPOINT` after every re-deploy |

---

## Re-deploying (after code changes)

1. Open the Apps Script project
2. Make your changes
3. Save
4. Click **Deploy** → **Manage deployments**
5. Click the **Edit** pencil icon ✏️
6. Select **New version** from the version dropdown
7. Click **Deploy**
8. The existing URL still works — no need to update `PUBLIC_RSVP_ENDPOINT`
