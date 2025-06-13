const express = require('express');
const router = express.Router();
const forms = require('../controllers/forms.controller.js');

router.get('/', forms.getAllforms);
router.get('/:id', forms.getformsById);
router.post('/', forms.createforms);
router.put('/:id', forms.updateforms);
router.delete('/:id', forms.deleteforms);

module.exports = router;
