const Event = require('../models/Event');
const Category = require('../models/Category');

// @desc    Create a new event
// @route   POST /api/events
// @access  Private
const createEvent = async (req, res, next) => {
  try {
    const { title, description, date, location, capacity, category } = req.body;

    // Verify category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    // Create event with authenticated user as creator
    const event = await Event.create({
      title,
      description,
      date,
      location,
      capacity,
      category,
      createdBy: req.user._id,
    });

    // Populate category and createdBy for response
    const populatedEvent = await Event.findById(event._id)
      .populate('category', 'name')
      .populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: populatedEvent,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all events (with filtering/search)
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res, next) => {
  try {
    const { location, category, search } = req.query;
    const query = {};

    // Filter by location (case-insensitive partial match)
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    // Filter by category ID
    if (category) {
      query.category = category;
    }

    // Search in title and description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const events = await Event.find(query)
      .populate('category', 'name')
      .populate('createdBy', 'name email')
      .sort({ date: 1 });

    res.status(200).json({
      success: true,
      message: 'Events retrieved successfully',
      count: events.length,
      data: events,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Public
const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('category', 'name')
      .populate('createdBy', 'name email');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Event retrieved successfully',
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private (creator only)
const updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Authorization: only creator can update
    if (event.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this event',
      });
    }

    const { title, description, date, location, capacity, category } = req.body;

    // If category is being updated, verify it exists
    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(404).json({
          success: false,
          message: 'Category not found',
        });
      }
    }

    // Update fields
    event.title = title || event.title;
    event.description = description || event.description;
    event.date = date || event.date;
    event.location = location || event.location;
    event.capacity = capacity || event.capacity;
    event.category = category || event.category;

    await event.save();

    const updatedEvent = await Event.findById(event._id)
      .populate('category', 'name')
      .populate('createdBy', 'name email');

    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: updatedEvent,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private (creator only)
const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Authorization: only creator can delete
    if (event.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this event',
      });
    }

    await event.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
};
