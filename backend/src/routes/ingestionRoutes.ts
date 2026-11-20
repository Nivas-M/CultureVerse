import express from 'express';
import {
  triggerOSMIngestion,
  triggerWikimediaIngestion,
  getCandidates,
  reviewCandidate,
  promoteCandidate
} from '../controllers/ingestionController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/fetch-osm', protect, triggerOSMIngestion);
router.post('/fetch-wikimedia', protect, triggerWikimediaIngestion);
router.get('/candidates', protect, getCandidates);
router.put('/candidates/:id/review', protect, reviewCandidate);
router.post('/candidates/:id/promote', protect, promoteCandidate);

export default router;
