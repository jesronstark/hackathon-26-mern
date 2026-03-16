const Team = require('../models/Team');
const path = require('path');
const fs = require('fs');

const MAX_TEAMS = 25;

// POST /api/register-team
const registerTeam = async (req, res) => {
  try {
    const teamCount = await Team.countDocuments();
    if (teamCount >= MAX_TEAMS) {
      return res.status(400).json({
        success: false,
        message: 'Registration Closed – Maximum Teams Reached',
      });
    }

    const {
      teamName, leaderName, member1, member2, member3,
      email, phone, college, department,
    } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'PPT file is required' });
    }

    const pptFileUrl = `/uploads/ppt/${req.file.filename}`;

    const team = new Team({
      teamName, leaderName, member1, member2, member3,
      email, phone, college, department, pptFileUrl,
    });

    await team.save();

    res.status(201).json({
      success: true,
      message: 'Team registered successfully!',
      data: {
        teamId: team._id,
        tableNumber: team.tableNumber,
        teamName: team.teamName,
      },
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: 'Team name or email already registered.' });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/teams
const getTeams = async (req, res) => {
  try {
    const teams = await Team.find().sort({ tableNumber: 1 });
    const total = await Team.countDocuments();
    res.json({ success: true, total, remaining: MAX_TEAMS - total, teams });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/team-count (public)
const getTeamCount = async (req, res) => {
  try {
    const total = await Team.countDocuments();
    res.json({ success: true, registered: total, max: MAX_TEAMS, remaining: MAX_TEAMS - total });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/team/:id
const getTeamById = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ success: false, message: 'Team not found' });
    res.json({ success: true, team });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/team/:id
const deleteTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ success: false, message: 'Team not found' });

    // Remove PPT file
    const filePath = path.join(__dirname, '..', team.pptFileUrl);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await Team.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Team deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { registerTeam, getTeams, getTeamById, deleteTeam, getTeamCount };
