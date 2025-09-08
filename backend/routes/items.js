const express = require("express");
const { Op } = require("sequelize");
const multer = require("multer");
const Item = require("../models/Item");

const router = express.Router();

//  Serve images statically in server.js: app.use('/uploads', express.static('uploads'));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Folder where images are saved
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// GET /items?search=&category=&minPrice=&maxPrice=
router.get("/", async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice } = req.query;
    const where = {};

    if (search) where.name = { [Op.iLike]: `%${search}%` };
    if (category) where.category = category;

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = parseFloat(minPrice);
      if (maxPrice) where.price[Op.lte] = parseFloat(maxPrice);
    }

    const items = await Item.findAll({ where });
    res.json(items);
  } catch (err) {
    console.error("❌ Error fetching items:", err);
    res.status(500).json({ message: "Error fetching items" });
  }
});

// POST /items (add new item with optional image)
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, price, category } = req.body;
    if (!name || !price || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const item = await Item.create({ name, price, category, image });
    res.status(201).json(item);
  } catch (err) {
    console.error("❌ Error creating item:", err);
    res.status(500).json({ message: "Error creating item" });
  }
});

module.exports = router;
