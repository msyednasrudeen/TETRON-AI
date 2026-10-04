const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

const app = express();
const PORT = process.env.PORT || 3000;

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "TETRON AI backend is online."
    });
});

app.post("/api/chat", async (req, res) => {
    try {
        const { message } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({
                success: false,
                error: "Message is required."
            });
        }

        const response = await ai.models.generateContent({
            model: "gemini-3.8-flash",
            contents: message
        });

        res.json({
            success: true,
            reply: response.text
        });

    } catch (error) {
        console.error("TETRON ERROR:", error);

        res.status(500).json({
            success: false,
            error: "TETRON AI could not process the request."
        });
    }
});

app.listen(PORT, () => {
    console.log(`TETRON AI server running on port ${PORT}`);
});
