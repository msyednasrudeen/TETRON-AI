document.addEventListener("DOMContentLoaded", () => {

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

    const attachBtn = document.getElementById("attachBtn");
    const voiceBtn = document.getElementById("voiceBtn");

    const modeButtons = document.querySelectorAll(".mode-btn");
    const suggestions = document.querySelectorAll(".suggestion");


    /* =====================================================
       STATE
       ===================================================== */

    let currentMode = "general";
    let chatMessages = [];
    let isSending = false;


    /* =====================================================
       STORAGE
       ===================================================== */

    function saveChat() {

        try {

            localStorage.setItem(
                "tetronChat",
                JSON.stringify(chatMessages)
            );

        } catch (error) {

            console.error(
                "TETRON STORAGE ERROR:",
                error
            );

        }

    }


    function loadChat() {

        try {

            const savedChat =
                localStorage.getItem("tetronChat");

            if (!savedChat) {
                return;
            }

            const data =
                JSON.parse(savedChat);

            if (!Array.isArray(data)) {
                return;
            }

            chatMessages = data;

            renderMessages();

        } catch (error) {

            console.error(
                "TETRON LOAD ERROR:",
                error
            );

        }

    }


    /* =====================================================
       SIDEBAR
       ===================================================== */

    function openSidebar() {

        if (sidebar) {
            sidebar.classList.add("open");
        }

        if (overlay) {
            overlay.classList.add("show");
        }

    }


    function closeSidebarMenu() {

        if (sidebar) {
            sidebar.classList.remove("open");
        }

        if (overlay) {
            overlay.classList.remove("show");
        }

    }


    if (menuBtn) {

        menuBtn.addEventListener(
            "click",
            openSidebar
        );

    }


    if (closeSidebar) {

        closeSidebar.addEventListener(
            "click",
            closeSidebarMenu
        );

    }


    if (overlay) {

        overlay.addEventListener(
            "click",
            closeSidebarMenu
        );

    }


    /* =====================================================
       MODE
       ===================================================== */

    function setMode(mode) {

        const validModes = [
            "general",
            "ideas",
            "study",
            "coding",
            "creative"
        ];

        if (!validModes.includes(mode)) {
            mode = "general";
        }

        currentMode = mode;

        modeButtons.forEach((button) => {

            button.classList.toggle(
                "active",
                button.dataset.mode === mode
            );

        });

        console.log(
            "TETRON MODE:",
            mode
        );

    }


    modeButtons.forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                setMode(
                    button.dataset.mode
                );

                if (window.innerWidth <= 800) {
                    closeSidebarMenu();
                }

            }
        );

    });


    /* =====================================================
       HTML ESCAPE
       ===================================================== */

    function escapeHTML(text) {

        const element =
            document.createElement("div");

        element.textContent = text;

        return element.innerHTML;

    }


    /* =====================================================
       SCROLL
       ===================================================== */

    function scrollToBottom() {

        if (!messages) {
            return;
        }

        messages.scrollTop =
            messages.scrollHeight;

    }


    /* =====================================================
       ADD MESSAGE TO SCREEN
       ===================================================== */

    function addMessageToDOM(
        text,
        role
    ) {

        if (!messages) {
            return;
        }

        const row =
            document.createElement("div");

        row.className =
            "message-row " + role;

        const avatar =
            document.createElement("div");

        avatar.className =
            "message-avatar";

        avatar.textContent =
            role === "user"
                ? "YOU"
                : "T";

        const bubble =
            document.createElement("div");

        bubble.className =
            "message-bubble";

        bubble.innerHTML =
            escapeHTML(text)
                .replace(/\n/g, "<br>");

        row.appendChild(avatar);
        row.appendChild(bubble);

        messages.appendChild(row);

        scrollToBottom();

    }


    function addMessage(
        text,
        role
    ) {

        chatMessages.push({
            text: text,
            role: role
        });

        addMessageToDOM(
            text,
            role
        );

        saveChat();

    }


    /* =====================================================
       RENDER SAVED CHAT
       ===================================================== */

    function renderMessages() {

        if (!messages) {
            return;
        }

        messages.innerHTML = "";

        if (chatMessages.length === 0) {

            if (welcome) {
                messages.appendChild(welcome);
                welcome.style.display = "";
            }

            return;

        }

        if (welcome) {
            welcome.style.display = "none";
        }

        chatMessages.forEach((item) => {

            addMessageToDOM(
                item.text,
                item.role
            );

        });

        scrollToBottom();

    }


    /* =====================================================
       TYPING
       ===================================================== */

    function showTyping() {

        if (!messages) {
            return;
        }

        const row =
            document.createElement("div");

        row.id =
            "tetronTyping";

        row.className =
            "message-row assistant";

        const avatar =
            document.createElement("div");

        avatar.className =
            "message-avatar";

        avatar.textContent = "T";

        const bubble =
            document.createElement("div");

        bubble.className =
            "message-bubble typing";

        bubble.textContent =
            "TETRON is thinking...";

        row.appendChild(avatar);
        row.appendChild(bubble);

        messages.appendChild(row);

        scrollToBottom();

    }


    function removeTyping() {

        const element =
            document.getElementById(
                "tetronTyping"
            );

        if (element) {
            element.remove();
        }

    }


    /* =====================================================
       SEND MESSAGE
       ===================================================== */

    async function sendMessage() {

        if (isSending) {
            return;
        }

        if (!messageInput || !sendBtn) {

            console.error(
                "TETRON: Input or send button not found."
            );

            return;

        }

        const message =
            messageInput.value.trim();

        if (!message) {
            return;
        }

        isSending = true;

        sendBtn.disabled = true;

        if (welcome) {
            welcome.style.display = "none";
        }

        addMessage(
            message,
            "user"
        );

        messageInput.value = "";

        autoResize();

        showTyping();

        try {

            console.log(
                "TETRON: Sending request..."
            );

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

            console.log(
                "TETRON HTTP:",
                response.status
            );

            const data =
                await response.json();

            if (
                !response.ok ||
                !data.success
            ) {

                throw new Error(
                    data.error ||
                    "Request failed."
                );

            }

            removeTyping();

            addMessage(
                data.reply ||
                "TETRON returned no reply.",
                "assistant"
            );

            console.log(
                "TETRON MODEL:",
                data.model
            );

        } catch (error) {

            console.error(
                "TETRON FRONTEND ERROR:",
                error
            );

            removeTyping();

            addMessage(
                "TETRON AI could not connect. Please try again.",
                "assistant"
            );

        } finally {

            isSending = false;

            sendBtn.disabled = false;

            messageInput.focus();

        }

    }


    if (sendBtn) {

        sendBtn.addEventListener(
            "click",
            sendMessage
        );

    }


    /* =====================================================
       ENTER KEY
       ===================================================== */

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


    /* =====================================================
       TEXTAREA RESIZE
       ===================================================== */

    function autoResize() {

        if (!messageInput) {
            return;
        }

        messageInput.style.height =
            "auto";

        messageInput.style.height =
            Math.min(
                messageInput.scrollHeight,
                140
            ) + "px";

    }


    if (messageInput) {

        messageInput.addEventListener(
            "input",
            autoResize
        );

    }


    /* =====================================================
       NEW CHAT
       ===================================================== */

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

                    if (!response.ok) {

                        throw new Error(
                            data.error ||
                            "Could not clear memory."
                        );

                    }

                    chatMessages = [];

                    localStorage.removeItem(
                        "tetronChat"
                    );

                    renderMessages();

                    setMode("general");

                    console.log(
                        "TETRON: New chat started."
                    );

                    if (
                        window.innerWidth <= 800
                    ) {
                        closeSidebarMenu();
                    }

                } catch (error) {

                    console.error(
                        "TETRON NEW CHAT ERROR:",
                        error
                    );

                }

            }
        );

    }


    /* =====================================================
       SUGGESTIONS
       ===================================================== */

    suggestions.forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                const prompt =
                    button.dataset.prompt;

                if (!prompt || !messageInput) {
                    return;
                }

                messageInput.value =
                    prompt;

                autoResize();

                messageInput.focus();

            }
        );

    });


    /* =====================================================
       ATTACHMENT
       ===================================================== */

    if (attachBtn) {

        attachBtn.addEventListener(
            "click",
            () => {

                console.log(
                    "TETRON: Attachment feature coming soon."
                );

            }
        );

    }


    /* =====================================================
       VOICE
       ===================================================== */

    if (voiceBtn) {

        voiceBtn.addEventListener(
            "click",
            () => {

                console.log(
                    "TETRON: Voice feature coming soon."
                );

            }
        );

    }


    /* =====================================================
       START
       ===================================================== */

    loadChat();

    setMode("general");

    autoResize();

    console.log(
        "TETRON: Frontend initialized."
    );

});
