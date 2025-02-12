const usersService = require('../services/users.service');

const getAllUsers = async (req, res) => {
    try {
        const data = await usersService.getAllUsers();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createUser = async (req, res) => {
    try {
        const data = req.body;
        const newUsers = await usersService.createUser(data);
        res.status(201).json(newUsers);
    } catch (error) {
        res.status(500).json({ error: error.message });
        throw new Error(`Error creating user: ${error.message}`);
    }
};

const getUserById = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await usersService.getUserById(id);
        if (!data) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateUserById = async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const updatedUser = await usersService.updateUserById(id, data);
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'Updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
        throw new Error(`Error updating user: ${error.message}`);
    }
};

const deleteUserById = async (req, res) => {
    try {
        const id = req.params.id;
        const deletedUser = await usersService.deleteUserById(id);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'Deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const data = req.body;
        const userCredentials = await usersService.loginUser(data);
        if (!userCredentials) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        res.json(userCredentials);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getAllUsers,
    createUser,
    getUserById,
    updateUserById,
    deleteUserById,
    login,
};
