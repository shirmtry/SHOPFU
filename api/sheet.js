import { google } from "googleapis";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { action, username, password } = req.body;

  try {
    // Kết nối Google Sheet
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_SERVICE_KEY),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    const spreadsheetId = process.env.SHEET_ID;
    const range = "Sheet1!A:H"; // cột A → H

    // Lấy dữ liệu hiện tại
    const getRows = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    let rows = getRows.data.values || [];

    // ================== REGISTER ==================
    if (action === "register") {
      const exist = rows.find(r => r[0] === username);
      if (exist) {
        return res.json({ message: "❌ Username đã tồn tại" });
      }

      // Thêm user mới
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range,
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [[username, password, 0, "", "", "", "", "active"]],
        },
      });

      return res.json({ message: "✅ Đăng ký thành công!" });
    }

    // ================== LOGIN ==================
    if (action === "login") {
      const user = rows.find(r => r[0] === username && r[1] === password);
      if (!user) {
        return res.json({ message: "❌ Sai username hoặc password" });
      }

      return res.json({ message: "✅ Đăng nhập thành công", success: true });
    }

    return res.json({ message: "❌ Action không hợp lệ" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}
