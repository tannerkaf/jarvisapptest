document.getElementById('action-button').addEventListener('click', function() {
    const userInputField = document.getElementById('user-input');
    const userText = userInputField.value.trim();
    
    if (userText) {
        fetch('/get_response', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_input: userText })
        })
        .then(response => response.json())
        .then(data => {
            // Handle the data/message received from your Flask server
            appendMessage('jarvis', data.message);
        })
        .catch(error => {
            console.error('Error:', error);
            // Handle errors here, such as displaying an error message
        });

        userInputField.value = '';
    }
});
