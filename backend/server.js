const express = require("express");
const path = require('path');
const cors = require("cors");
const dotenv = require("dotenv");
const { sequelize } = require("./config/db");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Import middleware
const authenticateToken = require("./middleware/auth");

// Public routes (no login required)
app.use("/auth", require("./routes/auth"));
app.use("/items", require("./routes/items"));  // items browsing stays public
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Protected routes (login required)
app.use("/cart", authenticateToken, require("./routes/cart"));

// Test route
app.get("/", (req, res) => {
  res.send("E-commerce API is running 🚀");
});

// Test DB connection and start server
sequelize.authenticate()
  .then(() => {
    console.log("✅ Database connected successfully");

    // Import models
    require("./models/User");
    require("./models/Item");
    require("./models/Cart");

    // Sync models
    sequelize.sync({ alter: true })
      .then(() => console.log("✅ Tables synced successfully"))
      .catch(err => console.error("❌ Error syncing tables:", err));

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  })
  .catch((err) => console.error("❌ Database connection error:", err));
