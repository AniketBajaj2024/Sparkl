const express = require("express");
const verifyToken = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/dashboard", verifyToken, adminOnly, (req, res) => {
    res.json({ message: "Welcome Admin! You have full access." });
});

module.exports = router;
