const addButton = document.getElementById('new-task-btn');
const taskList = document.getElementById('task-list');

document.addEventListener('DOMContentLoaded', RenderTasks);
window.addEventListener('storage', (event) => {
  if (event.key === 'app:todo:tasks') {
    RenderTasks();
  }
});

function RenderTasks() {
  taskList.querySelectorAll('.row').values().filter((elem) => elem.dataset.id ).forEach(row => row.remove());

  const res = localStorage.getItem('app:todo:tasks');
  const tasks = JSON.parse(res);

  if (!tasks || !Array.isArray(tasks)) {
    localStorage.setItem('app:todo:tasks', JSON.stringify([]));
    return;
  };

  tasks.forEach(task => {
    const newTast = createNewTask(task);
  });
};

addButton.addEventListener('click', () => { createNewTask() });

function createNewTask(task) {
  const newTask = document.createElement('div');
  newTask.classList.add('row');
  newTask.innerHTML = `
    <div class="col d-flex align-items-center gap-2">
      <input type="text" class="form-control" placeholder="Digite aqui a tarefa..." aria-label="Digite aqui a tarefa..." aria-describedby="button-remove">
      <div class="form-check form-switch fs-3">
        <input class="form-check-input" type="checkbox" role="switch" id="switchCheckDefault">
      </div>
      <button class="btn btn-danger" type="button">
        <i class="bi bi-trash-fill"></i>
      </button>
    </div>
  `;

  if (task) {
    newTask.dataset.id = task.id;

    const inputField = newTask.querySelector('input[type="text"]');
    inputField.value = task.text;
    inputField.disabled = task.completed;

    newTask.querySelector('input[type="checkbox"]').checked = task.completed;
  }

  taskList.appendChild(newTask);

  newTask.querySelector('input[type="checkbox"]').addEventListener('change', async (event) => {
    try {
      const res = localStorage.getItem('app:todo:tasks');
      const tasks = JSON.parse(res);

      if (!tasks || !Array.isArray(tasks)) {
        throw new Error('Invalid tasks data in localStorage');
      } else {
        const taskIndex = tasks.findIndex(t => t.id === newTask.dataset.id);

        if (taskIndex === -1) {
          return;
        }

        tasks[taskIndex].completed = event.target.checked;
        localStorage.setItem('app:todo:tasks', JSON.stringify(tasks));

        event.target.closest('.row').querySelector('input[type="text"]').disabled = event.target.checked;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  });

  newTask.querySelector('button').addEventListener('click', (event) => {
    try {
      const res = localStorage.getItem('app:todo:tasks');
      const tasks = JSON.parse(res);

      if (!tasks || !Array.isArray(tasks)) {
        throw new Error('Invalid tasks data in localStorage');
      } else {
        const updatedTasks = tasks.filter(t => t.id !== newTask.dataset.id);
        localStorage.setItem('app:todo:tasks', JSON.stringify(updatedTasks));
        newTask.remove();
      }
    } catch (error) {
      console.error(error);
    }
  });

  const inputField = newTask.querySelector('input[type="text"]');
  inputField.focus();

  inputField.addEventListener('keypress', (event) => {
    if (event.key !== 'Enter' || !event.target.value.trim()) {
      return;
    };

    try {
      const res = localStorage.getItem('app:todo:tasks');
      const tasks = JSON.parse(res);

      if (!tasks || !Array.isArray(tasks)) {
        throw new Error('Invalid tasks data in localStorage');
      }

      if (!newTask.dataset.id) {
        newTask.dataset.id = Date.now().toString();
      }

      if (tasks.findIndex(t => t.id === newTask.dataset.id) !== -1) {
        const taskIndex = tasks.findIndex(t => t.id === newTask.dataset.id);
        tasks[taskIndex].text = event.target.value.trim();
        tasks[taskIndex].completed = newTask.querySelector('input[type="checkbox"]').checked;
      } else {
        tasks.push(
          {
            id: newTask.dataset.id,
            text: event.target.value.trim(),
            completed: false
          }
        );
      }

      localStorage.setItem('app:todo:tasks', JSON.stringify(tasks));

      createNewTask();
    } catch (error) {
      console.error(error);
      return false;
    }
  });

  return newTask;
};
