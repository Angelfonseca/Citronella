const rentsService = require('../services/rents.service');

const getAll = async (req, res) => {
    try {
        const rents = await rentsService.getAll();
        res.status(200).json(rents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const create = async (req, res) => {
    try {
        const rent = await rentsService.create(req.body);
        res.status(201).json(rent);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getById = async (req, res) => {
    try {
        const rent = await rentsService.getById(req.params.id);
        if (rent) {
            res.status(200).json(rent);
        } else {
            res.status(404).json({ message: 'Rent not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateById = async (req, res) => {
    try {
        const rent = await rentsService.updateById(req.params.id, req.body);
        if (rent) {
            res.status(200).json(rent);
        } else {
            res.status(404).json({ message: 'Rent not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteById = async (req, res) => {
    try {
        const rent = await rentsService.deleteById(req.params.id);
        if (rent) {
            res.status(200).json({ message: 'Rent deleted' });
        } else {
            res.status(404).json({ message: 'Rent not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const returnRent = async (req, res) => {
    try {
        const rent = await rentsService.returnRent(req.body.id, req.body.user_id);
        if (rent) {
            res.status(200).json(rent);
        } else {
            res.status(404).json({ message: 'Rent not found' });
        }
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
    returnRent
};
