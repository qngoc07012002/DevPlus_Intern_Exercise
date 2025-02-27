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
