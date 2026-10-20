// Tool Modal Management
function toggleTool(modalId) {
  const modal = document.getElementById(modalId);
  const overlay = document.getElementById("modal-overlay");

  if (modal.style.display === "none") {
    closeAllModals(); // Close others first
    modal.style.display = "block";
    overlay.style.display = "block";
  } else {
    modal.style.display = "none";
    overlay.style.display = "none";
  }
}

function closeAllModals() {
  const modals = document.querySelectorAll(".tool-modal");
  const overlay = document.getElementById("modal-overlay");
  modals.forEach((m) => (m.style.display = "none"));
  if (overlay) overlay.style.display = "none";
}

// === To-Do List ===
function addTodo() {
  const input = document.getElementById("todo-input");
  const list = document.getElementById("todo-list");
  const text = input.value.trim();

  if (text) {
    const li = document.createElement("li");
    li.className = "todo-item";
    li.innerHTML = `
            <span>${text}</span>
            <button onclick="this.parentElement.remove(); updateTodoCount()" style="background:none; border:none; color:red; cursor:pointer;">✕</button>
        `;
    list.appendChild(li);
    input.value = "";
    updateTodoCount();
  }
}

function updateTodoCount() {
  const count = document.getElementById("todo-list").children.length;
  const preview = document.getElementById("todo-preview");
  if (preview) preview.textContent = `Vazifalaringiz: ${count} ta`;
}

// === Calculator ===
let calcBuffer = "";
function appendCalc(val) {
  calcBuffer += val;
  document.getElementById("calc-display").value = calcBuffer;
}
function setOp(op) {
  calcBuffer += op;
  document.getElementById("calc-display").value = calcBuffer;
}
function clearCalc() {
  calcBuffer = "";
  document.getElementById("calc-display").value = "";
}
function calcResult() {
  try {
    // Basic safety check for characters
    if (/[^0-9+\-*/.() ]/.test(calcBuffer)) throw new Error("Invalid characters");

    // Using a slightly safer approach for evaluation
    const res = Function('"use strict"; return (' + calcBuffer + ')')();

    document.getElementById("calc-display").value = res;
    calcBuffer = String(res);
  } catch (e) {
    document.getElementById("calc-display").value = "Error";
    calcBuffer = "";
  }
}

// === Color Picker ===
function updateColorVal() {
  const val = document.getElementById("color-picker").value;
  document.getElementById("color-val").textContent = val;
}
function copyColor() {
  const val = document.getElementById("color-picker").value;
  navigator.clipboard.writeText(val);
  if (window.showNotification) showNotification("Nusxalandi: " + val, 'success');
}

// === Stopwatch ===
let swInterval;
let swSeconds = 0;
function startStopwatch() {
  if (swInterval) return;
  swInterval = setInterval(() => {
    swSeconds++;
    const date = new Date(0);
    date.setSeconds(swSeconds);
    const timeString = date.toISOString().substr(11, 8);
    document.getElementById("sw-display").textContent = timeString;

    const preview = document.getElementById("stopwatch-preview");
    if (preview) preview.textContent = timeString;
  }, 1000);
}
function stopStopwatch() {
  clearInterval(swInterval);
  swInterval = null;
}
function resetStopwatch() {
  stopStopwatch();
  swSeconds = 0;
  document.getElementById("sw-display").textContent = "00:00:00";
  const preview = document.getElementById("stopwatch-preview");
  if (preview) preview.textContent = "00:00:00";
}

// === QR Code ===
function generateQR() {
  const input = document.getElementById("qr-input").value;
  const output = document.getElementById("qr-output");
  if (!input) return;

  // Using simple reliable public API
  output.innerHTML = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(input)}" alt="QR Code" style="border-radius:8px;">`;
}

// === Password Generator ===
function generatePass() {
  const length = document.getElementById("pass-len").value;
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
  let retVal = "";
  for (let i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  document.getElementById("pass-output").value = retVal;
}
function copyPass() {
  const val = document.getElementById("pass-output").value;
  if (val) {
    navigator.clipboard.writeText(val);
    if (window.showNotification) showNotification("Parol nusxalandi!", 'success');
  }
}
