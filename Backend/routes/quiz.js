const express = require("express");
const pool = require("../db");
const verifyToken = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const router = express.Router();

// Create a new quiz (Admin Only)
router.post("/create", verifyToken, adminOnly, (req, res) => {
    const { title, total_questions, total_score, duration } = req.body;
    const created_by = req.user.id;

    if (!title || !total_questions || !total_score || !duration) {
        return res.status(400).json({ error: "All fields are required!" });
    }

    pool.query(
        "INSERT INTO quizzes (title, total_questions, total_score, duration, created_by) VALUES (?, ?, ?, ?, ?)",
        [title, total_questions, total_score, duration, created_by],
        (err, result) => {
            if (err) {
                console.error("Database Error:", err);
                return res.status(500).json({ error: "Database error occurred!" });
            }
            res.status(201).json({ message: "Quiz created successfully!" });
        }
    );
});

// Get all quizzes (Admin Only)
router.get("/list", verifyToken, (req, res) => {
    pool.query("SELECT * FROM quizzes", (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Database error occurred!" });
        }
        res.json(results);
    });
});

module.exports = router;
