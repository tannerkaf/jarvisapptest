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
        processUserInput(speechResult);
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
}

function generateBotResponse(input) {
    // Simple response logic, you can expand this as needed
    if (input.toLowerCase().includes("hello")) {
        return `Hello ${userName}! How can I help you?`;
    }
    return `I'm not sure how to respond to that, ${userName}.`;
}

function appendMessage(sender, message) {
    const chatBox = document.getElementById('jarvis-box');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    messageElement.textContent = `${sender === 'user' ? 'You' : 'Jarvis'}: ${message}`;
    chatBox.appendChild(messageElement);
}

function speak(text) {
    let utterance = new SpeechSynthesisUtterance(text);
    if (selectedVoice) {
        utterance.voice = synth.getVoices().find(voice => voice.name === selectedVoice);
    }
    synth.speak(utterance);
}

window.onload = () => {
    if (selectedVoice) {
        // Set the selected voice if it has been stored
        synth.onvoiceschanged = () => {
            utterance.voice = synth.getVoices().find(voice => voice.name === selectedVoice);
        };
    }
};
