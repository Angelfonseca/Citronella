const express = require('express');
const router = express.Router();
const rentsController = require('../controllers/rents.controller');

router.get('/', rentsController.getAll);
router.post('/', rentsController.create);
router.get('/:id', rentsController.getById);
router.put('/update/:id', rentsController.updateById);
router.delete('/:id', rentsController.deleteById);
router.post('/return/:id', rentsController.returnRent);
router.get('/range/:id', rentsController.getRentsByDateRange);

module.exports = router;
