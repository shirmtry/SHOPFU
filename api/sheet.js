import { google } from "googleapis";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { action, username, password } = req.body;

    // Auth Google Sheets
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_SERVICE_KEY),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"]
    });

    const sheets = google.sheets({ version: "v4", auth });
    const SHEET_ID = process.env.SHEET_ID;

    if (action === "register") {
      await sheets.spreadsheets.values.append({
        spreadsheetId: SHEET_ID,
        range: "Sheet1!A:H",
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [[username, password, 0, "", "", "", new Date().toLocaleString(), "ACTIVE"]]
        }
      });

      return res.json({ message: "Register successful" });
    }

    if (action === "login") {
      const result = await sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: "Sheet1!A:H"
      });

      const rows = result.data.values || [];
      const user = rows.find(r => r[0] === username && r[1] === password);

      if (user) {
        return res.json({ message: "Login successful" });
      } else {
        return res.json({ message: "Invalid username or password" });
      }
    }

    res.status(400).json({ message: "Invalid action" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}
