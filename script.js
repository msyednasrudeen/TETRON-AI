/* =========================================
   TETRON AI — FRONTEND
   ========================================= */

const API_URL = "http://localhost:3000";

const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const messages = document.getElementById("messages");
const welcome = document.getElementById("welcome");

const menuBtn = document.getElementById("menuBtn");
const closeSidebar = document.getElementById("closeSidebar");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");

const newChat = document.getElementById("newChat");


/* =========================================
   ADD MESSAGE
   ========================================= */

function addMessage(text, type) {

    const message = document.createElement("div");

    message.className = `message ${type}`;

    message.textContent = text;

    messages.appendChild(message);

    messages.scrollTop = messages.scrollHeight;
}


/* =========================================
   SEND MESSAGE
   ========================================= */

async function sendMessage() {

    const message = messageInput.value.trim();

    if (!message) {
        return;
    }

    // Hide welcome screen
    welcome.style.display = "none";

    // Show user message
    addMessage(message, "user");

    // Clear input
    messageInput.value = "";

    try {

        const response = await fetch(
            `${API_URL}/api/chat`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    message: message
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.error || "Request failed."
            );
        }

        // Show AI response
        addMessage(data.reply, "assistant");

    } catch (error) {

        console.error("TETRON ERROR:", error);

        addMessage(
            "Unable to connect to TETRON AI backend.",
            "assistant"
        );
    }
}


/* =========================================
   SEND BUTTON
   ========================================= */

sendBtn.addEventListener(
    "click",
    sendMessage
);


/* =========================================
   ENTER TO SEND
   ========================================= */

messageInput.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            sendMessage();
        }

    }
);


/* =========================================
   NEW CHAT
   ========================================= */

newChat.addEventListener(
    "click",
    function () {

        messages.innerHTML = "";

        welcome.style.display = "";

        messageInput.value = "";

        messageInput.focus();

    }
);


/* =========================================
   MOBILE SIDEBAR
   ========================================= */

menuBtn.addEventListener(
    "click",
    function () {

        sidebar.classList.add("open");

        overlay.classList.add("show");

    }
);


closeSidebar.addEventListener(
    "click",
    function () {

        sidebar.classList.remove("open");

        overlay.classList.remove("show");

    }
);


overlay.addEventListener(
    "click",
    function () {

        sidebar.classList.remove("open");

        overlay.classList.remove("show");

    }
);
