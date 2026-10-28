// 1. Đồng hồ thời gian thực
function updateClock() {
  const now = new Date();
  const timeString = now.toLocaleTimeString('vi-VN', { hour12: false });
  document.getElementById('clock').textContent = timeString;
}
setInterval(updateClock, 1000);
updateClock();

// 2. Quản lý công việc (To-Do List)
const todoInput = document.getElementById('todo-input');
const addTodoBtn = document.getElementById('add-todo-btn');
const todoList = document.getElementById('todo-list');

let tasks = JSON.parse(localStorage.getItem('dashboard_tasks')) || [];

function saveAndRenderTasks() {
  localStorage.setItem('dashboard_tasks', JSON.stringify(tasks));
  todoList.innerHTML = '';

  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    if (task.completed) li.classList.add('completed');

    const span = document.createElement('span');
    span.textContent = task.text;
    span.style.cursor = 'pointer';
    span.onclick = () => toggleTask(index);

    const delBtn = document.createElement('button');
    delBtn.textContent = '✕';
    delBtn.className = 'delete-btn';
    delBtn.onclick = () => deleteTask(index);

    li.appendChild(span);
    li.appendChild(delBtn);
    todoList.appendChild(li);
  });
}

function addTask() {
  const text = todoInput.value.trim();
  if (text === '') return;
  tasks.push({ text: text, completed: false });
  todoInput.value = '';
  saveAndRenderTasks();
}

function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  saveAndRenderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveAndRenderTasks();
}

addTodoBtn.addEventListener('click', addTask);
todoInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addTask();
});

// 3. Quản lý ghi chú nhanh (Notes)
const notesArea = document.getElementById('notes');
const saveNoteBtn = document.getElementById('save-note-btn');
const noteStatus = document.getElementById('note-status');

// Load ghi chú cũ
notesArea.value = localStorage.getItem('dashboard_notes') || '';

saveNoteBtn.addEventListener('click', () => {
  localStorage.setItem('dashboard_notes', notesArea.value);
  noteStatus.textContent = 'Đã lưu!';
  setTimeout(() => {
    noteStatus.textContent = '';
  }, 2000);
});

// Khởi chạy khi tải trang
saveAndRenderTasks();

let pomoTime = 25 * 60;
let pomoInterval = null;

const pomoDisplay = document.getElementById('pomo-display');

function renderPomo() {
  const m = String(Math.floor(pomoTime / 60)).padStart(2, '0');
  const s = String(pomoTime % 60).padStart(2, '0');
  pomoDisplay.textContent = `${m}:${s}`;
}

document.getElementById('pomo-start').onclick = () => {
  if (pomoInterval) return;
  pomoInterval = setInterval(() => {
    if (pomoTime > 0) {
      pomoTime--;
      renderPomo();
    } else {
      clearInterval(pomoInterval);
      pomoInterval = null;
      alert("Hết giờ tập trung! Hãy nghỉ ngơi 5 phút.");
    }
  }, 1000);
};

document.getElementById('pomo-pause').onclick = () => {
  clearInterval(pomoInterval);
  pomoInterval = null;
};

document.getElementById('pomo-reset').onclick = () => {
  clearInterval(pomoInterval);
  pomoInterval = null;
  pomoTime = 25 * 60;
  renderPomo();
};

const expName = document.getElementById('exp-name');
const expAmount = document.getElementById('exp-amount');
const expList = document.getElementById('exp-list');
const expTotal = document.getElementById('exp-total');

let expenses = JSON.parse(localStorage.getItem('dashboard_expenses')) || [];

function saveAndRenderExpenses() {
  localStorage.setItem('dashboard_expenses', JSON.stringify(expenses));
  expList.innerHTML = '';
  let total = 0;

  expenses.forEach((item, index) => {
    total += item.amount;
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${item.name}: <strong>${item.amount.toLocaleString('vi-VN')} đ</strong></span>
      <button class="delete-btn" onclick="deleteExpense(${index})">✕</button>
    `;
    expList.appendChild(li);
  });

  expTotal.textContent = total.toLocaleString('vi-VN');
}

document.getElementById('exp-add').onclick = () => {
  const name = expName.value.trim();
  const amount = parseFloat(expAmount.value);
  if (!name || isNaN(amount) || amount <= 0) return;

  expenses.push({ name, amount });
  expName.value = '';
  expAmount.value = '';
  saveAndRenderExpenses();
};

window.deleteExpense = (index) => {
  expenses.splice(index, 1);
  saveAndRenderExpenses();
};

saveAndRenderExpenses();

const bmName = document.getElementById('bm-name');
const bmUrl = document.getElementById('bm-url');
const bmList = document.getElementById('bm-list');

let bookmarks = JSON.parse(localStorage.getItem('dashboard_bookmarks')) || [
  { name: 'Google', url: 'https://google.com' }
];

function saveAndRenderBookmarks() {
  localStorage.setItem('dashboard_bookmarks', JSON.stringify(bookmarks));
  bmList.innerHTML = '';

  bookmarks.forEach((bm, index) => {
    const item = document.createElement('div');
    item.style.cssText = 'background: #0f172a; border: 1px solid var(--border-color); padding: 6px 12px; border-radius: 6px; display: flex; align-items: center; gap: 8px;';
    item.innerHTML = `
      <a href="${bm.url}" target="_blank" style="color: var(--accent); text-decoration: none;">${bm.name}</a>
      <span style="color: var(--danger); cursor: pointer;" onclick="deleteBookmark(${index})">✕</span>
    `;
    bmList.appendChild(item);
  });
}

document.getElementById('bm-add').onclick = () => {
  const name = bmName.value.trim();
  let url = bmUrl.value.trim();
  if (!name || !url) return;
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }

  bookmarks.push({ name, url });
  bmName.value = '';
  bmUrl.value = '';
  saveAndRenderBookmarks();
};

window.deleteBookmark = (index) => {
  bookmarks.splice(index, 1);
  saveAndRenderBookmarks();
};

saveAndRenderBookmarks();