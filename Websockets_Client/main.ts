const ws = new WebSocket("ws://127.0.0.1:5000");

const statusContainer = document.querySelector("#status") as HTMLDivElement;
const statusIndicator = document.querySelector(
  "#statusIndicator"
) as HTMLSpanElement;
const statusText = document.querySelector("#statusText") as HTMLSpanElement;
const msgInput = document.querySelector("#msg") as HTMLInputElement;
const chatlog = document.querySelector("#chatlog") as HTMLDivElement;
const actionLog = document.querySelector("#actionLog") as HTMLDivElement;

interface Message {
  sender: string;
  receiver: boolean;
  message: string;
}

const USERNAME = "Marcel";
const LOCAL_STORAGE_KEY = "chatlog";
const messageLog: Message[] = [];

// Utils
function createMessageBubble(message: Message): HTMLDivElement {
  const bubble = document.createElement("div");
  bubble.classList.add(
    "w-max",
    "max-w-sm",
    "m-4",
    "px-4",
    "py-2",
    "rounded-full",
    "rounded-bl-none"
  );

  if (message.receiver) {
    bubble.classList.add("bg-gray-200", "text-black");
  } else {
    bubble.classList.add("bg-emerald-500", "text-white", "ml-auto");
  }

  bubble.innerHTML = message.message;
  return bubble;
}

function appendMessage(message: Message) {
  const bubble = createMessageBubble(message);
  chatlog.appendChild(bubble);
  messageLog.push(message);
  saveLogToLocalStorage(messageLog);
}

function sendMessage(text: string) {
  const message: Message = {
    sender: USERNAME,
    receiver: false,
    message: text,
  };

  ws.send(text);
  appendMessage(message);
}

function handleIncomingMessage(data: string) {
  if (data.includes(":")) {
    const [sender, ...rest] = data.split(":");
    const messageText = rest.join(":").trim();

    const message: Message = {
      sender: sender.trim(),
      receiver: true,
      message: messageText,
    };

    appendMessage(message);
  } else {
    const actionSpan = document.createElement("span");
    actionSpan.classList.add("italic", "block");
    actionSpan.innerHTML = data;

    chatlog.appendChild(actionSpan);
  }
}

function saveLogToLocalStorage(messageLog: Message[]) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(messageLog));
}

function loadLogFromLocalStorage() {
  const storedLog = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (storedLog) {
    try {
      const parsedLog: Message[] = JSON.parse(storedLog);
      parsedLog.forEach((msg) => {
        const bubble = createMessageBubble(msg);
        chatlog.appendChild(bubble);
        messageLog.push(msg);
      });
    } catch (e) {
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
