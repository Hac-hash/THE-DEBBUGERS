let quizData = [
    {
      question: "Who was the first woman to win a Nobel Prize?",
      options: ["Marie Curie","Malala Yousaai","Mother Teresa","Bertha von Suttner"], 
      correct: "Marie Curie",
    },
    {
      question: "Which year was International Women's Day first celebrated?",
      options: ["1911","1945","1975" ,"2000"],
      correct: "1911",
    },
    {
      question: "Who was the first woman to travel to space?",
      options: [ "Sally Ride", "Valentina Tereshkova","Kalpana Chawla", "Peggy Whitson"],
      correct: " Valentina Tereshkova",
    },
    {
      question: "Which country was the first to grant women the right to vote?",
      options: [" USA","UK", "New Zealand","Canada"],
      correct: "New Zealand",
    },
    {
      question: "Which global organization actively works for gender equality and women's rights?",
      options: [ "WHO", "UN Women" ,"UNESCO", "WTO"],
      correct: "UN Women",
    },
    {
      question: "Who was the first female Prime Minister of India?",
      options: [ "Sarojini Naidu", "Indira Gandhi","Pratibha Patil","Sushma Swaraj"],
      correct: "Indira Gandhi",
    },
    {
      question: "What is the main objective of the 'Beti Bachao Beti Padhao' scheme in India?",
      options: ["Women's employment","Prevention of female foeticide and promotion of education","Free healthcare for women","Financial support for women entrepreneurs"],
      correct: "Prevention of female foeticide and promotion of education",
    },
];

const quizContainer = document.querySelector(".quiz-container");
const question = document.querySelector(".quiz-container .question");
const options = document.querySelector(".quiz-container .options");
const nextBtn = document.querySelector(".quiz-container .next-btn");
const quizResult = document.querySelector(".quiz-result");
const startBtnContainer = document.querySelector(".start-btn-container");
const startBtn = document.querySelector(".start-btn-container .start-btn");

let questionNumber = 0;
let score = 0;
const MAX_QUESTIONS = 5;
let timerInterval;
let hasAnswered = false;

const shuffleArray = (array) => {
    return array.slice().sort(() => Math.random() - 0.5);
};

quizData = shuffleArray(quizData);

const resetLocalStorage = () => {
    for (i = 0; i < MAX_QUESTIONS; i++) {
        localStorage.removeItem(`userAnswer_${i}`);
    }
};

resetLocalStorage();

const checkAnswer = (e) => {
    if (hasAnswered) return;

    hasAnswered = true;
    let userAnswer = e.target.textContent;
    if (userAnswer === quizData[questionNumber].correct) {
        score++;
        e.target.classList.add("correct");
    } else {
        e.target.classList.add("incorrect");
    }

    localStorage.setItem(`userAnswer_${questionNumber}`, userAnswer);

    let allOptions = document.querySelectorAll(".quiz-container .option");
    allOptions.forEach((o) => {
        o.classList.add("disabled");
    });

    nextBtn.disabled = false;
    nextBtn.classList.remove("disabled");
};

const createQuestion = () => {
    clearInterval(timerInterval);
    hasAnswered = false; 

    nextBtn.disabled = true;
    nextBtn.classList.add("disabled");

    let secondsLeft = 9;
    const timerDisplay = document.querySelector(".quiz-container .timer");
    timerDisplay.classList.remove("danger");

    timerDisplay.textContent = `Time Left: 10 seconds`;

    timerInterval = setInterval(() => {
        timerDisplay.textContent = `Time Left: ${secondsLeft
            .toString()
            .padStart(2, "0")} seconds`;
        secondsLeft--;

        if (secondsLeft < 3) {
            timerDisplay.classList.add("danger");
        }

        if (secondsLeft < 0) {
            clearInterval(timerInterval);
            displayNextQuestion();
        }
    }, 1000);

    options.innerHTML = "";
    question.innerHTML = `<span class='question-number'>${
        questionNumber + 1
    }/${MAX_QUESTIONS}</span>${quizData[questionNumber].question}`;

    const shuffledOptions = shuffleArray(quizData[questionNumber].options);

    shuffledOptions.forEach((o) => {
        const option = document.createElement("button");
        option.classList.add("option");
        option.innerHTML = o;
        option.addEventListener("click", (e) => {
            document.querySelectorAll(".quiz-container .option").forEach(opt => {
                opt.classList.remove("selected");
            });
            e.target.classList.add("selected");
            checkAnswer(e);
        });
        options.appendChild(option);
    });
};

const retakeQuiz = () => {
    questionNumber = 0;
    score = 0;
    hasAnswered = false; 
    quizData = shuffleArray(quizData);
    resetLocalStorage();

    createQuestion();
    quizResult.style.display = "none";
    quizContainer.style.display = "block";
};

const displayQuizResult = () => {
    quizResult.style.display = "flex";
    quizContainer.style.display = "none";
    quizResult.innerHTML = "";

    const resultHeading = document.createElement("h2");
    resultHeading.innerHTML = `You have scored ${score} out of ${MAX_QUESTIONS}.`;
    quizResult.appendChild(resultHeading);

    for (let i = 0; i < MAX_QUESTIONS; i++) {
        const resultItem = document.createElement("div");
        resultItem.classList.add("question-container");

        const userAnswer = localStorage.getItem(`userAnswer_${i}`);
        const correctAnswer = quizData[i].correct;

        let answeredCorrectly = userAnswer === correctAnswer;

        if (!answeredCorrectly) {
            resultItem.classList.add("incorrect");
        }

        resultItem.innerHTML = `<div class="question">Question ${i + 1}: ${
            quizData[i].question
        }</div>
        <div class="user-answer">Your answer: ${userAnswer || "Not Answered"}</div>
        <div class="correct-answer">Correct answer: ${correctAnswer}</div>`;
        quizResult.appendChild(resultItem);
    }

    const retakeBtn = document.createElement("button");
    retakeBtn.classList.add("retake-btn");
    retakeBtn.innerHTML = "Retake Quiz";
    retakeBtn.addEventListener("click", retakeQuiz);
    quizResult.appendChild(retakeBtn);
};

const displayNextQuestion = () => {
    if (questionNumber >= MAX_QUESTIONS - 1) {
        displayQuizResult();
        return;
    }

    questionNumber++;
    createQuestion();
};

nextBtn.addEventListener("click", displayNextQuestion);

startBtn.addEventListener("click", () => {
    startBtnContainer.style.display = "none";
    quizContainer.style.display = "block";
    createQuestion();
});