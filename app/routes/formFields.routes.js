const express = require('express');
const router = express.Router();
const formFieldController = require('../controllers/formFields.controller.js');

router.get('/', formFieldController.getAllformFields);
router.get('/:id', formFieldController.getformFieldsById);
router.post('/', formFieldController.createformFields);
router.post('/bulk', formFieldController.bulkCreateformFields);
router.put('/:id', formFieldController.updateformFields);
router.delete('/:id', formFieldController.deleteformFields);

module.exports = router;
