import express from 'express';
import { getGoogleReviews,getGooglePhotos } from '../controllers/googleApiController.js';

const router = express.Router();

// Route to fetch Google reviews
router.get('/reviews', getGoogleReviews);
router.get('/photos', getGooglePhotos);
export default router;

