const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Team = require('../models/Team');
const XLSX = require('xlsx');

// POST /api/admin/login
const adminLogin = async (req, res) => {
  const { username, password } = req.body;
  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD || 'hackathon2026';

  if (username !== adminUsername || password !== adminPassword) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  const token = jwt.sign({ role: 'admin', username }, process.env.JWT_SECRET, { expiresIn: '8h' });
  res.json({ success: true, token });
};

// GET /api/admin/dashboard
const getDashboard = async (req, res) => {
  try {
    const registered = await Team.countDocuments();
    res.json({ success: true, total: 25, registered, remaining: 25 - registered });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/admin/export-excel
const exportExcel = async (req, res) => {
  try {
    const teams = await Team.find().sort({ tableNumber: 1 }).lean();
    const data = teams.map((t, i) => ({
      'S.No': i + 1,
      'Team ID': t._id.toString(),
      'Table Number': t.tableNumber,
      'Team Name': t.teamName,
      'Leader Name': t.leaderName,
      'Member 1': t.member1,
      'Member 2': t.member2,
      'Member 3': t.member3,
      Email: t.email,
      Phone: t.phone,
      College: t.college,
      Department: t.department,
      'PPT File': t.pptFileUrl,
      'Registered At': new Date(t.createdAt).toLocaleString(),
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, 'Teams');
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Disposition', 'attachment; filename=HACKATHON26_Teams.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { adminLogin, getDashboard, exportExcel };
