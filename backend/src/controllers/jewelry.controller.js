const jewelryService = require('../services/jewelry.service');

const getAll = async (req, res) => {
    try {
        const jewelries = await jewelryService.getAllJewelry();
        res.status(200).json(jewelries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const create = async (req, res) => {
    try {
        const jewelryData = { ...req.body };
        if (req.file && req.file.filename) {
            jewelryData.image = req.file.filename;
        }
        const jewelry = await jewelryService.createJewelry(jewelryData);
        res.status(201).json(jewelry);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getById = async (req, res) => {
    try {
        const jewelry = await jewelryService.getJewelryById(req.params.id);
        if (!jewelry) {
            return res.status(404).json({ message: 'Jewelry not found' });
        }
        res.status(200).json(jewelry);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateById = async (req, res) => {
    try {
        const jewelry = await jewelryService.updateJewelryById(req.params.id, req.body);
        if (!jewelry) {
            return res.status(404).json({ message: 'Jewelry not found' });
        }
        res.status(200).json(jewelry);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteById = async (req, res) => {
    try {
        const jewelry = await jewelryService.deleteJewelryById(req.params.id);
        if (!jewelry) {
            return res.status(404).json({ message: 'Jewelry not found' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAll,
    create,
    getById,
    updateById,
    deleteById
};
