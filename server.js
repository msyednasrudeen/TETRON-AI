const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 3000;


/* ================================
   MIDDLEWARE
   ================================ */

app.use(cors());

app.use(express.json());

/*
 * SERVE TETRON AI FRONTEND
 */
app.use(express.static(__dirname));


/* ================================
   HEALTH CHECK
   ================================ */

app.get("/api/health", (req, res) => {

    res.json({
        success: true,
        message: "TETRON AI backend is online."
    });

});


/* ================================
   CHAT ROUTE
   ================================ */

app.post("/api/chat", async (req, res) => {

    try {

        const { message } = req.body;

        if (!message || !message.trim()) {

            return res.status(400).json({
                success: false,
                error: "Message is required."
            });

        }


        /*
         * REAL AI CONNECTION
         * WILL BE ADDED NEXT.
         */

        res.json({
            success: true,
            reply: "TETRON AI backend received your message."
        });


    } catch (error) {

        console.error("TETRON ERROR:", error);

        res.status(500).json({
            success: false,
            error: "Something went wrong."
        });

    }

});


/* ================================
   START SERVER
   ================================ */

app.listen(PORT, () => {

    console.log(
        `TETRON AI server running on port ${PORT}`
    );

});
