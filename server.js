require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

app.get("/", function (req, res) {
    res.sendFile(
        path.join(__dirname, "index.html")
    );
});

app.get("/health", function (req, res) {
    res.json({
        success: true,
        message: "MyStore server is running"
    });
});

app.post("/create-order", function (req, res) {
    const amount = Number(req.body.amount);

    if (!amount || amount <= 0) {
        return res.status(400).json({
            success: false,
            message: "Invalid payment amount"
        });
    }

    res.json({
        success: true,
        paymentMode: "demo",
        orderId: "DEMO_" + Date.now(),
        amount: amount,
        message: "Demo order created successfully"
    });
});

app.post("/verify-payment", function (req, res) {
    res.json({
        success: true,
        paymentMode: "demo",
        message: "Demo payment verified successfully"
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
    console.log(
        `MyStore server running on port ${PORT}`
    );
});