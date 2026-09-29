const express = require('express');
const router = express.Router();
const { createCategory, getCategories } = require('../controllers/categoryController');
const { createCategoryValidation } = require('../validators/categoryValidator');
const { validate } = require('../middlewares/validationMiddleware');

router.post('/', createCategoryValidation, validate, createCategory);
router.get('/', getCategories);

module.exports = router;
