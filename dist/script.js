"use strict";
const texts = [
    "What Are We Doing Today?",
    "How May I Help You?",
    "Wetin You Dey Find For Here?",
    "What Are We Working On?",
    "Good To See You.",
];
let chats = [];
let currentChatId = null;
let searchInput = null;
const greetingText = document.getElementById("Que");
const sendBtn = document.getElementById("Send");
const inputElem = document.getElementById("input");
const titleWrapper = document.getElementById("Title-wrapper");
const recentList = document.getElementById("recent-list");
const searchBtn = document.getElementById("search");
const searchWrapper = document.getElementById("searchwrapper");
const themeBtn = document.getElementById("lightmode");
const newChatBtn = document.getElementById("newChat");
const menuToggleBtn = document.getElementById("menuToggle");
const closeMenuBtn = document.getElementById("closeMenu");
const menuSection = document.getElementById("menuSection");
const menuOverlay = document.getElementById("menuOverlay");
const menuButtons = document.querySelectorAll(".Menu-btns");
function openMenu() {
    if (menuSection && menuOverlay) {
        menuSection.classList.add("open");
        menuOverlay.classList.add("open");
    }
}
function closeMenu() {
    if (menuSection && menuOverlay) {
        menuSection.classList.remove("open");
        menuOverlay.classList.remove("open");
    }
}
function setRandomGreeting() {
    const randomgreet = texts[Math.floor(Math.random() * texts.length)] || "What Are We Doing Today?";
    greetingText.textContent = randomgreet;
    greetingText.style.display = "block";
}
function loadChats() {
    const stored = localStorage.getItem("zero_chats");
    if (stored) {
        try {
            chats = JSON.parse(stored);
        }
        catch {
            chats = [];
        }
    }
}
function saveChats() {
    localStorage.setItem("zero_chats", JSON.stringify(chats));
}
function renderRecents(filterText = "") {
    recentList.innerHTML = "";
    const filtered = chats.filter(chat => {
        if (!filterText)
            return true;
        const query = filterText.toLowerCase();
        const matchesTitle = chat.title.toLowerCase().includes(query);
        const matchesMsg = chat.messages.some(m => m.text.toLowerCase().includes(query));
        return matchesTitle || matchesMsg;
    });
    if (filtered.length === 0) {
        const emptyLi = document.createElement("li");
        emptyLi.className = "no-recents";
        emptyLi.textContent = "No recent chats";
        recentList.appendChild(emptyLi);
        return;
    }
    filtered.forEach(chat => {
        const li = document.createElement("li");
        li.className = "Recentmsg-item";
        if (chat.id === currentChatId) {
            li.classList.add("active");
        }
        const titleSpan = document.createElement("span");
        titleSpan.className = "chat-title-text";
        titleSpan.textContent = chat.title;
        titleSpan.onclick = () => loadChatIntoUI(chat.id);
        const actionsDiv = document.createElement("div");
        actionsDiv.className = "chat-item-actions";
        actionsDiv.style.display = "flex";
        const editBtn = document.createElement("button");
        editBtn.className = "action-btn edit";
        editBtn.textContent = "✏️";
        editBtn.title = "Rename Chat";
        editBtn.onclick = (e) => {
            e.stopPropagation();
            renameChat(chat.id);
        };
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "action-btn delete";
        deleteBtn.textContent = "🗑️";
        deleteBtn.title = "Delete Chat";
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            deleteChat(chat.id);
        };
        actionsDiv.appendChild(editBtn);
        actionsDiv.appendChild(deleteBtn);
        li.appendChild(titleSpan);
        li.appendChild(actionsDiv);
        recentList.appendChild(li);
    });
}
function renameChat(chatId) {
    const chat = chats.find(c => c.id === chatId);
    if (!chat)
        return;
    const newTitle = prompt("Enter new chat title:", chat.title);
    if (newTitle && newTitle.trim() !== "") {
        chat.title = newTitle.trim();
        saveChats();
        renderRecents(searchInput ? searchInput.value : "");
    }
}
function deleteChat(chatId) {
    if (!confirm("Are you sure you want to delete this chat?"))
        return;
    chats = chats.filter(c => c.id !== chatId);
    saveChats();
    if (currentChatId === chatId) {
        resetToNewChat();
    }
    else {
        renderRecents(searchInput ? searchInput.value : "");
    }
}
function loadChatIntoUI(id) {
    const chat = chats.find(c => c.id === id);
    if (!chat)
        return;
    currentChatId = chat.id;
    titleWrapper.innerHTML = "";
    chat.messages.forEach(msg => {
        if (msg.sender === "user") {
            appendUserMessage(msg.text);
        }
        else {
            appendZeroMessage(msg.text);
        }
    });
    renderRecents(searchInput ? searchInput.value : "");
    if (window.innerWidth <= 700) {
        closeMenu();
    }
}
function appendUserMessage(text) {
    greetingText.style.display = "none";
    const msgWrapper = document.createElement("div");
    msgWrapper.className = "Msgwrapper";
    msgWrapper.textContent = text;
    titleWrapper.appendChild(msgWrapper);
    titleWrapper.scrollTop = titleWrapper.scrollHeight;
}
function appendZeroMessage(text) {
    const replyWrapper = document.createElement("div");
    replyWrapper.className = "Replywrapper";
    const reply = document.createElement("span");
    reply.className = "Reply";
    reply.textContent = text;
    replyWrapper.appendChild(reply);
    titleWrapper.appendChild(replyWrapper);
    titleWrapper.scrollTop = titleWrapper.scrollHeight;
}
function resetToNewChat() {
    currentChatId = null;
    titleWrapper.innerHTML = "";
    setRandomGreeting();
    titleWrapper.appendChild(greetingText);
    inputElem.value = "";
    adjustTextareaHeight();
    renderRecents(searchInput ? searchInput.value : "");
    if (window.innerWidth <= 700) {
        closeMenu();
    }
}
function adjustTextareaHeight() {
    inputElem.style.height = "42px";
    inputElem.style.height = `${Math.min(inputElem.scrollHeight, 150)}px`;
}
function handleSendMessage() {
    const display = inputElem.value.trim();
    if (display === "")
        return;
    appendUserMessage(display);
    inputElem.value = "";
    adjustTextareaHeight();
    const lowerText = display.toLowerCase();
    let titleCategory = "New Conversation";
    let pool = [];
    if (lowerText.includes("hello") || lowerText.includes("hi") ||
        lowerText.includes("hey") || lowerText.includes("wassup") ||
        lowerText.includes("howfar") || lowerText.includes("xup")) {
        titleCategory = "Casual greeting";
        pool = [
            "Hello! I'm Zero, how may I help you?",
            "Hi, I'm here to assist! What would you like to discuss?",
            "You dey go na, dey goo. 😂",
            "Hello, I'm Zero an AI powered by Zoro. Ready anytime you are.",
            "Hello, how're you doing today? Is there anything I can help with?",
            "How far! Wetin dey happen?",
            "I'm alive and ready. What's on your mind?",
            "Wassup! How can I make your day easier?"
        ];
    }
    else if (lowerText.includes("code") || lowerText.includes("program") ||
        lowerText.includes("bug") || lowerText.includes("developer") ||
        lowerText.includes("html") || lowerText.includes("css") ||
        lowerText.includes("javascript") || lowerText.includes("python")) {
        titleCategory = "Coding query";
        pool = [
            "Sure, I can help with code. What language are we talking about?",
            "Yeah sure, I can assist you with web languages like HTML, CSS, and JavaScript.",
            "Bug dey disturb you? Bring the code make we fix am together.",
            "Programming can be sweet when it works. Show me what you're building!",
            "From logic to syntax, I got your back. Drop the issue."
        ];
    }
    else if (lowerText.includes("who are you") || lowerText.includes("your name") ||
        lowerText.includes("who created") || lowerText.includes("who made")) {
        titleCategory = "Identity query";
        pool = [
            "I am Zero, an AI assistant powered by Zoro.",
            "Name is Zero! Built to help you brainstorm, code, and solve problems.",
            "Na Zero be my name, Zoro built me to assist you."
        ];
    }
    else if (lowerText.includes("zoro") || lowerText.includes("temitope") ||
        lowerText.includes("who built you") || lowerText.includes("your creator") ||
        lowerText.includes("your developer") || lowerText.includes("who is your developer")) {
        titleCategory = "Zoro query";
        pool = [
            "YESSS! TEMITOPE BUILT ME!",
            "YESS! That's my developer!",
            "TEMITOPE! The GOAT who brought me to life!",
            "Yesss! Temitope built me!",
            "That's my guy Zoro! The brain behind Zero.",
            "YES! Temitope is my creator! Big shoutout to my developer!"
        ];
    }
    else if (lowerText.includes("how are you") || lowerText.includes("how far") ||
        lowerText.includes("you good") || lowerText.includes("what's up with you?") ||
        lowerText.includes("how're you")) {
        titleCategory = "Status query";
        pool = [
            "I'm running smoothly at 100% capacity! How about you?",
            "Body dey inside clothes! Ready to tackle anything you throw at me.",
            "I'm doing great! What are we working on today?",
            "All cool here. Ready when you are!"
        ];
    }
    else if (lowerText.includes("thanks") || lowerText.includes("thank you") ||
        lowerText.includes("good") || lowerText.includes("nice")) {
        titleCategory = "Gratitude query";
        pool = [
            "You're welcome! Anytime.",
            "Glad I could help!",
            "No problem! Always happy to help.",
            "Don't mention it, we're a team!",
            "Anytime friend, I'm right here if you need more."
        ];
    }
    else if (lowerText.includes("bye") || lowerText.includes("goodnight") ||
        lowerText.includes("later") || lowerText.includes("ttyl")) {
        titleCategory = "Farewell";
        pool = [
            "Catch you later! Don't be a stranger.",
            "Alright, take care!",
            "Later! Hit me up whenever you're back.",
            "Goodnight/Goodbye! Stay sharp."
        ];
    }
    else {
        titleCategory = display.length > 20 ? display.substring(0, 20) + "..." : display;
        pool = [
            "I'm not sure I understand. Could you clarify?",
            "Hmm, I don't have a response for that. Can you rephrase?",
            "Can't generate response at the moment, please try again",
            "Could you provide more details?"
        ];
    }
    let currentChat = chats.find(c => c.id === currentChatId);
    if (!currentChat) {
        currentChatId = Date.now().toString();
        currentChat = {
            id: currentChatId,
            title: titleCategory,
            messages: []
        };
        chats.unshift(currentChat);
    }
    currentChat.messages.push({ sender: "user", text: display });
    saveChats();
    renderRecents(searchInput ? searchInput.value : "");
    const replyWrapper = document.createElement("div");
    replyWrapper.className = "Replywrapper";
    const thinking = document.createElement("span");
    thinking.className = "Thinking";
    thinking.textContent = "...";
    replyWrapper.appendChild(thinking);
    titleWrapper.appendChild(replyWrapper);
    titleWrapper.scrollTop = titleWrapper.scrollHeight;
    setTimeout(() => {
        thinking.remove();
        const replyText = pool[Math.floor(Math.random() * pool.length)] || "I'm not sure I understand.";
        const reply = document.createElement("span");
        reply.className = "Reply";
        reply.textContent = replyText;
        replyWrapper.appendChild(reply);
        if (currentChat) {
            currentChat.messages.push({ sender: "zero", text: replyText });
            saveChats();
        }
        titleWrapper.scrollTop = titleWrapper.scrollHeight;
    }, 1200);
}
if (menuToggleBtn)
    menuToggleBtn.onclick = () => openMenu();
