import express from 'express';
import {
  getPendingVerifications,
  updateCustodianVerification,
  getPlatformOverview
} from '../controllers/adminController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/verifications', protect, getPendingVerifications);
router.put('/verify-custodian/:id', protect, updateCustodianVerification);
router.get('/overview', protect, getPlatformOverview);

export default router;
