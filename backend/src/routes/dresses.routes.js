const express = require('express');
const router = express.Router();
const dressesController = require('../controllers/dresses.controller');
const { uploadDress } = require('../middlewares/upload.middleware');

router.get('/getAll/', dressesController.getAll);
router.post('/create', uploadDress.single('image'),dressesController.create);
router.get('/getOne/:id', dressesController.getById);
router.put('/put/:id', dressesController.updateById);
router.delete('/delete/:id', dressesController.deleteById);
router.put('/changeAvailability/:id', dressesController.changeAvailability);
router.put('/changeCleaning/:id', dressesController.changeCleaning);
router.patch('/patch/:id', dressesController.patchDress);

module.exports = router;
