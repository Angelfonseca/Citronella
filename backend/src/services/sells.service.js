const sells = require('../models/sells.model');
const jewelrySchema = require('../models/jewelry.model');
const dresses = require('../models/dresses.model');
const getAll = async () => {
    try {
        return await sells.find();
    } catch (error) {
        throw new Error(error);
    }
};

const create = async (data) => {
    try {
        for (const product of data.products) {
            if (product.product_model === 'jewelry') {
                const jewelry = await jewelrySchema.findById(product.product_id);
                if (!jewelry) {
                    throw new Error(`Jewelry with id ${product.product_id} not found`);
                }
                if (jewelry.stock < product.quantity) {
                    throw new Error(`Not enough stock for jewelry ${product.product_id}`);
                }
                jewelry.stock -= product.quantity;
                await jewelry.save();
            }
            if (product.product_model === 'dresses') {
                const dress = await dresses.findById(product.product_id);
                if (!dress) {
                    throw new Error(`Dress with id ${product.product_id} not found`);
                }
                dress.available = false;
                dress.sold = true;
                await dress.save();
            }
        }

        const newSells = new sells(data);
        return await newSells.save();
    } catch (error) {
        throw new Error(error);
    }
};

const getById = async (id) => {
    try {
        return await sells.findById(id);
    } catch (error) {
        throw new Error(error);
    }
};

const updateById = async (id, data) => {
    try {
        await sells.findByIdAndUpdate(id, data);
        return { message: 'Updated' };
    } catch (error) {
        throw new Error(error);
    }
};

const deleteById = async (id) => {
    try {
        await sells.findByIdAndDelete(id);
        return { message: 'Deleted' };
    } catch (error) {
        throw new Error(error);
    }
};

const getSellsByRange = async (from, to) => {
    try {
        // Validate inputs
        if (!from || !to) {
            throw new Error('Both from and to dates are required');
        }

        // Convert strings to Date objects if needed
        const fromDate = new Date(from);
        const toDate = new Date(to);

        // Validate date objects
        if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
            throw new Error('Invalid date format');
        }

        // Ensure from date is before to date
        if (fromDate > toDate) {
            throw new Error('From date must be before or equal to to date');
        }

        // Set time to start and end of days
        fromDate.setHours(0, 0, 0, 0);
        toDate.setHours(23, 59, 59, 999);

        const results = await sells.find({
            createdAt: { 
                $gte: fromDate,
                $lte: toDate 
            }
        }).sort({ createdAt: 1 });

        return results;
    } catch (error) {
        throw new Error(`Error fetching sells by range: ${error.message}`);
    }
};

module.exports = {
    getAll,
    create,
    getById,
    updateById,
    deleteById,
    getSellsByRange
};
