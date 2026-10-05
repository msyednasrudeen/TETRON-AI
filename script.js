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
       LOAD SAVED CHAT
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
       MOBILE SIDEBAR
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
       SAVE CHAT
       ================================================= */

    function saveChatHistory() {

        if (!messages) return;

        localStorage.setItem(
            "tetronChat",
            messages.innerHTML
        );

    }


    /* =================================================
       CHAT HISTORY
       ================================================= */

    function setupChatHistory() {

        if (!chatHistory) return;

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

                if (messages) {
                    messages.scrollTop =
                        messages.scrollHeight;
                }

            });

        });

    }


    /* =================================================
       ESCAPE HTML
       ================================================= */

    function escapeHTML(text) {

        const div =
            document.createElement("div");

        div.textContent = text;

        return div.innerHTML;

    }


    /* =================================================
       ADD MESSAGE
       ================================================= */

    function addMessage(text, type) {

        if (!messages) return null;

            document.createElement("div");

        message.className =
            `message ${type}`;

        message.textContent = text;

        messages.appendChild(message);

        messages.scrollTop =
            messages.scrollHeight;

        saveChatHistory();


        /* ---------------------------------------------
           ADD USER MESSAGE TO SIDEBAR HISTORY
           --------------------------------------------- */

        if (type === "user" && chatHistory) {

            const chatItem =
                document.createElement("button");

            chatItem.className =
                "chat-item";

            chatItem.innerHTML = `
                <span class="chat-icon">○</span>
                <span>${escapeHTML(text)}</span>
            `;

            chatHistory.appendChild(chatItem);

        }

        return message;

    }


    /* =================================================
       REMOVE TYPING INDICATOR
       ================================================= */

    function removeTypingIndicator() {

        if (!messages) return;

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
       AI SUGGESTIONS
       ================================================= */

    const suggestions =
        document.querySelectorAll(".suggestion");

    suggestions.forEach((suggestion) => {

        suggestion.addEventListener("click", () => {

            const title =
                suggestion
                    .querySelector("strong")
                    ?.textContent
                    .trim();


            const modes = {

                "Explore ideas": "ideas",
                "Study with me": "study",
                "Write code": "coding",
                "Create something": "creative"

            };
            const prompts = {

                "Explore ideas":
                    "Help me brainstorm some creative project ideas.",

                "Study with me":
                    "Teach me a topic step by step in a simple way.",

                "Write code":
                    "Help me write and debug code step by step.",

                "Create something":
                    "Help me create something interesting and useful."

            };


            if (
                messageInput &&
                prompts[title]
            ) {

                window.tetronMode = modes[title] || "general";
                messageInput.value =
                    prompts[title];

                messageInput.focus();

            }

        });

    });


    /* =================================================
       SEND MESSAGE
       ================================================= */

    async function sendMessage() {

        if (!messageInput || !sendBtn) return;

        const message = messageInput.value.trim();
        const currentMode = window.tetronMode || "general";

        if (!messageInput || !sendBtn) {
            return;
        }




        if (!message) {
            return;
        }


        /* Hide welcome screen */

        if (welcome) {
            welcome.style.display = "none";
        }


        /* Add user message */

        addMessage(
            message,
            "user"
        );


        /* Clear input */

        messageInput.value = "";


        /* Disable send button */

        sendBtn.disabled = true;


        /* Typing indicator */

        addMessage(
            "TETRON is thinking...",
            "assistant"
        );


        try {

            const response =
                await fetch(
                    "/api/chat",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            message: message,
                            mode: currentMode
                        })
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.error ||
                    "Request failed."
                );

            }


            /* Remove thinking message */

            removeTypingIndicator();


            /* Add AI reply */

            addMessage(
                data.reply,
                "assistant"
            );


            /* Show model in console */

            if (data.model) {

                console.log(
                    `TETRON MODEL: ${data.model}`
                );

            }

        } catch (error) {

            console.error(
                "TETRON FRONTEND ERROR:",
                error
            );


            removeTypingIndicator();


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
            async () => {

                try {

                    const response =
                        await fetch(
                            "/api/clear-memory",
                            {
                                method: "POST"
                            }
                        );


                    const data =
                        await response.json();


                    if (data.success) {

                        console.log(
                            "TETRON: Backend memory cleared"
                        );

                    }

                } catch (error) {

                    console.error(
                        "TETRON MEMORY CLEAR ERROR:",
                        error
                    );

                }


                /* Clear messages */

                if (messages) {
                    messages.innerHTML = "";
                }


                /* Clear local storage */

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


    /* =================================================
       INITIALIZE
       ================================================= */

    /* =================================================
       AI MODE SELECTOR
       ================================================= */

    const modeButtons = document.querySelectorAll(".mode-btn");

    modeButtons.forEach((button) => {

        button.addEventListener("click", () => {

            modeButtons.forEach((btn) => {
                btn.classList.remove("active");
            });

            button.classList.add("active");

            window.tetronMode =
                button.dataset.mode || "general";

            console.log(
                `TETRON MODE: ${window.tetronMode}`
            );

        });

    });

    setupChatHistory();

});
