const jewelryModel = require('../models/jewelry.model');

const getAllJewelry = async () => {
    try {
        return await jewelryModel.find();
    } catch (error) {
        throw new Error(error.message);
    }
};

const createJewelry = async (data) => {
    try {
        const newJewelry = new jewelryModel(data);
        return await newJewelry.save();
    } catch (error) {
        throw new Error(error.message);
    }
};

const getJewelryById = async (id) => {
    try {
        return await jewelryModel.findById(id);
    } catch (error) {
        throw new Error(error.message);
    }
};

const updateJewelryById = async (id, data) => {
    try {
        await jewelryModel.findByIdAndUpdate(id, data);
        return { message: 'Updated' };
    } catch (error) {
        throw new Error(error.message);
    }
};

const deleteJewelryById = async (id) => {
    try {
        await jewelryModel.findByIdAndDelete(id);
        return { message: 'Deleted' };
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = {
    getAllJewelry,
    createJewelry,
    getJewelryById,
    updateJewelryById,
    deleteJewelryById,
};
