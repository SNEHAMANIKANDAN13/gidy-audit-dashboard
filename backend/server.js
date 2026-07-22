const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const logRoutes = require("./routes/logRoutes");

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));

// MongoDB Connect
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 10000,
  family: 4
})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection failed:", err.message));

// Routes
app.use("/api/logs", logRoutes);

app.get("/", (req, res) => {
  res.send("Server is Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});