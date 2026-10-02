const express = require('express');
const router = express.Router({ mergeParams: true });
const { protect } = require('../middlewares/authMiddleware');
const { registerForEvent, cancelRegistration, getEventRegistrations } = require('../controllers/registrationController');

router.post('/:eventId/register', protect, registerForEvent);
router.delete('/:eventId/register', protect, cancelRegistration);
router.get('/:eventId/registrations', getEventRegistrations);

module.exports = router;
