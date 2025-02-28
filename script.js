// Kiểm tra và yêu cầu nhập tên nếu chưa có
let username = localStorage.getItem("username");
if (!username) {
    username = prompt("Nhập tên của bạn:");
    if (username) {
        localStorage.setItem("username", username);
    } else {
        username = "Guest"; // Tên mặc định nếu người dùng không nhập
    }
}

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDMKTKpyP3nkJMNf4x9C9t5TuaABFFz9dg",
    authDomain: "math-37968.firebaseapp.com",
    databaseURL: "https://math-37968-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "math-37968",
    storageBucket: "math-37968.firebasestorage.app",
    messagingSenderId: "1060180022456",
    appId: "1:1060180022456:web:3113fc1b649cb0f22d504d",
    measurementId: "G-M970L689V1"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const messagesRef = database.ref("messages");

// Function to send message
document.getElementById("sendButton").addEventListener("click", () => {
    const messageInput = document.getElementById("messageInput");
    const message = messageInput.value.trim();
    if (message) {
        messagesRef.push({
            username: username,
            text: message,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        });
        messageInput.value = ""; // Clear input
    }
});

// Function to listen for new messages
messagesRef.on("child_added", (snapshot) => {
    const messageData = snapshot.val();
    displayMessage(messageData.username, messageData.text);
});

// Function to display messages
function displayMessage(username, text) {
    const messagesDiv = document.getElementById("messages");
    const messageElement = document.createElement("div");
    messageElement.innerHTML = `<strong>${username}:</strong> ${text}`;
    messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight; // Auto-scroll
}


// Game logic
let score = localStorage.getItem("score") ? parseInt(localStorage.getItem("score")) : 0;

function updateScoreDisplay() {
    document.getElementById("score-display").innerText = `Score: ${score}`;
}

function generateQuestion() {
    let num1 = Math.floor(Math.random() * 10) + 1;
    let num2 = Math.floor(Math.random() * 10) + 1;
    let questionType = Math.floor(Math.random() * 4) + 1;
    let formatType = Math.random() < 0.5 ? 'multiple' : 'input';
    let question = "";
    let answer;

    switch (questionType) {
        case 1:
            question = `Q. What is ${num1} × ${num2} ?`;
            answer = num1 * num2;
            break;
        case 2:
            question = `Q. What is ${num1} + ${num2} ?`;
            answer = num1 + num2;
            break;
        case 3:
            question = `Q. What is ${num1} ÷ ${num2} ?`;
            answer = (num1 / num2).toFixed(2);
            break;
        case 4:
            question = `Q. What is ${num1} - ${num2} ?`;
            answer = num1 - num2;
            break;
    }

    document.getElementById("question").innerText = question;
    let multipleChoiceDiv = document.getElementById("multiple-choice");
    let inputForm = document.getElementById("inputForm");
    let inputAnswer = document.getElementById("input-answer");
    let submitButton = document.getElementById("submit");
    multipleChoiceDiv.innerHTML = "";

    if (formatType === 'multiple') {
        multipleChoiceDiv.classList.remove("hidden");
        inputForm.classList.add("hidden");

        let choices = [answer, answer + 1, answer - 1, answer + 2].sort(() => Math.random() - 0.5);
        choices.forEach(choice => {
            let button = document.createElement("button");
            button.classList.add("choice-btn");
            button.innerText = choice;
            button.onclick = () => checkAnswer(choice, answer);
            multipleChoiceDiv.appendChild(button);
        });
    } else {
        multipleChoiceDiv.classList.add("hidden");
        inputForm.classList.remove("hidden");
        inputAnswer.value = "";
        submitButton.onclick = () => checkAnswer(parseFloat(inputAnswer.value), answer);
    }
}

function checkAnswer(userAnswer, correctAnswer) {
    let isCorrect = userAnswer == correctAnswer;
    if (isCorrect) {
        score++;
        localStorage.setItem("score", score);
        updateScoreDisplay();
    } else {
        score--;
        localStorage.setItem("score", score);
        updateScoreDisplay();
    }

    Toastify({
        text: isCorrect ? "Correct!" : "Wrong!",
        gravity: "top",
        position: "center",
        speed: 300,
        style: {
            background: isCorrect ? "green" : "red",
        },
    }).showToast();

    setTimeout(generateQuestion, 1500);
}

document.addEventListener("DOMContentLoaded", () => {
    updateScoreDisplay();
    generateQuestion();
});