import express from 'express';
import {
  getPublicExperiences,
  getExperienceById,
  createExperience,
  updateExperience
} from '../controllers/experienceController.js';
import { protect, requireVerifiedCustodian } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getPublicExperiences);
router.get('/:id', getExperienceById);

router.post('/', protect, requireVerifiedCustodian, createExperience);
router.put('/:id', protect, requireVerifiedCustodian, updateExperience);

export default router;
