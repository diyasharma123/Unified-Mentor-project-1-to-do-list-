
const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const filterButtons = document.querySelectorAll('.filter-btn');
const toast = document.getElementById('toast');

document.addEventListener('DOMContentLoaded', loadTasks);


addBtn.addEventListener('click', addTask);
filterButtons.forEach(btn => {
    btn.addEventListener('click', filterTasks);
});


function addTask() {
    const text = taskInput.value.trim();
    if (!text) {
        showToast('⚠️ Please enter a task!');
        return;
    }

    const task = {
        id: Date.now(),
        text,
        completed: false
    };

    createTaskElement(task);
    saveTask(task);

    taskInput.value = '';
    showToast('✅ Task added!');
}

function createTaskElement(task) {
    const li = document.createElement('li');
    li.className = 'task';
    if (task.completed) li.classList.add('completed');
    li.setAttribute('data-id', task.id);

    li.innerHTML = `
        <input type="checkbox" ${task.completed ? 'checked' : ''}>
        <span class="task-text">${task.text}</span>
        <div class="task-actions">
            <button class="edit-btn">✏️</button>
            <button class="delete-btn">🗑️</button>
        </div>
    `;

    const checkbox = li.querySelector('input[type="checkbox"]');
    checkbox.addEventListener('change', () => toggleComplete(task.id));

    const editBtn = li.querySelector('.edit-btn');
    editBtn.addEventListener('click', () => editTask(task.id));

    const deleteBtn = li.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => deleteTask(task.id, li));

    taskList.appendChild(li);
}

function toggleComplete(id) {
    let tasks = getTasks();
    tasks = tasks.map(t => t.id == id ? {...t, completed: !t.completed} : t);
    saveTasks(tasks);
    refreshTasks();
}

function editTask(id) {
    let tasks = getTasks();
    const task = tasks.find(t => t.id == id);
    const newText = prompt('Edit your task:', task.text);
    if (newText !== null && newText.trim() !== '') {
        task.text = newText.trim();
        saveTasks(tasks);
        refreshTasks();
        showToast('✏️ Task updated!');
    }
}

function deleteTask(id, element) {
    element.classList.add('fade-out');
    setTimeout(() => {
        let tasks = getTasks();
        tasks = tasks.filter(t => t.id != id);
        saveTasks(tasks);
        refreshTasks();
        showToast('🗑️ Task deleted!');
    }, 400);
}

function saveTask(task) {
    const tasks = getTasks();
    tasks.push(task);
    saveTasks(tasks);
}

function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function getTasks() {
    return JSON.parse(localStorage.getItem('tasks')) || [];
}

function loadTasks() {
    const tasks = getTasks();
    tasks.forEach(createTaskElement);
}

function refreshTasks() {
    taskList.innerHTML = '';
    loadTasks();
}

function filterTasks(e) {
    const filter = e.target.dataset.filter;
    const tasks = document.querySelectorAll('.task');

    tasks.forEach(task => {
        task.style.display = 'flex';
        if (filter === 'completed' && !task.classList.contains('completed')) {
            task.style.display = 'none';
        }
        if (filter === 'active' && task.classList.contains('completed')) {
            task.style.display = 'none';
        }
    });
}


function showToast(message) {
    toast.textContent = message;
    toast.style.opacity = '1';
    setTimeout(() => {
        toast.style.opacity = '0';
    }, 2000);
}

