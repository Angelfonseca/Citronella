const dressesModel = require('../models/dresses.model');
const getAll = async () => {
    try {
        return await dressesModel.find();
    } catch (error) {
        console.error("Error getting all dresses:", error);
        throw error;
    }
};

const create = async (dressData) => {
    try {
        const dress = await dressesModel.create(dressData);
        return dress;
    } catch (error) {
        console.error("Error creating dress:", error);
        throw error;
    }
};

const getDressById = async (id) => {
    try {
        const dress = await dressesModel.findById(id);
        if (!dress) {
            return null;
        }
        return dress;
    } catch (error) {
        console.error("Error getting dress by ID:", error);
        throw error;
    }
};

const updateDressById = async (id, dressData) => {
    try {
        const dress = await dressesModel.findByIdAndUpdate(id, dressData);
         if (!dress) {
            return null;
        }
        return { message: 'Updated' };
    } catch (error) {
        console.error("Error updating dress:", error);
        throw error;
    }
};

const deleteDressById = async (id) => {
    try {
        const dress = await dressesModel.findByIdAndDelete(id);
        if (!dress) {
            return null;
        }
        return { message: 'Deleted' };
    } catch (error) {
        console.error("Error deleting dress:", error);
        throw error;
    }
};

const changeAvailability = async (id) => {
    try {
        const dress = await dressesModel.findById(id);
        if (!dress) {
            return null;
        }
        dress.available = !dress.available;
        await dress.save();
        return { message: 'Availability changed' };
    } catch (error) {
        console.error("Error changing availability:", error);
        throw error;
    }
};

const changeCleaning = async (id) => {
    try {
        const dress = await dressesModel.findById(id);
        if (!dress) {
            return null;
        }
        dress.cleaning = !dress.cleaning;
        await dress.save();
        return { message: 'Cleaning changed' };
    } catch (error) {
        console.error("Error changing cleaning:", error);
        throw error;
    }
};

const patchDress = async (id, dressData) => {
    try {
        const dress = await dressesModel.findByIdAndUpdate(id, dressData, { new: true });
        if (!dress) {
            return null;
        }
        return { message: 'Patched' };
    }
    catch (error) {
        console.error("Error patching dress:", error);
        throw error;
    }
};
module.exports = {
    getAll,
    create,
    getDressById,
    updateDressById,
    deleteDressById,
    changeAvailability,
    changeCleaning,
    patchDress
};
