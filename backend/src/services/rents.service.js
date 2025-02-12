const rents = require('../models/rents.model');
const dresses = require('../models/dresses.model');
const getAllRents = async () => {
    try {
        return await rents.find().populate('dress_id');
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

const returnRent = async (rent_id, user_id) => {
    try {
        const rent = await rents.findById(rent_id);
        console.log(rent);
        if (!rent) {
            throw new Error('Rent not found');
        }

        console.log(rent);
        const dress = await dresses.findById(rent.dress_id);
        if (!dress) {
            throw new Error('Dress not found');
        }
        dress.available = true;
        await dress.save();
        await rents.findByIdAndUpdate(rent_id, { returned: true, recivedBy: user_id });
        return { message: 'Returned' };
    } catch (error) {
        throw new Error(error.message);
    }
};


const getRentsByDateRange = async (from, to) => {
    try {
        // Validate input dates
        const fromDate = new Date(from);
        const toDate = new Date(to);

        if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
            throw new Error('Invalid date format');
        }

        if (fromDate > toDate) {
            throw new Error('Start date must be before end date');
        }

        // Find rents within date range and populate dress information
        const rentals = await rents.find({
            rentalDate: { 
                $gte: fromDate, 
                $lte: toDate 
            }
        }).populate('dress_id');

        if (!rentals || rentals.length === 0) {
            return { message: 'No rents found in this date range', data: [] };
        }

        return {
            message: 'Rents found successfully',
            count: rentals.length,
            data: rentals
        };
    } catch (error) {
        throw new Error(`Error fetching rents by date range: ${error.message}`);
    }
};

module.exports = {
    getAllRents,
    createRent,
    getRentById,
    updateRentById,
    deleteRentById,
    returnRent,
    getRentsByDateRange

};
