const AdModel = require('../models/Ad.model');
const removeFile = require('../utils/removeFile');

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
            return res.status(404).json({ message: 'Ad not found' });
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
            image: req.file ? `/uploads/${req.file.filename}` : null,
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
            return res.status(404).json({ message: 'Ad not found' });

        }
        if (ad.seller.toString() !== req.session.user.id) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        if (req.file) {
            removeFile(ad.image);
            ad.image = `/uploads/${req.file.filename}`;
        }
        ad.title = req.body.title;
        ad.content = req.body.content;
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
            return res.status(404).json({ message: 'Ad not found' });
        }
        if (ad.seller.toString() !== req.session.user.id) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        removeFile(ad.image);

        await ad.deleteOne()
        res.json({ message: 'Ad deleted' })
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

