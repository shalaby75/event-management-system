const express = require('express');
const router = express.Router();
const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} = require('../controllers/eventController');
const { protect } = require('../middlewares/authMiddleware');
const {
  createEventValidation,
  updateEventValidation,
  eventIdValidation,
} = require('../validators/eventValidator');
const { validate } = require('../middlewares/validationMiddleware');

router.post('/', protect, createEventValidation, validate, createEvent);
router.get('/', getEvents);
router.get('/:id', eventIdValidation, validate, getEventById);
router.put('/:id', protect, updateEventValidation, validate, updateEvent);
router.delete('/:id', protect, eventIdValidation, validate, deleteEvent);

module.exports = router;
