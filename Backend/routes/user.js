const express = require("express");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/dashboard", verifyToken, (req, res) => {
    res.json({ message: `Welcome ${req.user.username}, this is your dashboard!` });
});

module.exports = router;
