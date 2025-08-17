// /api/sheet.js
import { google } from "googleapis";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { action, username, password } = req.body;

  // Lấy credentials từ biến môi trường Vercel
  const auth = new google.auth.GoogleAuth({
    credentials: {
      type: "service_account",
      project_id: process.env.GOOGLE_PROJECT_ID,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = process.env.SHEET_ID; // ID sheet bạn lấy ở URL Google Sheet

  try {
    // Lấy toàn bộ dữ liệu trong sheet
    const getRows = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Sheet1!A2:B", // cột A: username, B: password
    });

    let rows = getRows.data.values || [];

    if (action === "register") {
      // check username tồn tại chưa
      if (rows.find(r => r[0] === username)) {
        return res.json({ success: false, message: "❌ Username đã tồn tại" });
      }

      // ghi user mới vào sheet
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: "Sheet1!A:B",
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [[username, password, 0]], // balance = 0
        },
      });

      return res.json({ success: true, message: "✅ Đăng ký thành công" });
    }

    if (action === "login") {
      const user = rows.find(r => r[0] === username && r[1] === password);
      if (user) {
        return res.json({ success: true, message: "✅ Đăng nhập thành công" });
      } else {
        return res.json({ success: false, message: "❌ Sai Username hoặc Password" });
      }
    }

    return res.json({ success: false, message: "❌ Action không hợp lệ" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Lỗi server" });
  }
}
