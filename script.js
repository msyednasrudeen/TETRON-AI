* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  }

:root {
--bg: #080a0f;
--sidebar: #0d1017;
--card: #11151e;
--card-hover: #171c27;
--border: rgba(255,255,255,0.08);

--text: #f5f7fb;
--muted: #8d96a8;

--primary: #7567ff;
--secondary: #00d9ff;

}

html,
body {
width: 100%;
min-height: 100%;
}

body {
font-family: Arial, Helvetica, sans-serif;
background: var(--bg);
color: var(--text);
}

button,
textarea {
font-family: inherit;
}

button {
-webkit-tap-highlight-color: transparent;
}

/* =========================
APP
========================= */

.app {
display: flex;
min-height: 100vh;
}

/* =========================
SIDEBAR
========================= */

.sidebar {
width: 270px;
height: 100vh;

position: fixed;
left: 0;
top: 0;

display: flex;
flex-direction: column;

padding: 18px;

background: var(--sidebar);

border-right: 1px solid var(--border);

z-index: 100;

}

.sidebar-top {
display: flex;
align-items: center;
justify-content: space-between;

margin-bottom: 25px;

}

.brand {
display: flex;
align-items: center;
gap: 11px;
}

.brand-logo {
width: 42px;
height: 42px;

display: flex;
align-items: center;
justify-content: center;

border-radius: 12px;
overflow: hidden;

background:
    linear-gradient(
        135deg,
        var(--primary),
        var(--secondary)
    );

box-shadow:
    0 0 20px rgba(117,103,255,0.18);

}

.brand-logo img {
width: 100%;
height: 100%;
object-fit: contain;
}

.brand-info h2 {
font-size: 18px;
letter-spacing: 1px;
}

.brand-info span {
display: block;

margin-top: 3px;

color: var(--muted);

font-size: 10px;

}

/* CLOSE BUTTON */

.close-sidebar {
display: none;

background: transparent;
border: none;

color: white;

font-size: 25px;

cursor: pointer;

}

/* =========================
NEW CHAT
========================= */

.new-chat {
width: 100%;

padding: 13px;

display: flex;
align-items: center;
justify-content: center;

gap: 8px;

border: 1px solid rgba(117,103,255,0.4);
border-radius: 12px;

background: rgba(117,103,255,0.12);

color: white;

font-size: 14px;
font-weight: 600;

cursor: pointer;

transition: 0.2s;

}

.new-chat:hover {
background: rgba(117,103,255,0.22);
}

/* =========================
HISTORY
========================= */

.history {
margin-top: 30px;

flex: 1;

overflow-y: auto;

}

.history-title {
margin: 0 8px 12px;

color: #687184;

font-size: 10px;
font-weight: bold;

letter-spacing: 1.3px;

}

.chat-item {
width: 100%;

display: flex;
align-items: center;

gap: 10px;

padding: 11px 12px;

margin-bottom: 4px;

border: none;
border-radius: 9px;

background: transparent;

color: #aeb6c5;

text-align: left;

font-size: 13px;

cursor: pointer;

}

.chat-item:hover,
.chat-item.active {
background: var(--card-hover);
color: white;
}

.chat-item span {
color: var(--primary);
}

/* =========================
SIDEBAR BOTTOM
========================= */

.sidebar-bottom {
border-top: 1px solid var(--border);

padding-top: 12px;

}

.side-option {
width: 100%;

display: flex;
align-items: center;

gap: 12px;

padding: 11px;

border: none;
border-radius: 9px;

background: transparent;

color: var(--muted);

text-align: left;

font-size: 13px;

cursor: pointer;

}

.side-option:hover {
background: var(--card);
color: white;
}

/* =========================
MAIN
========================= */

.main {
width: calc(100% - 270px);

margin-left: 270px;

min-height: 100vh;

display: flex;
flex-direction: column;

}

/* =========================
HEADER
========================= */

.header {
height: 64px;

padding: 0 22px;

display: flex;
align-items: center;

border-bottom: 1px solid var(--border);

background: rgba(8,10,15,0.85);

backdrop-filter: blur(15px);

position: sticky;

top: 0;

z-index: 50;

}

.menu-btn {
display: none;

border: none;

background: transparent;

color: white;

font-size: 22px;

cursor: pointer;

}

.mobile-brand {
display: none;

align-items: center;

gap: 8px;

}

.mini-logo {
width: 30px;
height: 30px;

display: flex;
align-items: center;
justify-content: center;

border-radius: 8px;

overflow: hidden;

background:
    linear-gradient(
        135deg,
        var(--primary),
        var(--secondary)
    );

}

.mini-logo img {
width: 100%;
height: 100%;
object-fit: contain;
}

.header-actions {
margin-left: auto;

display: flex;

gap: 8px;

}

.header-actions button {
width: 38px;
height: 38px;

border: 1px solid var(--border);

border-radius: 10px;

background: var(--card);

color: #b8c0ce;

cursor: pointer;

}

.header-actions button:hover {
color: white;
}

/* =========================
CHAT AREA
========================= */

.chat-area {
flex: 1;

width: 100%;

max-width: 900px;

margin: auto;

padding: 35px 25px 150px;

}

/* =========================
WELCOME
========================= */

