const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const auth = require('../middleware/auth');
const {
  registerTeam, getTeams, getTeamById, deleteTeam, getTeamCount,
} = require('../controllers/teamController');

// Public routes
router.get('/team-count', getTeamCount);
router.post('/register-team', upload.single('pptFile'), registerTeam);

// Protected routes (admin)
router.get('/teams', auth, getTeams);
router.get('/team/:id', auth, getTeamById);
router.delete('/team/:id', auth, deleteTeam);

module.exports = router;
