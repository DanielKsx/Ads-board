const AdModel = require('../models/Ad.model');
const removeFile = require('../utils/removeFile');

module.exports.getAllAds = async (req, res) => {
    try {
        const ads = await AdModel.find().sort({ date: -1 }).populate('seller', 'login avatar phone');
        res.json(ads);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports.searchAds = async (req, res) => {
    try {
        const search = req.params.searchPhrase;
        const ads = await AdModel.find({
            title: { $regex: search, $options: 'i' }
        }).sort({ date: -1 }).populate('seller');

        res.json(ads);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports.getAdById = async (req, res) => {
    try {
        const ad = await AdModel.findById(req.params.id).populate('seller', 'login avatar phone')
        if (!ad) {
            return res.status(404).json({ message: 'Ad not found' });
        }
        res.json(ad)
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports.createAd = async (req, res) => {
    const { title, content, price, location } = req.body;

    if (!title || !content || !price || !location) {
        if (req.file) removeFile(`/uploads/${req.file.filename}`);
        return res.status(400).json({ message: 'Missing required fields' });
    }
    if (title.trim().length < 10 || title.trim().length > 50) {
        if (req.file) removeFile(`/uploads/${req.file.filename}`);
        return res.status(400).json({ message: 'Title must be between 10 and 50 characters' });
    }
    if (content.trim().length < 20 || content.trim().length > 1000) {
        if (req.file) removeFile(`/uploads/${req.file.filename}`);
        return res.status(400).json({ message: 'Content must be between 20 and 1000 characters' });
    }
    if (isNaN(Number(price)) || Number(price) <= 0) {
        if (req.file) removeFile(`/uploads/${req.file.filename}`);
        return res.status(400).json({ message: 'Price must be a number greater than 0' });
    }
    if (!req.file) {
        return res.status(400).json({ message: 'Image is required' });
    }

    try {
        const newAd = new AdModel({
            title: title.trim(),
            content: content.trim(),
            image: `/uploads/${req.file.filename}`,
            location,
            price: Number(price),
            seller: req.session.user.id,
        });

        const savedAd = await newAd.save();
        res.status(201).json(savedAd);
    } catch (err) {
        if (req.file) removeFile(`/uploads/${req.file.filename}`);
        res.status(500).json({ message: err.message });
    }
};

module.exports.updateAd = async (req, res) => {
    const { title, content, price, location } = req.body;

    if (!title || !content || !price || !location) {
        if (req.file) removeFile(`/uploads/${req.file.filename}`);
        return res.status(400).json({ message: 'Missing required fields' });
    }
    if (title.trim().length < 10 || title.trim().length > 50) {
        if (req.file) removeFile(`/uploads/${req.file.filename}`);
        return res.status(400).json({ message: 'Title must be between 10 and 50 characters' });
    }
    if (content.trim().length < 20 || content.trim().length > 1000) {
        if (req.file) removeFile(`/uploads/${req.file.filename}`);
        return res.status(400).json({ message: 'Content must be between 20 and 1000 characters' });
    }
    if (isNaN(Number(price)) || Number(price) <= 0) {
        if (req.file) removeFile(`/uploads/${req.file.filename}`);
        return res.status(400).json({ message: 'Price must be a number greater than 0' });
    }
    try {
        const ad = await AdModel.findById(req.params.id);

        if (!ad) {
            if (req.file) removeFile(`/uploads/${req.file.filename}`);
            return res.status(404).json({ message: 'Ad not found' });
        }
        if (ad.seller.toString() !== req.session.user.id) {
            if (req.file) removeFile(`/uploads/${req.file.filename}`);
            return res.status(403).json({ message: 'Forbidden' });
        }
        if (req.file) {
            removeFile(ad.image);
            ad.image = `/uploads/${req.file.filename}`;
        }

        ad.title = title.trim();
        ad.content = content.trim();
        ad.location = location;
        ad.price = Number(price);

        const updatedAd = await ad.save();
        res.json(updatedAd);
    } catch (err) {
        if (req.file) removeFile(`/uploads/${req.file.filename}`);
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

