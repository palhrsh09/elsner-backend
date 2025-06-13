const express = require('express');
const router = express.Router();
const formFieldsDataController = require('../controllers/formFieldsData.controller.js');

router.get('/', formFieldsDataController.getAllformFieldsData);
router.get('/:id', formFieldsDataController.getformFieldsDataById);
router.post('/', formFieldsDataController.createformFieldsData);
router.post('/bulk', formFieldsDataController.bulkCreateformFieldsData);
router.put('/:id', formFieldsDataController.updateformFieldsData);
router.delete('/:id', formFieldsDataController.deleteformFieldsData);

module.exports = router;
