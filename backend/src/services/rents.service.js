const rents = require('../models/rents.model');
const dresses = require('../models/dresses.model');
const getAllRents = async () => {
    try {
        return await rents.find();
    } catch (error) {
        throw new Error(error.message);
    }
};

const createRent = async (data) => {
    try {
        const dress = await dresses.findById(data.dress_id);
        if (!dress) {
            throw new Error('Dress not found');
        }
        dress.available = false;
        await dress.save();
        const newRents = new rents(data);
        await newRents.save();
        return newRents;
    } catch (error) {
        throw new Error(error.message);
    }
};

const getRentById = async (id) => {
    try {
        const rent = await rents.findById(id);
        if (!rent) {
            throw new Error('Rent not found');
        }
        return rent;
    } catch (error) {
        throw new Error(error.message);
    }
};

const updateRentById = async (id, data) => {
    try {
        const rent = await rents.findByIdAndUpdate(id, data);
        if (!rent) {
            throw new Error('Rent not found');
        }
        return { message: 'Updated' };
    } catch (error) {
        throw new Error(error.message);
    }
};

const deleteRentById = async (id) => {
    try {
        const rent = await rents.findByIdAndDelete(id);
        if (!rent) {
            throw new Error('Rent not found');
        }
        return { message: 'Deleted' };
    } catch (error) {
        throw new Error(error.message);
    }
};

const returnRent = async (id, user_id) => {
    try {
        const rent = await rents.findById(id);
        if (!rent) {
            throw new Error('Rent not found');
        }
        const dress = await dresses.findById(rent.dress_id);
        if (!dress) {
            throw new Error('Dress not found');
        }
        dress.available = true;
        await dress.save();
        await rents.findByIdAndUpdate(id, { returned: true, recivedBy: user_id });
        return { message: 'Returned' };
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = {
    getAllRents,
    createRent,
    getRentById,
    updateRentById,
    deleteRentById,
    returnRent,

};
