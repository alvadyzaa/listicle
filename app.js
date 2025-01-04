const taskInput = document.getElementById('taskInput');
const noteInput = document.getElementById('noteInput');
const addButton = document.getElementById('addButton');
const taskList = document.getElementById('taskList');
const themeToggle = document.getElementById('themeToggle');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let isDark = localStorage.getItem('theme') === 'dark';

function addTask() {
    const taskTitle = taskInput.value.trim();
    const taskNote = noteInput.value.trim();
    
    if (taskTitle) {
        const task = {
            id: Date.now(),
            title: taskTitle,
            note: taskNote,
            completed: false,
            createdAt: new Date().toLocaleString('id-ID', {
                dateStyle: 'medium',
                timeStyle: 'short'
            })
        };
        
        tasks.push(task);
        saveTasks();
        renderTasks();
        taskInput.value = '';
        noteInput.value = '';
    }
}

function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.className = 'task-item';
        
        taskItem.innerHTML = `
            <div class="task-content">
                <div class="task-title ${task.completed ? 'completed' : ''}">${task.title}</div>
                ${task.note ? `<div class="task-note">${task.note}</div>` : ''}
                <div class="task-time">Dibuat: ${task.createdAt}</div>
            </div>
            <div class="task-actions">
                <button onclick="toggleTask(${task.id})">${task.completed ? 'Undo' : '✓'}</button>
                <button class="delete-btn" onclick="deleteTask(${task.id})">×</button>
            </div>
        `;
        
        taskList.appendChild(taskItem);
    });
    updateTaskCount();
}

function toggleTask(id) {
    tasks = tasks.map(task => 
        task.id === id ? {...task, completed: !task.completed} : task
    );
    saveTasks();
    renderTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

addButton.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        addTask();
    }
});

// Tambahkan event listener untuk note input
noteInput.addEventListener('keydown', (e) => {
    // Submit hanya jika Enter ditekan tanpa Shift
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        addTask();
    }
});

// Initial render
renderTasks();

// Tambahkan fungsi untuk menampilkan jam
function updateClock() {
    const now = new Date();
    const clock = document.getElementById('clock');
    const dateDisplay = document.getElementById('date');
    
    // Format waktu
    const time = now.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    
    // Format tanggal
    const date = now.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    clock.textContent = time;
    dateDisplay.textContent = date;
}

// Update jam setiap detik
setInterval(updateClock, 1000);
// Panggil sekali untuk menghindari delay 1 detik pertama
updateClock();

// Fungsi untuk mengubah tema
function toggleTheme() {
    isDark = !isDark;
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    themeToggle.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Set tema awal
document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
themeToggle.textContent = isDark ? '☀️' : '🌙';

// Event listener untuk tombol tema
themeToggle.addEventListener('click', toggleTheme);

function updateTaskCount() {
    const taskCount = document.getElementById('taskCount');
    taskCount.textContent = tasks.length;
}

// Add initial counter update
updateTaskCount();
