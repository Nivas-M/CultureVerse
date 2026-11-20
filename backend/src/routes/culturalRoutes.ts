import express from 'express';
import {
  getCulturalOverview,
  getRituals,
  getFestivals,
  getArtsAndCrafts,
  getStories,
  getPlacesAndEcology,
  getTerms,
  getCulturalGraph
} from '../controllers/culturalController.js';

const router = express.Router();

router.get('/overview', getCulturalOverview);
router.get('/rituals', getRituals);
router.get('/festivals', getFestivals);
router.get('/arts', getArtsAndCrafts);
router.get('/stories', getStories);
router.get('/places', getPlacesAndEcology);
router.get('/terms', getTerms);
router.get('/graph', getCulturalGraph);

export default router;
