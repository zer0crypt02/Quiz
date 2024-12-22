const questions = [
    {
        question: "Türkiye'nin başkenti neresidir?",
        options: ["İstanbul", "Ankara", "İzmir", "Bursa"],
        correct: 1
    },
    {
        question: "Hangi gezegen Güneş Sistemi'nde en büyüktür?",
        options: ["Mars", "Venüs", "Jüpiter", "Satürn"],
        correct: 2
    },
    {
        question: "İnsan vücudunda kaç kemik vardır?",
        options: ["206", "195", "215", "180"],
        correct: 0
    },
    {
        question: "Hangi element periyodik tabloda 'Fe' sembolü ile gösterilir?",
        options: ["Flor", "Demir", "Fosfor", "Fermiyum"],
        correct: 1
    }
];

let currentQuestion = 0;
let score = 0;
let timeLeft = 60;
let timer;
let answers = new Array(questions.length).fill(-1);

const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const progressEl = document.getElementById('progress');
const timeEl = document.getElementById('time');
const scoreEl = document.getElementById('score');

function showQuestion(index) {
    const question = questions[index];
    questionEl.textContent = `${index + 1}. ${question.question}`;
    
    optionsEl.innerHTML = '';
    question.options.forEach((option, i) => {
        const button = document.createElement('div');
        button.className = 'option';
        if (answers[index] === i) {
            button.classList.add('selected');
            if (answers[index] === question.correct) {
                button.classList.add('correct');
            } else {
                button.classList.add('wrong');
                const correctButton = document.createElement('div');
                correctButton.className = 'option correct';
                correctButton.textContent = question.options[question.correct];
                optionsEl.appendChild(correctButton);
            }
        }
        button.textContent = option;
        button.addEventListener('click', () => selectOption(i));
        optionsEl.appendChild(button);
    });

    updateControls();
    updateProgress();
}

function selectOption(index) {
    const question = questions[currentQuestion];
    answers[currentQuestion] = index;
    
    const options = document.querySelectorAll('.option');
    options.forEach(option => {
        option.classList.remove('selected', 'correct', 'wrong');
    });
    
    const selectedOption = options[index];
    selectedOption.classList.add('selected');
    
    if (index === question.correct) {
        selectedOption.classList.add('correct');
    } else {
        selectedOption.classList.add('wrong');
        options[question.correct].classList.add('correct');
    }
    
    updateControls();
    
    setTimeout(() => {
        if (currentQuestion < questions.length - 1) {
            currentQuestion++;
            showQuestion(currentQuestion);
        }
    }, 1500);
}

function updateControls() {
    prevBtn.disabled = currentQuestion === 0;
    nextBtn.textContent = currentQuestion === questions.length - 1 ? 'Bitir' : 'Sonraki';
}

function updateProgress() {
    const percent = ((currentQuestion + 1) / questions.length) * 100;
    progressEl.style.width = percent + '%';
}

function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        timeEl.textContent = timeLeft;
        if (timeLeft === 0) {
            endQuiz();
        }
    }, 1000);
}

function endQuiz() {
    clearInterval(timer);
    score = answers.reduce((acc, answer, index) => {
        return answer === questions[index].correct ? acc + 1 : acc;
    }, 0);

    const container = document.querySelector('.container');
    container.innerHTML = `
        <div class="quiz-header">
            <h2>Quiz Tamamlandı!</h2>
        </div>
        <div class="score">
            Skorunuz: ${score} / ${questions.length}
            <br>
            Doğru Cevap Yüzdesi: ${((score / questions.length) * 100).toFixed(1)}%
        </div>
        <button onclick="location.reload()" style="display: block; margin: 20px auto;">
            Tekrar Dene
        </button>
    `;
}

prevBtn.addEventListener('click', () => {
    if (currentQuestion > 0) {
        currentQuestion--;
        showQuestion(currentQuestion);
    }
});

nextBtn.addEventListener('click', () => {
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        showQuestion(currentQuestion);
    } else {
        endQuiz();
    }
});

// Başlangıç
showQuestion(0);
startTimer();