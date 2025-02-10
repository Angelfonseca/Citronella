const express = require('express');
const router = express.Router();
const sellsController = require('../controllers/sells.controller');

router.get('/', sellsController.getAllSells);
router.post('/', sellsController.createSell);
router.get('/:id', sellsController.getSellById);
router.put('/:id', sellsController.updateSellById);
router.delete('/:id', sellsController.deleteSellById);

module.exports = router;
