// DOMS ELEMENTS  ---------------------------------------------------------
const dom_quiz = document.querySelector("#quiz");
const dom_question = document.querySelector("#question");
const dom_choiceA = document.querySelector("#A");
const dom_choiceB = document.querySelector("#B");
const dom_choiceC = document.querySelector("#C");
const dom_choiceD = document.querySelector("#D");
const dom_score = document.querySelector("#score"); // if you have it
const dom_start = document.querySelector("#start");

dom_start.addEventListener("click", onStart);
const dom_progressBar = document.querySelector("#progressBar");


// STORAGE  ---------------------------------------------------------
const STORAGE_KEY = "quizQuestions";

// Default questions (fallback if localStorage is empty)
const defaultQuestions = [
  {
    title: "What does HTML stand for?",
    choiceA: "Hi Thierry More Laught",
    choiceB: "How To move Left",
    choiceC: "Ho Theary Missed the Laundry !",
    choiceD: "Hypertext Markup Language",
    correct: "D",
  },
  {
    title: "What does CSS stand for?",
    choiceA: "Cisco and Super Start",
    choiceB: "Ci So Sa",
    choiceC: "Cascading Style Sheets",
    choiceD: "I don't know !",
    correct: "C",
  },
  {
    title: "What does JS stand for?",
    choiceA: "Junior stars",
    choiceB: "Justing Star",
    choiceC: "Javascript",
    choiceD: "RonanScript",
    correct: "C",
  },
];

function loadQuestionsForPlay(fallback) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return fallback;

    // Clean/validate (optional but good)
    const cleaned = parsed.filter((q) => {
      if (!q) return false;
      return (
        typeof q.title === "string" &&
        typeof q.choiceA === "string" &&
        typeof q.choiceB === "string" &&
        typeof q.choiceC === "string" &&
        typeof q.choiceD === "string" &&
        ["A", "B", "C", "D"].includes(q.correct)
      );
    });

    return cleaned.length ? cleaned : fallback;
  } catch (e) {
    return fallback;
  }
}

// ✅ IMPORTANT: questions come from localStorage (edit page)
let questions = loadQuestionsForPlay(defaultQuestions);

// DATA  ---------------------------------------------------------
let runningQuestionIndex = 0;
let score = 0;

// Hide a given element
function hide(element) {
  if (!element) return;
  element.style.display = "none";
}

function show(element) {
  if (!element) return;
  element.style.display = "block";
}

function onStart() {
  // Reload questions (in case you edited then came back)
  questions = loadQuestionsForPlay(defaultQuestions);

  if (!questions.length) {
    alert("No questions found. Please add some questions in Edit page.");
    return;
  }

  runningQuestionIndex = 0;
  score = 0;

  hide(dom_start);
  show(dom_quiz);

  renderQuestion();
}

function renderQuestion() {
  const currentQuestion = questions[runningQuestionIndex];

  dom_question.textContent = currentQuestion.title;
  dom_choiceA.textContent = currentQuestion.choiceA;
  dom_choiceB.textContent = currentQuestion.choiceB;
  dom_choiceC.textContent = currentQuestion.choiceC;
  dom_choiceD.textContent = currentQuestion.choiceD;
  updateProgress();

}

function onPlayerSubmit(answer) {
  const currentQuestion = questions[runningQuestionIndex];

  if (currentQuestion.correct === answer) {
    score++;
  }

  runningQuestionIndex++;

  if (runningQuestionIndex < questions.length) {
    renderQuestion();
  } else {
    // Save score for result page
    localStorage.setItem("score", String(score));
    localStorage.setItem("total", String(questions.length));

    // ✅ FIX PATH (your result.html is in root)
    window.location.href = "/QuizzApp/index.html/result.html";
  }
}

// Make function available to HTML onclick="onPlayerSubmit('A')"
window.onPlayerSubmit = onPlayerSubmit;
function updateProgress() {
  if (!dom_progressBar) return;

  // if on question 0 => show some small progress, or 0%
  const percent = Math.round((runningQuestionIndex / questions.length) * 100);
  dom_progressBar.style.width = `${percent}%`;
}


// FUNCTIONS ---------------------------------------------------------
show(dom_start);
hide(dom_quiz);
hide(dom_score); // if score element exists
