const express = require("express");
const pool = require("../db");
const verifyToken = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const router = express.Router();

// Add a question to a quiz (Admin Only)
router.post("/add", verifyToken, adminOnly, (req, res) => {
    const { quiz_id, question_text, options } = req.body;

    if (!quiz_id || !question_text || !options || options.length < 2) {
        return res.status(400).json({ error: "All fields are required, and at least two options are needed!" });
    }

    // Insert question into database
    pool.query(
        "INSERT INTO questions (quiz_id, question_text) VALUES (?, ?)",
        [quiz_id, question_text],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: "Database error occurred!" });
            }

            const question_id = result.insertId;

            // Insert options
            const optionValues = options.map(opt => [question_id, opt.text, opt.is_correct ? 1 : 0]);

            pool.query(
                "INSERT INTO question_options (question_id, option_text, is_correct) VALUES ?",
                [optionValues],
                (err, result) => {
                    if (err) {
                        return res.status(500).json({ error: "Error inserting options!" });
                    }
                    res.status(201).json({ message: "Question added successfully!" });
                }
            );
        }
    );
});

// Get all questions for a quiz
router.get("/quiz/:quiz_id", verifyToken, (req, res) => {
    const { quiz_id } = req.params;

    pool.query(
        `SELECT q.id AS question_id, q.question_text, 
                JSON_ARRAYAGG(JSON_OBJECT('id', o.id, 'text', o.option_text, 'is_correct', o.is_correct)) AS options
         FROM questions q 
         LEFT JOIN question_options o ON q.id = o.question_id
         WHERE q.quiz_id = ?
         GROUP BY q.id, q.question_text`,
        [quiz_id],
        (err, results) => {
            if (err) {
                return res.status(500).json({ error: "Database error occurred!" });
            }
            res.json(results);
        }
    );
});

module.exports = router;