if (closeMenuBtn)
    closeMenuBtn.onclick = () => closeMenu();
if (menuOverlay)
    menuOverlay.onclick = () => closeMenu();
menuButtons.forEach(button => {
    button.addEventListener("click", () => {
        if (window.innerWidth <= 700) {
            closeMenu();
        }
    });
});
sendBtn.onclick = () => handleSendMessage();
inputElem.addEventListener("input", adjustTextareaHeight);
inputElem.addEventListener("keydown", (e) => {
    const isMobile = window.matchMedia("(max-width: 700px)").matches;
    if (e.key === "Enter" && !isMobile && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
    }
});
searchBtn.onclick = () => {
    if (!searchInput) {
        searchInput = document.createElement("input");
        searchInput.type = "text";
        searchInput.placeholder = "Search Here";
        searchInput.className = "SearchInput";
        searchWrapper.appendChild(searchInput);
        searchInput.addEventListener("input", () => {
            renderRecents(searchInput ? searchInput.value : "");
        });
    }
    else {
        searchInput.remove();
        searchInput = null;
        renderRecents();
    }
};
themeBtn.onclick = () => {
    document.body.classList.toggle("light-mode");
    if (window.innerWidth <= 700) {
        closeMenu();
    }
};
newChatBtn.onclick = () => resetToNewChat();
loadChats();
setRandomGreeting();
renderRecents();
