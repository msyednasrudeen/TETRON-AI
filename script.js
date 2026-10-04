/* =====================================================
   TETRON AI — FRONTEND + GEMINI BACKEND
   ===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* =================================================
       ELEMENTS
       ================================================= */

    const sidebar = document.getElementById("sidebar");
    const menuBtn = document.getElementById("menuBtn");
    const closeSidebar = document.getElementById("closeSidebar");
    const overlay = document.getElementById("overlay");

    const newChatBtn = document.getElementById("newChat");
    const chatHistory = document.getElementById("chatHistory");

    const messageInput = document.getElementById("messageInput");
    const sendBtn = document.getElementById("sendBtn");

    const messages = document.getElementById("messages");
    const welcome = document.getElementById("welcome");


    /* =================================================
       RESTORE CHAT HISTORY
       ================================================= */

    const savedChat = localStorage.getItem("tetronChat");

    if (savedChat && messages) {

        messages.innerHTML = savedChat;

        if (welcome) {
            welcome.style.display = "none";
        }

        messages.scrollTop = messages.scrollHeight;
    }


    /* =================================================
       SIDEBAR
       ================================================= */

    if (menuBtn && sidebar && overlay) {

        menuBtn.addEventListener("click", () => {

            sidebar.classList.add("open");
            overlay.classList.add("show");

        });

    }


    if (closeSidebar && sidebar && overlay) {

        closeSidebar.addEventListener("click", () => {

            sidebar.classList.remove("open");
            overlay.classList.remove("show");

        });

    }


    if (overlay && sidebar) {

        overlay.addEventListener("click", () => {

            sidebar.classList.remove("open");
            overlay.classList.remove("show");

        });

    }


    /* =================================================
       SAVE CHAT HISTORY
       ================================================= */

    function saveChatHistory() {

        if (!messages) {
            return;
        }

        localStorage.setItem(
            "tetronChat",
            messages.innerHTML
        );

    }
	    function setupChatHistory() {

        if (!chatHistory) {
            return;
        }

        const chatItems =
            chatHistory.querySelectorAll(".chat-item");

        chatItems.forEach((item) => {

            item.addEventListener("click", () => {

                chatItems.forEach((chat) => {
                    chat.classList.remove("active");
                });

                item.classList.add("active");

                if (welcome) {
                    welcome.style.display = "none";
                }

                messages.scrollTop =
                    messages.scrollHeight;

            });

        });

    }


    /* =================================================
       ADD MESSAGE
       ================================================= */

    function addMessage(text, type) {

        if (!messages) {
            return null;
        }

        const message = document.createElement("div");

        message.className = `message ${type}`;

        message.textContent = text;

        messages.appendChild(message);

        messages.scrollTop = messages.scrollHeight;

        saveChatHistory();
	
	        if (type === "user" && chatHistory) {

            const chatItem = document.createElement("button");

            chatItem.className = "chat-item";

            chatItem.innerHTML = `
                <span class="chat-icon">○</span>
                <span>${text}</span>
            `;

            chatHistory.appendChild(chatItem);

        }
        return message;
    }


    /* =================================================
       REMOVE TYPING INDICATOR
       ================================================= */

    function removeTypingIndicator() {

        if (!messages) {
            return;
        }

        const typingMessages =
            messages.querySelectorAll(
                ".message.assistant"
            );

        typingMessages.forEach((message) => {

            if (
                message.textContent.trim() ===
                "TETRON is thinking..."
            ) {

                message.remove();

            }

        });

    }


    /* =================================================
       SEND MESSAGE
       ================================================= */

    async function sendMessage() {

        if (!messageInput || !sendBtn) {
            return;
        }

        const message =
            messageInput.value.trim();

        if (!message) {
            return;
        }


        /* Hide welcome */

        if (welcome) {
            welcome.style.display = "none";
        }


        /* User message */

        addMessage(
            message,
            "user"
        );

        messageInput.value = "";

        sendBtn.disabled = true;


        /* Typing indicator */

        addMessage(
            "TETRON is thinking...",
            "assistant"
        );


        try {

            const response =
                await fetch("/api/chat", {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        message: message
                    })

                });


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.error ||
                    "Request failed."
                );

            }


            /* Remove typing indicator */

            removeTypingIndicator();


            /* AI response */

            addMessage(
                data.reply,
                "assistant"
            );


        } catch (error) {

            console.error(
                "TETRON FRONTEND ERROR:",
                error
            );


            /* Remove typing indicator */

            removeTypingIndicator();


            /* Error message */

            addMessage(
                "TETRON AI could not connect. Please try again.",
                "assistant"
            );

        } finally {

            sendBtn.disabled = false;

            messageInput.focus();

        }

    }


    /* =================================================
       SEND BUTTON
       ================================================= */

    if (sendBtn) {

        sendBtn.addEventListener(
            "click",
            sendMessage
        );

    }


    /* =================================================
       ENTER TO SEND
       ================================================= */

    if (messageInput) {

        messageInput.addEventListener(
            "keydown",
            (event) => {

                if (
                    event.key === "Enter" &&
                    !event.shiftKey
                ) {

                    event.preventDefault();

                    sendMessage();

                }

            }
        );

    }


    /* =================================================
       NEW CHAT
       ================================================= */

    if (newChatBtn) {

        newChatBtn.addEventListener(
            "click",
            () => {

                if (messages) {
                    messages.innerHTML = "";
                }


                /* Clear saved history */

                localStorage.removeItem(
                    "tetronChat"
                );


                /* Show welcome */

                if (welcome) {
                    welcome.style.display = "";
                }


                /* Clear input */

                if (messageInput) {
                    messageInput.value = "";
                    messageInput.focus();
                }

            }
        );

    }
	    setupChatHistory();
});
