const express = require('express');
const router = express.Router({ mergeParams: true });
const { protect } = require('../middlewares/authMiddleware');
const { registerForEvent, cancelRegistration, getEventRegistrations } = require('../controllers/registrationController');
const { registrationEventIdValidation } = require('../validators/eventValidator');
const { validate } = require('../middlewares/validationMiddleware');

router.post('/:eventId/register', protect, registrationEventIdValidation, validate, registerForEvent);
router.delete('/:eventId/register', protect, registrationEventIdValidation, validate, cancelRegistration);
router.get('/:eventId/registrations', registrationEventIdValidation, validate, getEventRegistrations);

module.exports = router;
