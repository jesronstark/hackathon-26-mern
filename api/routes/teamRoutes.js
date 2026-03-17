const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const { upload } = require('../middleware/upload');

router.post('/register-team', upload.single('pptFile'), teamController.registerTeam);
router.get('/team-count', teamController.getTeamCount);
router.get('/teams', teamController.getTeams);
router.delete('/team/:id', teamController.deleteTeam);

module.exports = router;
