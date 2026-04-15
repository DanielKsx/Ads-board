const express = require('express');
const AdModel = require('../models/Ad.model');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');

router.get('/', async (req, res) => {
    const ads = await AdModel.find()
    res.json(ads)
});

router.post('/', authMiddleware, async (req, res) => {
    try {
        const newAd = new AdModel({
            title: req.body.title,
            content: req.body.content,
            image: req.body.image,
            location: req.body.location,
            price: req.body.price,
            seller: req.session.user.id,
        });
        await newAd.save()
        res.json(newAd)
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
});

router.get('/search/:searchPhrase', async (req, res) => {
    try {
        const search = req.params.searchPhrase
        const ads = await AdModel.find({ title: { $regex: search, $options: 'i' } })
        res.json(ads);
    } catch (err) {
        res.status(500).json({ message: err.message });
        return;
    }
});

router.get('/:id', async (req, res) => {
    const adId = await AdModel.findById(req.params.id).populate('seller')
    if (!adId) {
        res.status(404).json({ message: 'Ad not found' });
        return;
    }
    res.json(adId)

});

router.delete('/:id', authMiddleware, async (req, res) => {
    const ad = await AdModel.findById(req.params.id)
    if (!ad) {
        res.status(404).json({ message: 'not found' });
        return;
    }
    if (ad.seller.toString() !== req.session.user.id){
        return res.status(403).json({ message: 'Forbidden'});
    }
    await ad.deleteOne()
    res.json({ message: 'Ad deleted' })
});

router.put('/:id', authMiddleware, async (req, res) => {
    const ad = await AdModel.findById(req.params.id)
    if (!ad) {
        res.status(404).json({ message: 'not found' });
        return;
    }
    if (ad.seller.toString() !== req.session.user.id){
        return res.status(403).json({ message: 'Forbidden' });
    }
    ad.title = req.body.title;
    ad.content = req.body.content;
    ad.image = req.body.image;
    ad.location = req.body.location;
    ad.price = req.body.price;
    await ad.save();
    res.json(ad);
});


module.exports = router;