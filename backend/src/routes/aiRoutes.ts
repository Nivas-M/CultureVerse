import express from 'express';
import { askCulturalAssistant } from '../controllers/aiController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/ask', optionalAuth, askCulturalAssistant);
router.post('/query', optionalAuth, askCulturalAssistant);

export default router;
