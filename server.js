require("dotenv").config();

const express = require("express");
const Razorpay = require("razorpay");
const cors = require("cors");
const crypto = require("crypto");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});


app.get("/", function (req, res) {

    res.sendFile(
        path.join(__dirname, "index.html")
    );

});


app.post("/create-order", async function (req, res) {

    try {

        const amount = Number(req.body.amount);

        if (!amount || amount <= 0) {

            return res.status(400).json({
                success: false,
                message: "Invalid payment amount"
            });

        }

        const order = await razorpay.orders.create({

            amount: Math.round(amount * 100),

            currency: "INR",

            receipt:
                "receipt_" + Date.now()

        });

        res.json({

            success: true,

            key: process.env.RAZORPAY_KEY_ID,

            order: order

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Unable to create payment order"

        });

    }

});


app.post("/verify-payment", function (req, res) {

    try {

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;

        const message =
            razorpay_order_id +
            "|" +
            razorpay_payment_id;

        const expectedSignature =
            crypto
                .createHmac(
                    "sha256",
                    process.env.RAZORPAY_KEY_SECRET
                )
                .update(message)
                .digest("hex");

        const verified =
            expectedSignature ===
            razorpay_signature;

        if (!verified) {

            return res.status(400).json({

                success: false,

                message:
                    "Payment verification failed"

            });

        }

        res.json({

            success: true,

            message:
                "Payment verified successfully"

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message:
                "Payment verification error"

        });

    }

});


const PORT =
    process.env.PORT || 3000;

app.listen(PORT, function () {

    console.log(
        `MyStore server running at http://localhost:${PORT}`
    );

});

/* ===========================
   PRODUCT FILTERS
=========================== */

const categoryFilter = document.getElementById("categoryFilter");
const priceFilter = document.getElementById("priceFilter");
const ratingFilter = document.getElementById("ratingFilter");
const sortProducts = document.getElementById("sortProducts");

if (
    categoryFilter &&
    priceFilter &&
    ratingFilter &&
    sortProducts
) {

    categoryFilter.addEventListener("change", applyFilters);
    priceFilter.addEventListener("change", applyFilters);
    ratingFilter.addEventListener("change", applyFilters);
    sortProducts.addEventListener("change", applyFilters);

}

