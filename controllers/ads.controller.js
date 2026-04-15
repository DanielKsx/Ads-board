const AdModel = require('../models/Ad.model');

module.exports.getAllAds = async (req, res) => {
    try {
        const ads = await AdModel.find()
        res.json(ads);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports.searchAds = async (req, res) => {
    try {
        const search = req.params.searchPhrase
        const ads = await AdModel.find({ title: { $regex: search, $options: 'i' } })
        res.json(ads);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports.getAdById = async (req, res) => {
    try {
        const ad = await AdModel.findById(req.params.id).populate('seller')
        if (!ad) {
            res.status(404).json({ message: 'Ad not found' });
            return;
        }
        res.json(ad)
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports.createAd = async (req, res) => {
    try {
        const newAd = new AdModel({
            title: req.body.title,
            content: req.body.content,
            image: req.body.image,
            location: req.body.location,
            price: req.body.price,
            seller: req.session.user.id,
        });
        const savedAd = await newAd.save()
        res.json(savedAd);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

module.exports.updateAd = async (req, res) => {
    try {
        const ad = await AdModel.findById(req.params.id)
        if (!ad) {
            res.status(404).json({ message: 'Ad not found' });
            return;
        }
        if (ad.seller.toString() !== req.session.user.id) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        ad.title = req.body.title;
        ad.content = req.body.content;
        ad.image = req.body.image;
        ad.location = req.body.location;
        ad.price = req.body.price;
        const updatedAd = await ad.save();
        res.json(updatedAd);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports.deleteAd = async (req, res) => {
    try {
        const ad = await AdModel.findById(req.params.id)
        if (!ad) {
            res.status(404).json({ message: 'Ad not found' });
            return;
        }
        if (ad.seller.toString() !== req.session.user.id) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        await ad.deleteOne()
        res.json({ message: 'Ad deleted' })
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

