import express from 'express';
import {
  applyCustodian,
  getMyCustodianProfile,
  updateMyCustodianProfile,
  getCustodianDashboard,
  getPublicCustodians,
  getCustodianById
} from '../controllers/custodianController.js';
import { protect, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getPublicCustodians);
router.get('/:id', getCustodianById);

// Protected routes (User / Custodian)
router.post('/apply', protect, applyCustodian);
router.get('/me/profile', protect, getMyCustodianProfile);
router.put('/me/profile', protect, updateMyCustodianProfile);
router.get('/me/dashboard', protect, getCustodianDashboard);

export default router;
