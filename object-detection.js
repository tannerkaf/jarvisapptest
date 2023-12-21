let useFrontCamera = true;

document.getElementById('flip-camera').addEventListener('click', function() {
    document.getElementById('webcam').classList.toggle('flipped');
});

document.getElementById('toggle-camera').addEventListener('click', function() {
    useFrontCamera = !useFrontCamera;
    startWebcam();
});

function startWebcam() {
    const video = document.getElementById('webcam');
    video.classList.remove('flipped');

    const constraints = {
        video: { facingMode: (useFrontCamera ? "user" : "environment") }
    };

    navigator.mediaDevices.getUserMedia(constraints)
        .then(stream => {
            video.srcObject = stream;
            video.onloadedmetadata = (e) => {
                video.play();
            };
        }).catch(err => {
            console.error("Error accessing webcam:", err);
        });

    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 640;  // Set width and height as needed
    canvas.height = 480;

    const modelPromise = cocoSsd.load();
    video.onloadeddata = async () => {
        const model = await modelPromise;
        detectFrame(video, model, context);
    };
}

function detectFrame(video, model, context) {
    model.detect(video).then(predictions => {
        renderPredictions(predictions, context, video);
        requestAnimationFrame(() => {
            detectFrame(video, model, context);
        });
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

window.onload = startWebcam;
