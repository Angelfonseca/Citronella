const rentsService = require('../services/rents.service');

const getAll = async (req, res) => {
    try {
        const rents = await rentsService.getAllRents();
        res.status(200).json(rents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const create = async (req, res) => {
    try {
        const rent = await rentsService.createRent(req.body);
        res.status(201).json(rent);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getById = async (req, res) => {
    try {
        const rent = await rentsService.getRentById(req.params.id);
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
        const rent = await rentsService.updateRentById(req.params.id, req.body);
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
        const rent = await rentsService.deleteRentById(req.params.id);
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
        const rent_id = req.params.id;
        const user_id = req.body.user_id;
        console.log(rent_id, user_id);
        const rent = await rentsService.returnRent(rent_id, user_id);
        if (rent) {
            res.status(200).json(rent);
        } else {
            res.status(404).json({ message: 'Rent not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
        throw new Error(error.message);
    }
}

const getRentsByDateRange = async (req, res) => {
    try {
        const { from, to } = req.body;
        const rents = await rentsService.getRentsByDateRange(from, to);
        res.status(200).json(rents);
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
    returnRent,
    getRentsByDateRange
};
