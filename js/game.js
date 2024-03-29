const questionDom = document.getElementById("question");
// const choices = Array.from(document.getElementsByClassName("choice-text"));
const choicesDom = document.querySelector(".question-list");
const progressTextDom = document.getElementById("progressText");
const scoreTextDom = document.getElementById("score");
const progressBarFullDom = document.getElementById("progressBarFull");
const loader = document.getElementById("loader");
const game = document.getElementById("game");

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

// load questions
let questions = [];

let clientToken = window.localStorage.getItem("client_token");

fetch("https://opentdb.com/api.php?amount=5&category=11&difficulty=easy&token=" + clientToken)
  .then(res => {
    return res.json();
  })
  .then(loadedQuestions => {
    
    if( loadedQuestions.response_code === 4 ) {
      return window.location.assign("reset.html");
    }

    questions = loadedQuestions.results.map(loadedQuestion => {
      // create new object for your formatted question
      const formattedQuestion = {
        question: decodeHTML(loadedQuestion.question),
        choices: {}
      };

      // copy incorrect answers
      const answerChoices = [ ... loadedQuestion.incorrect_answers ];
      
      // generate random index for correct answer's position
      formattedQuestion.answer = Math.floor(Math.random() * answerChoices.length) + 1;
      
      // insert correct answer on the answerChoices array base on its index
      answerChoices.splice(
        formattedQuestion.answer - 1,
        0,
        loadedQuestion.correct_answer
      );
      
      // insert answerChoices to formattedQuestion object
      answerChoices.forEach((choice, index) => {
        formattedQuestion.choices["choice" + (index + 1)] = decodeHTML(choice);
      });

      // insert formattedQuestion object (single question) to 'question' array
      // console.log(formattedQuestion);
      return formattedQuestion;
    });

    game.classList.remove('hidden');
    loader.classList.add('hidden');
    startgame();
  })
  .catch(err => {
    console.error(err);
  });

// constants
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 5;

startgame = () => {
  questionCounter = 0;
  score = 0;
  availableQuestions = [...questions];
  getNewQuestion();
};

getNewQuestion = () => {
  // If no more questions available, redirect to 'end page'
  if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
    localStorage.setItem("mostRecentScore", score);
    // return window.location.assign("/quizapp/end.html");
    return window.location.assign("end.html");
  }

  // Update question hud counter
  questionCounter++;
  progressTextDom.innerText = `Question: ${questionCounter}/${MAX_QUESTIONS}`;

  // Update progress bar
  progressBarFullDom.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

  // Select random question
  const questionIndex = Math.floor(Math.random() * availableQuestions.length);

  // Print question text
  currentQuestion = availableQuestions[questionIndex];
  questionDom.innerText = currentQuestion.question;

  // Print question's choices
  // <p class="choice-container" data-number="1"><span class="choice-prefix">A</span> <span class="choice-text">Choice 1</span></p>

  let choicePrefix = "@";
  choicesDom.innerHTML = '';

  for (let i = 1; i <= Object.keys(currentQuestion.choices).length; i++) {
    choicesDom.innerHTML += `
    <p class="choice-container" data-number="${i}">
      <span class="choice-prefix">${ choicePrefix = String.fromCharCode(choicePrefix.charCodeAt(0) + 1) }</span> 
      <span class="choice-text">${currentQuestion.choices["choice" + i]}</span>
    </p>`;
  }
  
  // choices.forEach(choice => {
  //   const number = choice.parentNode.dataset["number"];
  //   choice.innerText = currentQuestion["choice" + number];
  // });

  // Delete answered questions
  availableQuestions.splice(questionIndex, 1);
  acceptingAnswers = true;
};

updateScore = num => {
  score += num;
  scoreTextDom.innerText = score;
};

answerSelected = event => {
  if (!acceptingAnswers) return;
  if (!event.target.closest(".choice-container")) return;

  acceptingAnswers = false;

  // get selected answer
  let selectedAnswer = event.target.closest(".choice-container").dataset[
    "number"
  ];

  // check whether answer is correct or incorrect
  const answerResult =
    selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";

  if (answerResult === "correct") {
    updateScore(CORRECT_BONUS);
  }

  // update choice ui color
  event.target.closest(".choice-container").classList.add(answerResult);
  setTimeout(() => {
    event.target.closest(".choice-container").classList.remove(answerResult);
    getNewQuestion();
  }, 500);
};

// Attach event listener to parent container: #game
document.getElementById("game").addEventListener("click", answerSelected);

// Helpers
decodeHTML = (input) => {
	let e = document.createElement('textarea');
  e.innerHTML = input;
  // handle case of empty input
  return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
};