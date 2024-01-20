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
        startSpeechRecognition();
    }
});

// Additional functions for speech recognition, chat processing, etc.

// Menu Button Functionality
document.getElementById('menu-button').addEventListener('click', function() {
    var menuPanel = document.getElementById('menu-panel');
    menuPanel.style.display = menuPanel.style.display === 'block' ? 'none' : 'block';
});

// Voice Settings Function
function updateVoiceSettings() {
    // Implement voice setting adjustments
}

// Theme Customization Function
function updateTheme() {
    // Implement theme customization logic
}

// Language Selection Function
function changeLanguage() {
    // Implement language selection logic
}

// Chat History Function
function showChatHistory() {
    // Implement chat history display
}

// Help & Tutorials Function
function showHelp() {
    // Implement help and tutorial display
}

// Profile Management Function
function updateProfile() {
    // Implement profile management logic
}

// Event listeners for menu options
document.getElementById('voice-settings').addEventListener('click', updateVoiceSettings);
document.getElementById('theme-customization').addEventListener('click', updateTheme);
document.getElementById('language-selection').addEventListener('click', changeLanguage);
document.getElementById('chat-history').addEventListener('click', showChatHistory);
document.getElementById('help-tutorials').addEventListener('click', showHelp);
document.getElementById('profile-management').addEventListener('click', updateProfile);
