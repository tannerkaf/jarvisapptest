let useFrontCamera = true;

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('flip-camera').addEventListener('click', () => {
        document.getElementById('webcam').classList.toggle('flipped');
    });

    document.getElementById('toggle-camera').addEventListener('click', () => {
        useFrontCamera = !useFrontCamera;
        startWebcam();
    });

    startWebcam();
});

function startWebcam() {
    const video = document.getElementById('webcam');
    video.classList.remove('flipped');  // Remove flip on camera toggle

    // Adjust these constraints to set the video feed to vertical
    const constraints = {
        video: {
            aspectRatio: { ideal: 0.5625 },  // 9:16 aspect ratio for portrait mode
            facingMode: useFrontCamera ? 'user' : 'environment'
        }
    };

    navigator.mediaDevices.getUserMedia(constraints)
        .then(stream => {
            video.srcObject = stream;
            video.onloadedmetadata = () => video.play();
            initializeObjectDetection(video);
        }).catch(error => {
            console.error('Error accessing the camera:', error);
        });
}

function initializeObjectDetection(video) {
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 640;  // Adjust to match video size
    canvas.height = 1136; // Adjust to match video size

    cocoSsd.load().then(model => {
        detectFrame(video, model, context);
    });
}

function detectFrame(video, model, context) {
    model.detect(video).then(predictions => {
        renderPredictions(predictions, context, video);
        requestAnimationFrame(() => detectFrame(video, model, context));
    });
}

function renderPredictions(predictions, context, video) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    predictions.forEach(prediction => {
        context.strokeStyle = '#00FFFF';
        context.lineWidth = 4;
        context.strokeRect(...prediction.bbox);
        context.fillStyle = '#00FFFF';
        context.fillText(prediction.class, prediction.bbox[0], prediction.bbox[1] > 10 ? prediction.bbox[1] - 5 : 10);
    });
}
