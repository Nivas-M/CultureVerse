import express from 'express';
import {
  getPublicKnowledge,
  getKnowledgeById,
  createDraftKnowledge,
  structureKnowledgeWithAI,
  approveKnowledge,
  addPerspective
} from '../controllers/knowledgeController.js';
import { protect, requireVerifiedCustodian } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getPublicKnowledge);
router.get('/:id', getKnowledgeById);

router.post('/draft', protect, createDraftKnowledge);
router.post('/structure-ai', protect, structureKnowledgeWithAI);
router.put('/:id/approve', protect, requireVerifiedCustodian, approveKnowledge);
router.post('/:id/perspective', protect, requireVerifiedCustodian, addPerspective);

export default router;
