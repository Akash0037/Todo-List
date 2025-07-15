document.addEventListener('DOMContentLoaded', function() {
    const todoInput = document.getElementById('todoInput');
    const addBtn = document.getElementById('addBtn');
    const todoList = document.getElementById('todoList');
    const totalTasksSpan = document.getElementById('totalTasks');
    const completedTasksSpan = document.getElementById('completedTasks');

    let todos = JSON.parse(localStorage.getItem('todos')) || [];

    // Initialize the app
    function init() {
        renderTodoList();
        updateStats();
    }

    // Add new todo
    addBtn.addEventListener('click', addTodo);
    todoInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTodo();
        }
    });

    function addTodo() {
        const todoText = todoInput.value.trim();
        if (todoText === '') return;

        const newTodo = {
            id: Date.now(),
            text: todoText,
            completed: false
        };

        todos.push(newTodo);
        saveTodos();
        renderTodoList();
        updateStats();

        todoInput.value = '';
        todoInput.focus();
    }

    // Render todo list
    function renderTodoList() {
        if (todos.length === 0) {
            todoList.innerHTML = '<div class="empty-state">No tasks yet. Add one above!</div>';
            return;
        }

        todoList.innerHTML = '';
        todos.forEach(todo => {
            const todoItem = document.createElement('li');
            todoItem.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            todoItem.dataset.id = todo.id;

            todoItem.innerHTML = `
                <span class="todo-text">${todo.text}</span>
                <div class="todo-actions">
                    <button class="complete-btn ${todo.completed ? 'completed' : ''}">
                        ${todo.completed ? 'Undo' : 'Complete'}
                    </button>
                    <button class="delete-btn">Delete</button>
                </div>
            `;

            todoList.appendChild(todoItem);
        });

        // Add event listeners to buttons
        document.querySelectorAll('.complete-btn').forEach(btn => {
            btn.addEventListener('click', toggleComplete);
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', deleteTodo);
        });
    }

    // Toggle todo completion status
    function toggleComplete(e) {
        const todoId = parseInt(e.target.closest('.todo-item').dataset.id);
        const todoIndex = todos.findIndex(todo => todo.id === todoId);
        
        if (todoIndex !== -1) {
            todos[todoIndex].completed = !todos[todoIndex].completed;
            saveTodos();
            renderTodoList();
            updateStats();
        }
    }

    // Delete todo
    function deleteTodo(e) {
        const todoId = parseInt(e.target.closest('.todo-item').dataset.id);
        todos = todos.filter(todo => todo.id !== todoId);
        saveTodos();
        renderTodoList();
        updateStats();
    }

    // Update statistics
    function updateStats() {
        totalTasksSpan.textContent = todos.length;
        const completedCount = todos.filter(todo => todo.completed).length;
        completedTasksSpan.textContent = completedCount;
    }

    // Save todos to localStorage
    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    // Initialize the app
    init();
});