/* =====================================================
   TETRON AI
   PHASE 1 — CORE ACTIONS
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

    const messageInput = document.getElementById("messageInput");
    const sendBtn = document.getElementById("sendBtn");

    const messages = document.getElementById("messages");
    const welcome = document.getElementById("welcome");

    const themeBtn = document.getElementById("themeBtn");

    const suggestions =
        document.querySelectorAll(".suggestion");

    const chatItems =
        document.querySelectorAll(".chat-item");


    /* =================================================
       MOBILE SIDEBAR
       ================================================= */

    function openSidebar() {

        sidebar.classList.add("open");
        overlay.classList.add("active");

    }

    function closeMenu() {

        sidebar.classList.remove("open");
        overlay.classList.remove("active");

    }

    if (menuBtn) {

        menuBtn.addEventListener("click", openSidebar);

    }

    if (closeSidebar) {

        closeSidebar.addEventListener("click", closeMenu);

    }

    if (overlay) {

        overlay.addEventListener("click", closeMenu);

    }


    /* =================================================
       NEW CHAT
       ================================================= */

    if (newChatBtn) {

        newChatBtn.addEventListener("click", () => {

            messages.innerHTML = "";

            welcome.style.display = "flex";

            messageInput.value = "";

            messageInput.focus();

            chatItems.forEach(item => {

                item.classList.remove("active");

            });

            closeMenu();

        });

    }


    /* =================================================
       SUGGESTION ACTIONS
       ================================================= */

    suggestions.forEach((card) => {

        card.addEventListener("click", () => {

            const title =
                card.querySelector("strong")?.textContent.trim();

            const prompts = {

                "Explore ideas":
                    "Help me brainstorm some creative ideas.",

                "Study with me":
                    "Help me study a topic and explain it simply.",

                "Write code":
                    "Help me write or debug some code.",

                "Create something":
                    "Help me create something interesting."

            };

            messageInput.value =
                prompts[title] || "";

            messageInput.focus();

            autoResize();

        });

    });


    /* =================================================
       SEND MESSAGE
       ================================================= */

    function sendMessage() {

        const text =
            messageInput.value.trim();

        if (!text) {

            messageInput.focus();

            return;

        }


        /* Hide welcome screen */

        welcome.style.display = "none";


        /* Create USER message */

        const userMessage =
            document.createElement("div");

        userMessage.className =
            "user-message";

        userMessage.textContent =
            text;


        messages.appendChild(userMessage);


        /* Clear input */

        messageInput.value = "";

        autoResize();


        /* Scroll */

        messages.scrollTop =
            messages.scrollHeight;


        /*
         * AI RESPONSE WILL BE CONNECTED
         * IN THE NEXT PHASE.
         */

        setTimeout(() => {

            const aiMessage =
                document.createElement("div");

            aiMessage.className =
                "ai-message";

            aiMessage.textContent =
                "TETRON is ready. AI response will be connected in the next phase.";

            messages.appendChild(aiMessage);

            messages.scrollTop =
                messages.scrollHeight;

        }, 500);

    }


    if (sendBtn) {

        sendBtn.addEventListener(
            "click",
            sendMessage
        );

    }


    /* =================================================
       ENTER / SHIFT + ENTER
       ================================================= */

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


    /* =================================================
       TEXTAREA AUTO RESIZE
       ================================================= */

    function autoResize() {

        messageInput.style.height = "auto";

        messageInput.style.height =
            Math.min(
                messageInput.scrollHeight,
                120
            ) + "px";

    }

    messageInput.addEventListener(
        "input",
        autoResize
    );


    /* =================================================
       CHAT HISTORY
       ================================================= */

    chatItems.forEach((item) => {

        item.addEventListener("click", () => {

            chatItems.forEach(chat => {

                chat.classList.remove("active");

            });

            item.classList.add("active");

            closeMenu();

        });

    });


    /* =================================================
       THEME BUTTON
       ================================================= */

    let lightMode = false;

    if (themeBtn) {

        themeBtn.addEventListener("click", () => {

            lightMode = !lightMode;

            if (lightMode) {

                document.body.classList.add(
                    "light-mode"
                );

                themeBtn.textContent = "☀";

            } else {

                document.body.classList.remove(
                    "light-mode"
                );

                themeBtn.textContent = "◐";

            }

        });

    }


    /* =================================================
       INITIALIZE
       ================================================= */

    autoResize();

});
