const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');
const ensureAuth = require('../middlewares/auth.middleware');

router.get('/', ensureAuth.ensureAuth,usersController.getAllUsers);
router.post('/', ensureAuth.ensureAuth,usersController.createUser);
router.get('/:id', ensureAuth.ensureAuth,usersController.getUserById);
router.put('/:id', ensureAuth.ensureAuth,usersController.updateUserById);
router.delete('/:id', ensureAuth.ensureAuth,usersController.deleteUserById);
router.post('/login', usersController.login);

module.exports = router;
