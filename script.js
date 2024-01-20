let isMuted = false;
const synth = window.speechSynthesis;
let userName = localStorage.getItem("jarvis-user-name") || "Guest";
let selectedVoice = localStorage.getItem("jarvis-selected-voice");
let backgroundColor = localStorage.getItem("jarvis-bg-color") || "#ffffff";
document.body.style.backgroundColor = backgroundColor;

document.getElementById('action-button').addEventListener('click', function() {
    const userInputField = document.getElementById('user-input');
    if (userInputField.value.trim()) {
        processUserInput(userInputField.value);
        userInputField.value = '';
    } else {
        // Implement speech recognition start
    }
});

function processUserInput(inputText) {
    let response = generateBotResponse(inputText);
    appendMessage('user', inputText);
    appendMessage('jarvis', response);
    if (!isMuted) {
        speak(response);
    }
}

function generateBotResponse(input) {
    if (input.toLowerCase().includes("hello")) {
        return `Hello ${userName}! How can I assist you?`;
    } else if (input.toLowerCase().includes("how are you")) {
        return "I'm a chatbot, so I don't have feelings, but thanks for asking!";
    } else {
        return "I'm not sure how to respond to that.";
    }
}

function appendMessage(sender, message) {
    const chatBox = document.getElementById('jarvis-box');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    messageElement.textContent = `${sender === 'user' ? 'You' : 'Jarvis'}: ${message}`;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function speak(text) {
    let utterance = new SpeechSynthesisUtterance(text);
    if (selectedVoice) {
        utterance.voice = synth.getVoices().find(voice => voice.name === selectedVoice);
    }
    synth.speak(utterance);
}

// Menu Button Toggle
document.getElementById('menu-button').addEventListener('click', function() {
    var menuPanel = document.getElementById('menu-panel');
    menuPanel.style.display = menuPanel.style.display === 'block' ? 'none' : 'block';
});

// Voice Settings
function updateVoiceSettings() {
    const voices = synth.getVoices();
    if (voices.length > 0) {
        selectedVoice = voices[0].name;
        localStorage.setItem("jarvis-selected-voice", selectedVoice);
    }
}

// Theme Customization
function updateTheme() {
    backgroundColor = '#abcdef';
    document.body.style.backgroundColor = backgroundColor;
    localStorage.setItem("jarvis-bg-color", backgroundColor);
}

// Language Selection
function changeLanguage() {
    const newLanguage = 'es';
    localStorage.setItem("jarvis-language", newLanguage);
}

// Chat History
function showChatHistory() {
    // Logic to retrieve and display chat history
}

// Help & Tutorials
function showHelp() {
    // Logic to display help information
}

// Profile Management
function updateProfile() {
    userName = 'New Name';
    localStorage.setItem("jarvis-user-name", userName);
}

// Event Listeners for Menu Options
document.getElementById('voice-settings').addEventListener('click', updateVoiceSettings);
document.getElementById('theme-customization').addEventListener('click', updateTheme);
document.getElementById('language-selection').addEventListener('click', changeLanguage);
document.getElementById('chat-history').addEventListener('click', showChatHistory);
document.getElementById('help-tutorials').addEventListener('click', showHelp);
document.getElementById('profile-management').addEventListener('click', updateProfile);
