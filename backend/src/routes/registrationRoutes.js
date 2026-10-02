const express = require('express');
const router = express.Router({ mergeParams: true });
const { protect } = require('../middlewares/authMiddleware');
const { registerForEvent, getEventRegistrations } = require('../controllers/registrationController');

router.post('/:eventId/register', protect, registerForEvent);
router.get('/:eventId/registrations', getEventRegistrations);

module.exports = router;
