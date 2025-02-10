const sells = require('../models/sells.model');
const jewelrySchema = require('../models/jewelry.model');
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

module.exports = {
    getAll,
    create,
    getById,
    updateById,
    deleteById,
};
