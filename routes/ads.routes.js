const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const { getAllAds, getAdById, createAd, updateAd, deleteAd, searchAds } = require('../controllers/ads.controller');
const upload = require('../config/multer.config');

router.get('/', getAllAds);
router.get('/search/:searchPhrase', searchAds);
router.get('/:id', getAdById);
router.post('/', authMiddleware, upload.single('image'), createAd);
router.put('/:id', authMiddleware, updateAd);
router.delete('/:id', authMiddleware, deleteAd);


module.exports = router;