const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');

// GET all feedback
router.get('/', async (req, res) => {
  try {
    const feedback = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new feedback
router.post('/', async (req, res) => {
  try {
    const newFeedback = new Feedback(req.body);
    const savedFeedback = await newFeedback.save();
    res.status(201).json(savedFeedback);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update feedback status
router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const updatedFeedback = await Feedback.findByIdAndUpdate(
      req.params.id, 
      { status },
      { new: true, runValidators: true }
    );
    if (!updatedFeedback) return res.status(404).json({ error: 'Feedback not found' });
    res.json(updatedFeedback);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE feedback
router.delete('/:id', async (req, res) => {
  try {
    const deletedFeedback = await Feedback.findByIdAndDelete(req.params.id);
    if (!deletedFeedback) return res.status(404).json({ error: 'Feedback not found' });
    res.json({ message: 'Feedback deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
