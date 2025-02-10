const dressesService = require('../services/dresses.service');
const path = require('path');

const getAll = async (req, res) => {
    try {
        const allDresses = await dressesService.getAll();
        res.status(200).json(allDresses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const create = async (req, res) => {
    try {
        const dressData = { ...req.body };

        if (req.file && req.file.filename) {
            dressData.image = path.join(req.file.filename);
        }
        const newDress = await dressesService.create(dressData);
        res.status(201).json(newDress);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getById = async (req, res) => {
    try {
        const dress = await dressesService.getById(req.params.id);
        if (!dress) {
            return res.status(404).json({ message: 'Dress not found' });
        }
        res.status(200).json(dress);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateById = async (req, res) => {
    try {
        const updatedDress = await dressesService.updateById(req.params.id, req.body);
        if (!updatedDress) {
            return res.status(404).json({ message: 'Dress not found' });
        }
        res.status(200).json(updatedDress);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteById = async (req, res) => {
    try {
        const deletedDress = await dressesService.deleteById(req.params.id);
        if (!deletedDress) {
            return res.status(404).json({ message: 'Dress not found' });
        }
        res.status(200).json({ message: 'Dress deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const changeAvailability = async (req, res) => {
    try {
        const dress = await dressesService.changeAvailability(req.params.id);
        if (!dress) {
            return res.status(404).json({ message: 'Dress not found' });
        }
        res.status(200).json(dress);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const changeCleaning = async (req, res) => {
    try {
        const dress = await dressesService.changeCleaning(req.params.id);
        if (!dress) {
            return res.status(404).json({ message: 'Dress not found' });
        }
        res.status(200).json(dress);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const patchDress = async (req, res) => {
    try {
        const dress = await dressesService.patchDress(req.params.id, req.body);
        if (!dress) {
            return res.status(404).json({ message: 'Dress not found' });
        }
        res.status(200).json(dress);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    getAll,
    create,
    getById,
    updateById,
    deleteById,
    changeAvailability,
    changeCleaning,
    patchDress
};
