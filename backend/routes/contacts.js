import express from "express";
import { body, validationResult } from "express-validator";
import Contact from "../models/Contact.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// @route   GET /api/contacts
// @desc    Get all contacts with pagination and search
// @access  Public
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const skip = (page - 1) * limit;

    // Build search query
    let query = {};
    if (search) {
      query = {
        $or: [
          { firstName: { $regex: search, $options: "i" } },
          { lastName: { $regex: search, $options: "i" } },
          { phoneNumber: { $regex: search, $options: "i" } },
        ],
      };
    }

    // Get total count for pagination
    const total = await Contact.countDocuments(query);

    // Get contacts sorted by last name, then first name
    const contacts = await Contact.find(query)
      .sort({ lastName: 1, firstName: 1 })
      .skip(skip)
      .limit(limit)
      .populate("createdBy", "email");

    res.json({
      contacts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalContacts: total,
      hasMore: page * limit < total,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   GET /api/contacts/:id
// @desc    Get a single contact by ID
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id).populate(
      "createdBy",
      "email"
    );

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.json(contact);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   POST /api/contacts
// @desc    Create a new contact
// @access  Private
router.post(
  "/",
  protect,
  [
    body("firstName").trim().notEmpty().withMessage("First name is required"),
    body("lastName").trim().notEmpty().withMessage("Last name is required"),
    body("address.street")
      .trim()
      .notEmpty()
      .withMessage("Street address is required"),
    body("address.city").trim().notEmpty().withMessage("City is required"),
    body("address.state").trim().notEmpty().withMessage("State is required"),
    body("address.zipCode")
      .trim()
      .notEmpty()
      .withMessage("Zip code is required"),
    body("phoneNumber")
      .trim()
      .notEmpty()
      .withMessage("Phone number is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { firstName, lastName, address, phoneNumber } = req.body;

      const contact = await Contact.create({
        firstName,
        lastName,
        address,
        phoneNumber,
        createdBy: req.user._id,
      });

      res.status(201).json(contact);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// @route   PUT /api/contacts/:id
// @desc    Update a contact
// @access  Private (only owner)
router.put(
  "/:id",
  protect,
  [
    body("firstName")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("First name cannot be empty"),
    body("lastName")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Last name cannot be empty"),
    body("phoneNumber")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Phone number cannot be empty"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const contact = await Contact.findById(req.params.id);

      if (!contact) {
        return res.status(404).json({ message: "Contact not found" });
      }

      // Check if user owns this contact
      if (contact.createdBy.toString() !== req.user._id.toString()) {
        return res
          .status(403)
          .json({ message: "Not authorized to update this contact" });
      }

      const { firstName, lastName, address, phoneNumber } = req.body;

      // Update fields
      if (firstName) contact.firstName = firstName;
      if (lastName) contact.lastName = lastName;
      if (phoneNumber) contact.phoneNumber = phoneNumber;
      if (address) {
        contact.address = { ...contact.address, ...address };
      }

      await contact.save();

      res.json(contact);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// @route   DELETE /api/contacts/:id
// @desc    Delete a contact
// @access  Private (only owner)
router.delete("/:id", protect, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    // Check if user owns this contact
    if (contact.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this contact" });
    }

    await contact.deleteOne();

    res.json({ message: "Contact deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