.welcome {
min-height: 60vh;

display: flex;
flex-direction: column;

align-items: center;
justify-content: center;

text-align: center;

}

.welcome-logo {
width: 70px;
height: 70px;

display: flex;
align-items: center;
justify-content: center;

margin-bottom: 22px;

border-radius: 22px;

overflow: hidden;

background:
    linear-gradient(
        135deg,
        var(--primary),
        var(--secondary)
    );

box-shadow:
    0 0 35px rgba(117,103,255,0.3);

}

.welcome-logo img {
width: 100%;
height: 100%;

object-fit: contain;

}

.welcome h1 {
font-size: clamp(28px, 5vw, 44px);

margin-bottom: 12px;

}

.welcome h1 span {
background:
linear-gradient(
90deg,
var(--primary),
var(--secondary)
);

-webkit-background-clip: text;
-webkit-text-fill-color: transparent;

}

.welcome p {
max-width: 500px;

color: var(--muted);

line-height: 1.6;

font-size: 14px;

}

/* =========================
SUGGESTIONS
========================= */

.suggestions {
width: 100%;

max-width: 650px;

display: grid;

grid-template-columns: 1fr 1fr;

gap: 12px;

margin-top: 35px;

}

.suggestion {
padding: 17px;

display: flex;
flex-direction: column;

gap: 7px;

border: 1px solid var(--border);

border-radius: 14px;

background: var(--card);

color: white;

text-align: left;

cursor: pointer;

transition: 0.25s;

}

.suggestion:hover {
transform: translateY(-3px);

background: var(--card-hover);

border-color:
    rgba(117,103,255,0.45);

}

.suggestion strong {
font-size: 13px;
}

.suggestion small {
color: var(--muted);

font-size: 11px;

}

/* =========================
MESSAGES
========================= */

.messages {
width: 100%;
}

.message {
display: flex;

gap: 12px;

margin-bottom: 22px;

}

.message.user {
justify-content: flex-end;
}

.message-content {
max-width: 75%;

padding: 13px 16px;

border-radius: 14px;

background: var(--card);

line-height: 1.6;

font-size: 14px;

}

.message.user .message-content {
background:
linear-gradient(
135deg,
#5d51d9,
#4655c9
);
}

/* =========================
INPUT
========================= */

.input-area {
width: 100%;

padding: 12px 20px 18px;

background:
    linear-gradient(
        to top,
        var(--bg) 75%,
        transparent
    );

position: fixed;

bottom: 0;

z-index: 40;

}

.input-box {
max-width: 850px;

margin: auto;

display: flex;

align-items: flex-end;

gap: 7px;

padding: 7px;

border: 1px solid var(--border);

border-radius: 17px;

background: #10141d;

}

.input-box:focus-within {
border-color:
rgba(117,103,255,0.5);
}

#messageInput {
flex: 1;

min-height: 42px;

max-height: 130px;

padding: 11px;

resize: none;

border: none;

outline: none;

background: transparent;

color: white;

font-size: 14px;

}

#messageInput::placeholder {
color: #687184;
}

.attach-btn,
.voice-btn,
.send-btn {
width: 40px;
height: 40px;

flex-shrink: 0;

border: none;

border-radius: 11px;

background: transparent;

color: #8993a5;

font-size: 17px;

cursor: pointer;

}

.attach-btn:hover,
.voice-btn:hover {
background: var(--card-hover);

color: white;

}

.send-btn {
color: white;

background:
    linear-gradient(
        135deg,
        var(--primary),
        var(--secondary)
    );

font-size: 20px;

}

.send-btn:hover {
transform: scale(1.05);
}

.disclaimer {
max-width: 850px;

margin: 7px auto 0;

text-align: center;

color: #596274;

font-size: 10px;

}

/* =========================
OVERLAY
========================= */

.overlay {
display: none;

position: fixed;

inset: 0;

background: rgba(0,0,0,0.55);

z-index: 90;

}

/* =========================
MOBILE
========================= */

@media (max-width: 768px) {

.sidebar {
    width: 270px;

    transform: translateX(-100%);

    transition:
        transform 0.25s ease;
}

.sidebar.open {
    transform: translateX(0);
}

.close-sidebar {
    display: block;
}

.overlay.show {
    display: block;
}

.main {
    width: 100%;

    margin-left: 0;
}

.header {
    padding: 0 14px;
}

.menu-btn {
    display: block;
}

.mobile-brand {
    display: flex;

    margin-left: 12px;
}

.chat-area {
    padding: 20px 14px 145px;
}

.welcome {
    min-height: 65vh;
}

.welcome-logo {
    width: 60px;
    height: 60px;
}

.welcome h1 {
    font-size: 29px;
}

.suggestions {
    grid-template-columns: 1fr;

    gap: 9px;

    margin-top: 25px;
}

.suggestion {
    padding: 14px;
}

.input-area {
    padding: 8px 10px 12px;
}

.input-box {
    border-radius: 14px;
}

.attach-btn,
.voice-btn,
.send-btn {
    width: 37px;
    height: 37px;
}

}

/* =========================
SMALL PHONES
========================= */

@media (max-width: 380px) {

.welcome h1 {
    font-size: 25px;
}

.welcome-logo {
    width: 54px;
    height: 54px;
}

.voice-btn {
    display: none;
}

}
