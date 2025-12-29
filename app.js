// app.js
class Task {
  constructor(title, dueDate, completed = false) {
    this.id = Date.now();
    this.title = title;
    this.dueDate = dueDate;
    this.completed = completed;
  }
}

class TaskManager {
  constructor() {
    this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  }

  saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  addTask(task) {
    this.tasks.push(task);
    this.saveTasks();
  }

  deleteTask(id) {
    this.tasks = this.tasks.filter(task => task.id !== id);
    this.saveTasks();
  }

  toggleComplete(id) {
    this.tasks = this.tasks.map(task => 
      task.id === id ? {...task, completed: !task.completed} : task
    );
    this.saveTasks();
  }

  filterTasks(search = '', sort = 'newest') {
    let filtered = this.tasks.filter(task => 
      task.title.toLowerCase().includes(search.toLowerCase())
    );

    switch(sort) {
      case 'newest': filtered.sort((a,b) => b.id - a.id); break;
      case 'oldest': filtered.sort((a,b) => a.id - b.id); break;
      case 'completed': filtered = filtered.filter(t => t.completed); break;
      case 'pending': filtered = filtered.filter(t => !t.completed); break;
    }

    return filtered;
  }
}

const taskManager = new TaskManager();

// DOM Elements
const taskList = document.getElementById('task-list');
const addBtn = document.getElementById('add-task-btn');
const titleInput = document.getElementById('task-title');
const dateInput = document.getElementById('task-date');
const searchInput = document.getElementById('search');
const sortSelect = document.getElementById('sort');

function renderTasks() {
  const search = searchInput.value;
  const sort = sortSelect.value;
  const tasks = taskManager.filterTasks(search, sort);

  taskList.innerHTML = '';
  tasks.forEach(task => {
    const li = document.createElement('li');
    li.className = 'task-item' + (task.completed ? ' completed' : '');
    li.innerHTML = `
      <span>${task.title} (${task.dueDate})</span>
      <div class="task-actions">
        <button class="complete-btn">✔</button>
        <button class="delete-btn">✖</button>
      </div>
    `;

    li.querySelector('.delete-btn').addEventListener('click', () => {
      taskManager.deleteTask(task.id);
      renderTasks();
    });

    li.querySelector('.complete-btn').addEventListener('click', () => {
      taskManager.toggleComplete(task.id);
      renderTasks();
    });

    taskList.appendChild(li);
  });
}

// Event Listeners
addBtn.addEventListener('click', () => {
  const title = titleInput.value.trim();
  const date = dateInput.value;
  if(!title || !date) return alert('Enter task title and date!');
  
  const task = new Task(title, date);
  taskManager.addTask(task);
  titleInput.value = '';
  dateInput.value = '';
  renderTasks();
});

searchInput.addEventListener('input', renderTasks);
sortSelect.addEventListener('change', renderTasks);

// Initial Render
renderTasks();
