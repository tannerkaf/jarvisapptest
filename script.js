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

function startSpeechRecognition() {
    let recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.start();

    recognition.onresult = function(event) {
        let speechResult = event.results[0][0].transcript;
        if (speechResult.toLowerCase().includes("what is this")) {
            window.location.href = 'object-detection.html';
        } else {
            processUserInput(speechResult);
        }
    };

    recognition.onerror = function(event) {
        console.error('Speech recognition error:', event.error);
    };
}

function processUserInput(inputText) {
    appendMessage('user', inputText);
    let botResponse = generateBotResponse(inputText);
    appendMessage('jarvis', botResponse);
    if (!isMuted) {
        speak(botResponse);
    }
    sendChatToServer(inputText);
}

function generateBotResponse(input) {
    if (input.includes("hello") || input.includes("hi")) {
        return `Hello ${userName}! How can I assist you today?`;
    } else if (input.includes("how are you")) {
        return `I'm just a chatbot, but I'm doing well, thank you!`;
    } else if (input.includes("your name")) {
        return `I am Jarvis, your personal assistant chatbot.`;
    } else if (input.includes("tell me a joke")) {
        return `Why don't scientists trust atoms? Because they make up everything!`;
    } else {
        return `I'm not sure how to respond to that, ${userName}. Can you try asking something else?`;
    }
}

function appendMessage(sender, message) {
    const chatBox = document.getElementById('jarvis-box');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    messageElement.textContent = `${sender === 'user' ? 'You' : 'Jarvis'}: ${message}`;
    chatBox.appendChild(messageElement);
}

function sendChatToServer(message) {
    fetch('http://127.0.0.1:5000/save_chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: 1, message: message })  // Adjust user_id as needed
    })
    .then(response => response.json())
    .then(data => console.log('Success:', data))
    .catch((error) => console.error('Error:', error));
}

function speak(text) {
    let utterance = new SpeechSynthesisUtterance(text);
    if (selectedVoice) {
        utterance.voice = synth.getVoices().find(voice => voice.name === selectedVoice);
    }
    synth.speak(utterance);
}

// Menu Button Functionality
document.getElementById('menu-button').addEventListener('click', function() {
    var menuPanel = document.getElementById('menu-panel');
    if (menuPanel.style.display === 'block') {
        menuPanel.style.display = 'none';
    } else {
        menuPanel.style.display = 'block';
    }
});

window.onload = () => {
    if (selectedVoice) {
        synth.onvoiceschanged = () => {
            utterance.voice = synth.getVoices().find(voice => voice.name === selectedVoice);
        };
    }
};
