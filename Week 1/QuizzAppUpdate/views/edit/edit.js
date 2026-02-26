"use strict";

// Storage key used by Edit + Play
const STORAGE_KEY = "quizQuestions";

/** Default questions */
const DEFAULT_QUESTIONS = [
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
    choiceC: "JavaScript",
    choiceD: "RonanScript",
    correct: "C",
  },
];

// ---------- DOM ----------
const listEl = document.getElementById("list");
const emptyEl = document.getElementById("empty");

const btnAdd = document.getElementById("btn-add");
const btnReset = document.getElementById("btn-reset");

const backdrop = document.getElementById("backdrop");
const modalTitle = document.getElementById("modal-title");

const qTitle = document.getElementById("qTitle");
const aA = document.getElementById("aA");
const aB = document.getElementById("aB");
const aC = document.getElementById("aC");
const aD = document.getElementById("aD");
const correct = document.getElementById("correct");
const errorEl = document.getElementById("error");

const btnCancel = document.getElementById("btn-cancel");
const btnSave = document.getElementById("btn-save");

// ---------- STATE ----------
let questions = loadQuestions();
let editingIndex = null; // null means "create new"

// ---------- INIT ----------
renderList();

btnAdd.addEventListener("click", openModalForCreate);

btnReset.addEventListener("click", () => {
  if (!confirm("Reset questions to default?")) return;
  questions = deepCopy(DEFAULT_QUESTIONS);
  saveQuestions(questions);
  renderList();
});

btnCancel.addEventListener("click", closeModal);
backdrop.addEventListener("click", (e) => {
  if (e.target === backdrop) closeModal();
});

btnSave.addEventListener("click", onSave);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && isModalOpen()) closeModal();
});

// ---------- STORAGE ----------
function loadQuestions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return deepCopy(DEFAULT_QUESTIONS);

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return deepCopy(DEFAULT_QUESTIONS);

    const cleaned = parsed.filter(isValidQuestion);
    return cleaned.length ? cleaned : deepCopy(DEFAULT_QUESTIONS);
  } catch {
    return deepCopy(DEFAULT_QUESTIONS);
  }
}

function saveQuestions(qs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(qs));
}

function isValidQuestion(q) {
  if (!q || typeof q !== "object") return false;

  const need = ["title", "choiceA", "choiceB", "choiceC", "choiceD", "correct"];
  for (const k of need) if (!(k in q)) return false;

  return ["A", "B", "C", "D"].includes(q.correct);
}

function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// ---------- RENDER ----------
function renderList() {
  listEl.innerHTML = "";

  if (!questions.length) {
    emptyEl.style.display = "block";
    return;
  }
  emptyEl.style.display = "none";

  questions.forEach((q, index) => {
    const row = document.createElement("div");
    row.className = "row";

    const left = document.createElement("div");
    left.innerHTML = `
      <div class="row-title">${escapeHtml(q.title)}</div>
      <div style="opacity:.75; font-size: 13px; margin-top:4px;">
        Correct: <b>${escapeHtml(q.correct)}</b>
      </div>
    `;

    const actions = document.createElement("div");
    actions.className = "row-actions";

    const btnEdit = document.createElement("button");
    btnEdit.className = "icon-btn";
    btnEdit.textContent = "Edit";
    btnEdit.title = "Edit";
    btnEdit.addEventListener("click", () => openModalForEdit(index));

    const btnDel = document.createElement("button");
    btnDel.className = "icon-btn";
    btnDel.textContent = "Delete";
    btnDel.title = "Delete";
    btnDel.addEventListener("click", () => onDelete(index));

    actions.append(btnEdit, btnDel);
    row.append(left, actions);
    listEl.appendChild(row);
  });
}

// ---------- MODAL ----------
function openModalForCreate() {
  editingIndex = null;
  modalTitle.textContent = "Create new question";
  setForm({
    title: "",
    choiceA: "",
    choiceB: "",
    choiceC: "",
    choiceD: "",
    correct: "A",
  });
  showError("");
  openModal();
}

function openModalForEdit(index) {
  editingIndex = index;
  modalTitle.textContent = "Edit question";
  setForm(questions[index]);
  showError("");
  openModal();
}

function openModal() {
  backdrop.style.display = "flex";
  document.body.style.overflow = "hidden";
  setTimeout(() => qTitle.focus(), 0);
}

function closeModal() {
  backdrop.style.display = "none";
  document.body.style.overflow = "";
  showError("");
}

function isModalOpen() {
  return backdrop.style.display === "flex";
}

function setForm(q) {
  qTitle.value = q.title ?? "";
  aA.value = q.choiceA ?? "";
  aB.value = q.choiceB ?? "";
  aC.value = q.choiceC ?? "";
  aD.value = q.choiceD ?? "";
  correct.value = q.correct ?? "A";
}

function getForm() {
  return {
    title: qTitle.value.trim(),
    choiceA: aA.value.trim(),
    choiceB: aB.value.trim(),
    choiceC: aC.value.trim(),
    choiceD: aD.value.trim(),
    correct: correct.value,
  };
}

function showError(msg) {
  if (!msg) {
    errorEl.style.display = "none";
    errorEl.textContent = "";
    return;
  }
  errorEl.style.display = "block";
  errorEl.textContent = msg;
}

// ---------- ACTIONS ----------
function onSave() {
  const q = getForm();

  if (!q.title) return showError("Please enter the question title.");
  if (!q.choiceA || !q.choiceB || !q.choiceC || !q.choiceD)
    return showError("Please fill answers A, B, C and D.");
  if (!["A", "B", "C", "D"].includes(q.correct))
    return showError("Correct answer must be A / B / C / D.");

  if (editingIndex === null) {
    questions.push(q);
  } else {
    questions[editingIndex] = q;
  }

  saveQuestions(questions);
  renderList();
  closeModal();
}

function onDelete(index) {
  if (!confirm("Delete this question?")) return;
  questions.splice(index, 1);
  saveQuestions(questions);
  renderList();
}

// ---------- HELPERS ----------
function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
