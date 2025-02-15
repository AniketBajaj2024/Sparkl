require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../db"); // Import MySQL connection

const router = express.Router();

// User Registration
router.post("/register", async (req, res) => {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: "All fields are required!" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const userRole = role === "admin" ? "admin" : "user"; // Only allow 'admin' if explicitly mentioned

        pool.query(
            "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
            [username, email, hashedPassword, userRole],
            (err, result) => {
                if (err) {
                    return res.status(500).json({ error: "User already exists!" });
                }
                res.status(201).json({ message: "User registered successfully!" });
            }
        );
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// User Login
router.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "All fields are required!" });
    }

    pool.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
        if (err || results.length === 0) {
            return res.status(401).json({ error: "Invalid email or password!" });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid email or password!" });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: "1h" }
        );

        res.json({ message: "Login successful!", token, role: user.role });
    });
});


module.exports = router;
