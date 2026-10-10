const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

const app = express();
const PORT = process.env.PORT || 3000;

/* =====================================================
   TETRON AI
   ===================================================== */

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

/* =====================================================
   MIDDLEWARE
   ===================================================== */

app.use(cors());
app.use(express.json({ limit: "1mb" }));

/* =====================================================
   FRONTEND
   ===================================================== */

app.use(express.static(__dirname));

/* =====================================================
   GEMINI MODELS
   ===================================================== */

/*
   Ordered from newest/preferred to fallback.

   Specialized Live / TTS / Image / Embedding models
   are intentionally not included because this endpoint
   is for normal text chat.
*/

const GEMINI_MODELS = [
    "gemini-3.8-flash",
    "gemini-3.7-flash",
    "gemini-3.6-flash",
    "gemini-3.5-flash",
    "gemini-3.5-flash-lite",
    "gemini-3.1-flash-lite",
    "gemini-3.1-pro-preview",
    "gemini-3-flash-preview",
    "gemini-2.5-flash",
    "gemini-2.5-flash-lite",
    "gemini-2.5-pro"
];

/* =====================================================
   TETRON MODES
   ===================================================== */

const MODE_INSTRUCTIONS = {

    general:
        "You are TETRON AI, a helpful intelligent AI assistant. Give clear, accurate, useful and easy-to-understand answers.",

    ideas:
        "You are TETRON AI Idea Mode. Help the user generate creative, practical and original ideas. Give structured suggestions and useful next steps.",

    study:
        "You are TETRON AI Study Mode. Teach concepts clearly and step by step. Use simple explanations, examples, and short summaries when useful. Help the student understand the topic.",

    coding:
        "You are TETRON AI Coding Mode. Help with programming, debugging, software development and technical projects. Give clean code, explain important parts, and identify errors clearly.",

    creative:
        "You are TETRON AI Creative Mode. Help the user create writing, concepts, designs, plans and other creative work. Be original, practical and well structured."
};

/* =====================================================
   CONVERSATION MEMORY
   ===================================================== */

let conversationHistory = [];

const MAX_HISTORY = 20;

/* =====================================================
   HEALTH
   ===================================================== */

app.get("/api/health", (req, res) => {

    res.json({
        success: true,
        service: "TETRON AI",
        status: "online"
    });

});

/* =====================================================
   CHAT
   ===================================================== */

app.post("/api/chat", async (req, res) => {

    try {

        /* ---------------------------------------------
           VALIDATE MESSAGE
           --------------------------------------------- */

        const message =
            typeof req.body?.message === "string"
                ? req.body.message.trim()
                : "";

        const requestedMode =
            typeof req.body?.mode === "string"
                ? req.body.mode
                : "general";

        if (!message) {

            return res.status(400).json({
                success: false,
                error: "Message is required."
            });

        }

        /* ---------------------------------------------
           SELECT MODE
           --------------------------------------------- */

        const mode =
            MODE_INSTRUCTIONS[requestedMode]
                ? requestedMode
                : "general";

        const systemInstruction =
            MODE_INSTRUCTIONS[mode];

        console.log(
            `TETRON: Mode = ${mode}`
        );

        /* ---------------------------------------------
           ADD USER MESSAGE
           --------------------------------------------- */

        conversationHistory.push({

            role: "user",

            parts: [
                {
                    text: message
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

            conversationHistory =
                conversationHistory.slice(
                    -MAX_HISTORY
                );

        }

        /* ---------------------------------------------
           TRY GEMINI MODELS
           --------------------------------------------- */

        let response = null;
        let successfulModel = null;
        let lastError = null;

        for (
            const model of GEMINI_MODELS
        ) {

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
                        error?.status ||
                        error?.message ||
                        "Unknown error"
                    }`
                );

            }

        }

        /* ---------------------------------------------
           ALL MODELS FAILED
           --------------------------------------------- */

        if (!response) {

            conversationHistory.pop();

            throw lastError ||
                new Error(
                    "All Gemini models failed."
                );

        }

        /* ---------------------------------------------
           GET RESPONSE TEXT
           --------------------------------------------- */

        const reply =
            typeof response.text === "string"
                ? response.text.trim()
                : "";

        if (!reply) {

            conversationHistory.pop();

            throw new Error(
                "Gemini returned an empty response."
            );

        }

        /* ---------------------------------------------
           SAVE AI RESPONSE
           --------------------------------------------- */

        conversationHistory.push({

            role: "model",

            parts: [
                {
                    text: reply
                }
            ]

        });

        /* ---------------------------------------------
           RESPONSE
           --------------------------------------------- */

        return res.json({

            success: true,

            reply: reply,

            model: successfulModel,

            mode: mode,

            memory: true

        });

    } catch (error) {

        console.error(
            "TETRON ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            error:
                "TETRON AI could not process the request."

        });

    }

});

/* =====================================================
   CLEAR MEMORY
   ===================================================== */

app.post("/api/clear-memory", (req, res) => {

    conversationHistory = [];

    console.log(
        "TETRON: Conversation memory cleared"
    );

    return res.json({

        success: true,

        message:
            "TETRON conversation memory cleared."

    });

});

/* =====================================================
   404 API HANDLER
   ===================================================== */

app.use("/api", (req, res) => {

    res.status(404).json({

        success: false,

        error: "TETRON API route not found."

    });

});

/* =====================================================
   START SERVER
   ===================================================== */

if (require.main === module) {

    app.listen(PORT, () => {

        console.log(
            `TETRON AI running on port ${PORT}`
        );

    });

}

/* =====================================================
   VERCEL EXPORT
   ===================================================== */

module.exports = app;
