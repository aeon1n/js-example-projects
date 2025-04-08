"use strict";
const ws = new WebSocket("ws://127.0.0.1:5000");
const statusContainer = document.querySelector("#status");
const statusIndicator = document.querySelector("#statusIndicator");
const statusText = document.querySelector("#statusText");
const msgInput = document.querySelector("#msg");
const chatlog = document.querySelector("#chatlog");
const actionLog = document.querySelector("#actionLog");
const USERNAME = "Marcel";
const LOCAL_STORAGE_KEY = "chatlog";
const messageLog = [];
// Utils
function createMessageBubble(message) {
    const bubble = document.createElement("div");
    bubble.classList.add("w-max", "max-w-sm", "m-4", "px-4", "py-2", "rounded-full", "rounded-bl-none");
    if (message.receiver) {
        bubble.classList.add("bg-gray-200", "text-black");
    }
    else {
        bubble.classList.add("bg-emerald-500", "text-white", "ml-auto");
    }
    bubble.innerHTML = message.message;
    return bubble;
}
function appendMessage(message) {
    const bubble = createMessageBubble(message);
    chatlog.appendChild(bubble);
    messageLog.push(message);
    saveLogToLocalStorage(messageLog);
}
function sendMessage(text) {
    const message = {
        sender: USERNAME,
        receiver: false,
        message: text,
    };
    ws.send(text);
    appendMessage(message);
}
function handleIncomingMessage(data) {
    if (data.includes(":")) {
        const [sender, ...rest] = data.split(":");
        const messageText = rest.join(":").trim();
        const message = {
            sender: sender.trim(),
            receiver: true,
            message: messageText,
        };
        appendMessage(message);
    }
    else {
        const actionSpan = document.createElement("span");
        actionSpan.classList.add("italic", "block");
        actionSpan.innerHTML = data;
        chatlog.appendChild(actionSpan);
    }
}
function saveLogToLocalStorage(messageLog) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(messageLog));
}
function loadLogFromLocalStorage() {
    const storedLog = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedLog) {
        try {
            const parsedLog = JSON.parse(storedLog);
            parsedLog.forEach((msg) => {
                const bubble = createMessageBubble(msg);
                chatlog.appendChild(bubble);
                messageLog.push(msg);
            });
        }
        catch (e) {
            console.error("Failed to parse stored message log:", e);
        }
    }
}
// WebSocket events
ws.addEventListener("open", () => {
    statusContainer.classList.replace("text-red-600", "text-emerald-600");
    statusText.innerHTML = "connected to ws://127.0.0.1:5000";
    ws.send(`(USERNAME) ${USERNAME}`);
});
ws.addEventListener("message", (event) => {
    handleIncomingMessage(event.data);
});
msgInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && msgInput.value.trim()) {
        sendMessage(msgInput.value.trim());
        msgInput.value = "";
    }
});
// Load chat history on startup
loadLogFromLocalStorage();
