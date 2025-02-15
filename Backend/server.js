const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

// routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");



require("dotenv").config();
require("./db");


const app = express();
app.use(cors());
app.use(bodyParser.json());


app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);



app.get("/", (req, res) => {
    res.send("Server is running...");
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Backend Server is running on http://localhost:${PORT}`);
});
