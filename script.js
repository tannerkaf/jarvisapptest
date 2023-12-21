let isMuted = false;
const synth = window.speechSynthesis;
let userName = localStorage.getItem("jarvis-user-name") || "Guest";
let selectedVoice = localStorage.getItem("jarvis-selected-voice");
let backgroundColor = localStorage.getItem("jarvis-bg-color") || "#ffffff";

document.body.style.backgroundColor = backgroundColor;

// Menu Button Listener
document.getElementById('menu-button').addEventListener('click', function() {
    document.getElementById('menu-panel').style.display = 'block';
    document.getElementById('menu-user-name').value = userName;
    document.getElementById('bg-color').value = backgroundColor;
    populateVoiceList();
});

// Apply Settings Listener
document.getElementById('apply-settings').addEventListener('click', function() {
    userName = document.getElementById('menu-user-name').value || userName;
    localStorage.setItem("jarvis-user-name", userName);
    
    backgroundColor = document.getElementById('bg-color').value;
    document.body.style.backgroundColor = backgroundColor;
    localStorage.setItem("jarvis-bg-color", backgroundColor);

    const selectedVoiceName = document.getElementById('voice-selection').selectedOptions[0].getAttribute('data-name');
    selectedVoice = synth.getVoices().find(voice => voice.name === selectedVoiceName).name;
    localStorage.setItem("jarvis-selected-voice", selectedVoice);

    document.getElementById('menu-panel').style.display = 'none';
});

// Mute Toggle Listener
document.getElementById('mute-toggle').addEventListener('click', function() {
    isMuted = !isMuted;
    document.getElementById('mute-toggle').textContent = isMuted ? 'Unmute' : 'Mute';
});

// Clear Chat Listener
document.getElementById('clear-chat').addEventListener('click', function() {
    clearChat();
});

// Send/Speak Button Listener
document.getElementById('action-button').addEventListener('click', function() {
    if (document.getElementById('user-input').value.trim()) {
        processUserInput();
    } else {
        startSpeechRecognition();
    }
});

function populateVoiceList() {
    var voices = synth.getVoices();
    var voiceSelect = document.getElementById('voice-selection');
    voiceSelect.innerHTML = '';

    voices.forEach(voice => {
        var option = document.createElement('option');
        option.textContent = voice.name + ' (' + voice.lang + ')';
        option.setAttribute('data-name', voice.name);
        if (voice.name === selectedVoice) {
            option.selected = true;
        }
        voiceSelect.appendChild(option);
    });
}

function startSpeechRecognition() {
    let recognition = new webkitSpeechRecognition();
    recognition.onresult = function(event) {
        let speechInput = event.results[0][0].transcript;
        document.getElementById('user-input').value = speechInput;
        processUserInput();
    };
    recognition.start();
}

function processUserInput() {
    const userInput = document.getElementById('user-input').value.trim();
    if (!userInput) return;

    appendMessage('user', userInput);
    saveConversation(userInput, 'user');

    const response = generateResponse(userInput);
    if (response) {
        appendMessage('ai', response);
        saveConversation(response, 'ai');
        speak(response);
    }

    document.getElementById('user-input').value = '';
}

function appendMessage(sender, message) {
    const jarvisBox = document.getElementById('jarvis-box');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender === 'user' ? 'user-message' : 'ai-message');
    const timestamp = new Date().toLocaleTimeString();
    messageDiv.innerHTML = `<strong>${sender === 'user' ? 'You' : 'Jarvis'}:</strong> ${message} <span class="timestamp">(${timestamp})</span>`;
    jarvisBox.appendChild(messageDiv);
}

function generateResponse(input) {
    input = input.toLowerCase();

    if (input.includes("hello") || input.includes("hi")) {
        return `Hello ${userName}! How can I help you?`;
    }
    if (input.includes("how are you")) {
        return `I'm just a chatbot, but I'm doing well, thank you!`;
    }
    if (input.includes("your name")) {
        return `I am Jarvis, your personal assistant chatbot.`;
    }

    return `I'm not sure how to respond to that, ${userName}. Can you try asking something else?`;
}

function clearChat() {
    document.getElementById('jarvis-box').innerHTML = '';
    localStorage.removeItem("jarvis-chat");
}

function saveConversation(message, sender) {
    let conversation = JSON.parse(localStorage.getItem("jarvis-chat") || "[]");
    conversation.push({ message, sender, timestamp: new Date().toISOString() });
    localStorage.setItem("jarvis-chat", JSON.stringify(conversation));
}

function loadConversation() {
    let conversation = JSON.parse(localStorage.getItem("jarvis-chat") || "[]");
    conversation.forEach(msg => {
        appendMessage(msg.sender, msg.message);
    });
}

function speak(text) {
    if (synth.speaking || isMuted) return;
    let utterance = new SpeechSynthesisUtterance(text);
    if (selectedVoice) utterance.voice = synth.getVoices().find(voice => voice.name === selectedVoice);
    synth.speak(utterance);
}

window.onload = function() {
    loadConversation();
    populateVoiceList();
    startWebcamAndDetection();
};

// Webcam and Object Detection Functionality
async function startWebcamAndDetection() {
    const video = document.getElementById('webcam');
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');

    navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
            video.srcObject = stream;
            video.addEventListener('loadeddata', async () => {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;

                const model = await cocoSsd.load();
                detectFrame(video, model, context);
            });
        });

    function detectFrame(video, model, context) {
        model.detect(video).then(predictions => {
            renderPredictions(predictions, context, video);
            requestAnimationFrame(() => {
                detectFrame(video, model, context);
            });
        });
    }

    function renderPredictions(predictions, context, video) {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        context.drawImage(video, 0, 0, context.canvas.width, context.canvas.height);

        predictions.forEach(prediction => {
            const [x, y, width, height] = prediction.bbox;
            context.strokeStyle = '#0f9b0f';
            context.lineWidth = 4;
            context.strokeRect(x, y, width, height);
            context.fillStyle = '#0f9b0f';
            context.fillText(prediction.class, x, y);
        });
    }
}
