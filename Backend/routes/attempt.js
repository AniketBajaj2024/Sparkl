const express = require("express");
const pool = require("../db");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

// Start a Quiz Attempt
router.post("/start", verifyToken, (req, res) => {
    const { quiz_id } = req.body;
    const user_id = req.user.id;

    pool.query(
        "INSERT INTO quiz_attempts (user_id, quiz_id, status) VALUES (?, ?, 'in-progress')",
        [user_id, quiz_id],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: "Database error occurred!" });
            }
            res.status(201).json({ message: "Quiz attempt started!", attempt_id: result.insertId });
        }
    );
});

// Submit Quiz Responses
// Submit Quiz Responses
router.post("/submit", verifyToken, (req, res) => {
    const { attempt_id, responses } = req.body;

    if (!attempt_id || !responses || responses.length === 0) {
        return res.status(400).json({ error: "Attempt ID and responses are required!" });
    }

    // Check if the attempt exists
    pool.query("SELECT * FROM quiz_attempts WHERE id = ?", [attempt_id], (err, results) => {
        if (err || results.length === 0) {
            return res.status(400).json({ error: "Invalid attempt ID!" });
        }

        let score = 0;
        const queries = responses.map(({ question_id, selected_option_id }) => {
            return new Promise((resolve, reject) => {
                pool.query(
                    "SELECT is_correct FROM question_options WHERE id = ?",
                    [selected_option_id],
                    (err, results) => {
                        if (err) reject(err);

                        const is_correct = results[0]?.is_correct || 0;
                        if (is_correct) score += 10;

                        pool.query(
                            "INSERT INTO quiz_responses (attempt_id, question_id, selected_option_id, is_correct) VALUES (?, ?, ?, ?)",
                            [attempt_id, question_id, selected_option_id, is_correct],
                            (err) => {
                                if (err) reject(err);
                                resolve();
                            }
                        );
                    }
                );
            });
        });

        Promise.all(queries)
            .then(() => {
                pool.query(
                    "UPDATE quiz_attempts SET status = 'completed', score = ? WHERE id = ?",
                    [score, attempt_id],
                    (err) => {
                        if (err) {
                            return res.status(500).json({ error: "Failed to update quiz attempt!" });
                        }
                        res.json({ message: "Quiz submitted successfully!", score });
                    }
                );
            })
            .catch((error) => {
                console.error(error);
                res.status(500).json({ error: "Error processing quiz responses!" });
            });
    });
});


// Get Quiz Result
router.get("/result/:attempt_id", verifyToken, (req, res) => {
    const { attempt_id } = req.params;

    pool.query(
        "SELECT score, status FROM quiz_attempts WHERE id = ?",
        [attempt_id],
        (err, results) => {
            if (err || results.length === 0) {
                return res.status(404).json({ error: "Quiz attempt not found!" });
            }
            res.json(results[0]);
        }
    );
});

module.exports = router;
