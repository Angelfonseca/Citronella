const users = require('../models/users.model');
const {createToken} = require('../utils/jwt.utils');

const getAllUsers = async () => {
    try {
        return await users.find();
    } catch (error) {
        throw new Error(`Error getting all users: ${error.message}`);
    }
};

const createUser = async (userData) => {
    try {
        return await users.create(userData);
    } catch (error) {
        throw new Error(`Error creating user: ${error.message}`);
    }
};

const getUserById = async (id) => {
    try {
        return await users.findById(id);
    } catch (error) {
        throw new Error(`Error getting user by ID: ${error.message}`);
    }
};

const updateUserById = async (id, userData) => {
    try {
        await users.findByIdAndUpdate(id, userData);
        return { message: 'Updated' };
    } catch (error) {
        throw new Error(`Error updating user: ${error.message}`);
    }
};

const deleteUserById = async (id) => {
    try {
        await users.findByIdAndDelete(id);
        return { message: 'Deleted' };
    } catch (error) {
        throw new Error(`Error deleting user: ${error.message}`);
    }
};

const loginUser = async (userData) => {
    const user = await users.findOne({ username: userData.username });
    if (!user) {
        return { message: 'User not found' };
    }
    const isMatch = await user.comparePassword(userData.password);
    if (!isMatch) {
        return { message: 'Invalid password' };
    }
    const token = createToken({ id: user._id, username: user.username });
    return { user, token };
};



module.exports = {
    getAllUsers,
    createUser,
    getUserById,
    updateUserById,
    deleteUserById,
    loginUser,
};
