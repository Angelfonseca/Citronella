const sellsService = require('../services/sells.service');

const getAllSells = async (req, res) => {
    try {
        const sells = await sellsService.getAll();
        res.status(200).json(sells);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createSell = async (req, res) => {
    try {
        const sell = await sellsService.create(req.body);
        res.status(201).json(sell);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getSellById = async (req, res) => {
    try {
        const sell = await sellsService.getById(req.params.id);
        if (!sell) {
            return res.status(404).json({ message: 'Sell not found' });
        }
        res.status(200).json(sell);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateSellById = async (req, res) => {
    try {
        const sell = await sellsService.updateById(req.params.id, req.body);
        if (!sell) {
            return res.status(404).json({ message: 'Sell not found' });
        }
        res.status(200).json(sell);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteSellById = async (req, res) => {
    try {
        const sell = await sellsService.deleteById(req.params.id);
        if (!sell) {
            return res.status(404).json({ message: 'Sell not found' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllSells,
    createSell,
    getSellById,
    updateSellById,
    deleteSellById
};
