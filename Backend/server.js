const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth");

require("dotenv").config();
require("./db");


const app = express();
app.use(cors());
app.use(bodyParser.json());


app.use("api/auth", authRoutes);


app.get("/", (req, res) => {
    res.send("Server is running...");
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Backend Server is running on http://localhost:${PORT}`);
});
