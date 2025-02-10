const express = require('express');
const router = express.Router();
const jewelryController = require('../controllers/jewelry.controller');
const { uploadJewelry } = require('../middlewares/upload.middleware');

router.get('/getAll', jewelryController.getAll);
router.post('/create', uploadJewelry.single('image'), jewelryController.create);
router.get('/getOne/:id', jewelryController.getById);
router.put('/patch/:id', jewelryController.updateById);
router.delete('/delete/:id', jewelryController.deleteById);

module.exports = router;
