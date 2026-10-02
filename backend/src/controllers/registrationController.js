const Event = require('../models/Event');
const Registration = require('../models/Registration');

// @desc    Register for an event
// @route   POST /api/events/:eventId/register
// @access  Private
const registerForEvent = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const userId = req.user._id;

    // 1. Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // 2. Check if user is already registered
    const existingRegistration = await Registration.findOne({
      user: userId,
      event: eventId,
    });
    if (existingRegistration) {
      return res.status(409).json({
        success: false,
        message: 'Already registered for this event',
      });
    }

    // 3. Check event capacity
    const registrationCount = await Registration.countDocuments({ event: eventId });
    if (registrationCount >= event.capacity) {
      return res.status(400).json({
        success: false,
        message: 'Event is at full capacity',
      });
    }

    // 4. Create registration
    const registration = await Registration.create({
      user: userId,
      event: eventId,
    });

    res.status(201).json({
      success: true,
      message: 'Successfully registered for event',
      data: registration,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all registrations for an event
// @route   GET /api/events/:eventId/registrations
// @access  Public
const getEventRegistrations = async (req, res, next) => {
  try {
    const { eventId } = req.params;

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    const registrations = await Registration.find({ event: eventId })
      .populate('user', 'name email')
      .sort({ registeredAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Registrations retrieved successfully',
      count: registrations.length,
      data: registrations,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { registerForEvent, getEventRegistrations };
