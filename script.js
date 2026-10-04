/* =========================================
   TETRON AI — FRONTEND CHAT CONNECTION
   ========================================= */

const API_URL = "http://localhost:3000";

/* -----------------------------------------
   SEND MESSAGE TO TETRON BACKEND
   ----------------------------------------- */

async function sendMessage(message) {

    if (!message || !message.trim()) {
        return;
    }

    try {

        const response = await fetch(`${API_URL}/api/chat`, {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                message: message.trim()
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Request failed.");
        }

        console.log("TETRON AI:", data.reply);

        return data.reply;

    } catch (error) {

        console.error("TETRON ERROR:", error);

        return "Unable to connect to TETRON AI backend.";

    }
}
