require("dotenv").config();
const express = require("express");
const pool = require("./src/config/db");
const authRoutes = require("./src/routes/authRoutes");

const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

pool
  .query("SELECT NOW()")
  .then((result) => {
    console.log("Database connected at:", result.rows[0].now);
  })
  .catch((err) => {
    console.error("Database connection failed:", err.message);
  });

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
