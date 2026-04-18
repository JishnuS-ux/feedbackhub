const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Feedback = require('../models/Feedback');
const Admin = require('../models/Admin');
const { protect } = require('../middleware/auth');

// GET all feedback for logged-in admin only
router.get('/', protect, async (req, res) => {
  try {
    const feedback = await Feedback.find({ adminId: req.admin._id }).sort({
      createdAt: -1,
    });

    res.json(feedback);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new feedback for a specific admin (public)
router.post('/:adminId', async (req, res) => {
  try {
    const { adminId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(adminId)) {
      return res.status(400).json({ error: 'Invalid admin ID' });
    }

    const adminExists = await Admin.findById(adminId);
    if (!adminExists) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    const newFeedback = new Feedback({
      ...req.body,
      adminId,
    });

    const savedFeedback = await newFeedback.save();
    res.status(201).json(savedFeedback);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update feedback status (only if it belongs to logged-in admin)
router.put('/:id', protect, async (req, res) => {
  try {
    const { status } = req.body;

    const updatedFeedback = await Feedback.findOneAndUpdate(
      { _id: req.params.id, adminId: req.admin._id },
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedFeedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    res.json(updatedFeedback);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE feedback (only if it belongs to logged-in admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    const deletedFeedback = await Feedback.findOneAndDelete({
      _id: req.params.id,
      adminId: req.admin._id,
    });

    if (!deletedFeedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    res.json({ message: 'Feedback deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;