import express from "express";
import User from "../models/User.js";
import Contact from "../models/Contact.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// @route   GET /api/favorites
// @desc    Get user's favorite contacts
// @access  Private
router.get("/", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "favoriteContacts",
      options: { sort: { lastName: 1, firstName: 1 } },
    });

    res.json(user.favoriteContacts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   POST /api/favorites/:contactId
// @desc    Add contact to favorites
// @access  Private
router.post("/:contactId", protect, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.contactId);

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    const user = await User.findById(req.user._id);

    // Check if already in favorites
    if (user.favoriteContacts.includes(req.params.contactId)) {
      return res.status(400).json({ message: "Contact already in favorites" });
    }

    user.favoriteContacts.push(req.params.contactId);
    await user.save();

    res.json({
      message: "Contact added to favorites",
      favoriteContacts: user.favoriteContacts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   DELETE /api/favorites/:contactId
// @desc    Remove contact from favorites
// @access  Private
router.delete("/:contactId", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    // Check if in favorites
    if (!user.favoriteContacts.includes(req.params.contactId)) {
      return res.status(400).json({ message: "Contact not in favorites" });
    }

    user.favoriteContacts = user.favoriteContacts.filter(
      (id) => id.toString() !== req.params.contactId
    );
    await user.save();

    res.json({
      message: "Contact removed from favorites",
      favoriteContacts: user.favoriteContacts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
