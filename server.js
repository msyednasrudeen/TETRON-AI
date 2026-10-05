const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

const app = express();
const PORT = process.env.PORT || 3000;

/* =====================================================
   GEMINI AI
   ===================================================== */

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

/* =====================================================
   MIDDLEWARE
   ===================================================== */

app.use(cors());
app.use(express.json());

/* =====================================================
   ROOT ROUTE
   ===================================================== */

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "TETRON AI backend is online."
    });
});

/* =====================================================
   STATIC FILES
   ===================================================== */

app.use(express.static(__dirname));

/* =====================================================
   TETRON AI CONVERSATION MEMORY
   ===================================================== */

const conversationHistory = [];

const MAX_HISTORY = 20;

/* =====================================================
   AI MODES
   ===================================================== */

const modeInstructions = {

    general:
        "You are TETRON AI, a helpful intelligent assistant. Give clear, accurate and useful answers.",

    ideas:
        "You are TETRON AI Idea Mode. Help the user brainstorm creative, practical and original ideas. Give structured suggestions and explain useful next steps.",

    study:
        "You are TETRON AI Study Mode. Teach concepts clearly and step by step. Use simple explanations, examples and short summaries when useful. Help the student understand rather than just giving unexplained answers.",

    coding:
        "You are TETRON AI Coding Mode. Help with programming, debugging and software projects. Give clean code, explain important parts and identify likely errors clearly.",

    creative:
        "You are TETRON AI Creative Mode. Help the user create writing, plans, designs, concepts and other creative work. Be practical, original and well structured."

};

/* =====================================================
   HEALTH CHECK
   ===================================================== */

app.get("/api/health", (req, res) => {

    res.json({
        success: true,
        message: "TETRON AI backend is online."
    });

});

/* =====================================================
   CHAT API
   ===================================================== */

app.post("/api/chat", async (req, res) => {

    try {

        const {
            message,
            mode = "general"
        } = req.body;

        /* ---------------------------------------------
           VALIDATE MESSAGE
           --------------------------------------------- */

        if (!message || !message.trim()) {

            return res.status(400).json({
                success: false,
                error: "Message is required."
            });

        }

        /* ---------------------------------------------
           SELECT AI MODE
           --------------------------------------------- */

        const selectedMode =
            modeInstructions[mode]
                ? mode
                : "general";

        const systemInstruction =
            modeInstructions[selectedMode];

        console.log(
            `TETRON: Mode = ${selectedMode}`
        );

        /* ---------------------------------------------
           ADD USER MESSAGE TO MEMORY
           --------------------------------------------- */

        conversationHistory.push({

            role: "user",

            parts: [
                {
                    text: message.trim()
                }
            ]

        });

        /* ---------------------------------------------
           LIMIT MEMORY
           --------------------------------------------- */

        if (
            conversationHistory.length >
            MAX_HISTORY
        ) {

            conversationHistory.splice(
                0,
                conversationHistory.length -
                    MAX_HISTORY
            );

        }

        /* ---------------------------------------------
           AVAILABLE GEMINI MODELS
           --------------------------------------------- */

        const models = [

            "gemini-3.1-flash-lite",

            "gemini-3.5-flash-lite",

            "gemini-2.5-flash-lite",

            "gemini-2.5-flash",

            "gemini-3.5-flash",

            "gemini-3.6-flash",

            "gemini-3.7-flash",

            "gemini-3.8-flash",

            "gemini-2.5-pro",

            "gemini-3.1-pro-preview"

        ];

        /* ---------------------------------------------
           MODEL FALLBACK
           --------------------------------------------- */

        let response = null;

        let lastError = null;

        let successfulModel = null;

        for (const model of models) {

            try {

                console.log(
                    `TETRON: Trying ${model}`
                );

                response =
                    await ai.models.generateContent({

                        model: model,

                        contents:
                            conversationHistory,

                        config: {

                            systemInstruction:
                                systemInstruction

                        }

                    });

                successfulModel = model;

                console.log(
                    `TETRON: ${model} succeeded`
                );

                break;

            } catch (error) {

                lastError = error;

                console.log(
                    `TETRON: ${model} failed - ${
                        error.status ||
                        error.message
                    }`
                );

            }

        }

        /* ---------------------------------------------
           ALL MODELS FAILED
           --------------------------------------------- */

        if (!response) {

            conversationHistory.pop();

            throw lastError;

        }

        /* ---------------------------------------------
           ADD AI RESPONSE TO MEMORY
           --------------------------------------------- */

        conversationHistory.push({

            role: "model",

            parts: [
                {
                    text: response.text
                }
            ]

        });

        /* ---------------------------------------------
           SEND RESPONSE
           --------------------------------------------- */

        res.json({

            success: true,

            reply: response.text,

            model: successfulModel,

            mode: selectedMode,

            memory: true

        });

    } catch (error) {

        console.error(
            "TETRON ERROR:",
            error
        );

        res.status(500).json({

            success: false,

            error:
                "TETRON AI could not process the request."

        });

    }

});

/* =====================================================
   CLEAR CONVERSATION MEMORY
   ===================================================== */

app.post("/api/clear-memory", (req, res) => {

    conversationHistory.length = 0;

    console.log(
        "TETRON: Conversation memory cleared"
    );

    res.json({

        success: true,

        message:
            "TETRON conversation memory cleared."

    });

});

/* =====================================================
   LOCAL SERVER
   ===================================================== */

if (require.main === module) {

    app.listen(PORT, () => {

        console.log(
            `TETRON AI server running on port ${PORT}`
        );

    });

}

/* =====================================================
   VERCEL EXPORT
   ===================================================== */

module.exports = app;
