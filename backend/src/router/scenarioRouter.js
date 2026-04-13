const express = require('express');
const router = express.Router();
const { generateStrategy } = require('../services/strategyService');
const { generateTurn } = require('../services/roleplayService');
const { generateTurnFeedback, generateSummary } = require('../services/coachingService');

const VALID_TYPES = ['salary', 'rent', 'freelance'];
const VALID_STYLES = ['assertive', 'diplomatic', 'collaborative'];

function validateScenario(scenario) {
  if (!scenario) return 'scenario is required';
  if (!VALID_TYPES.includes(scenario.type)) return 'scenario.type must be salary, rent, or freelance';
  if (!scenario.currentOffer || scenario.currentOffer <= 0) return 'scenario.currentOffer must be a positive number';
  if (!scenario.targetAmount || scenario.targetAmount <= 0) return 'scenario.targetAmount must be a positive number';
  return null;
}

function validateStyle(style) {
  if (!VALID_STYLES.includes(style)) return 'style must be assertive, diplomatic, or collaborative';
  return null;
}

// POST /api/strategy
router.post('/strategy', (req, res) => {
  const { scenario, style } = req.body;
  const err = validateScenario(scenario) || validateStyle(style);
  if (err) return res.status(400).json({ error: err });
  generateStrategy(scenario, style, res);
});

// POST /api/roleplay/turn
router.post('/roleplay/turn', (req, res) => {
  const { scenario, style, history, message } = req.body;
  const err = validateScenario(scenario) || validateStyle(style);
  if (err) return res.status(400).json({ error: err });
  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'message is required' });
  }
  if (!Array.isArray(history)) return res.status(400).json({ error: 'history must be an array' });
  generateTurn(scenario, style, history, message, res);
});

// POST /api/coaching/turn
router.post('/coaching/turn', (req, res) => {
  const { message, history, scenario, style } = req.body;
  const err = validateScenario(scenario) || validateStyle(style);
  if (err) return res.status(400).json({ error: err });
  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'message is required' });
  }
  if (!Array.isArray(history)) return res.status(400).json({ error: 'history must be an array' });
  generateTurnFeedback(message, history, scenario, style, res);
});

// POST /api/coaching/summary
router.post('/coaching/summary', (req, res) => {
  const { transcript, scenario, style } = req.body;
  const err = validateScenario(scenario) || validateStyle(style);
  if (err) return res.status(400).json({ error: err });
  if (!Array.isArray(transcript) || transcript.length === 0) {
    return res.status(400).json({ error: 'transcript must be a non-empty array' });
  }
  generateSummary(transcript, scenario, style, res);
});

module.exports = router;
