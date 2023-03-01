const addNewTaskForm = document.querySelector('#add-new-task-form');
const taskNameInput = document.querySelector('#task-name-input');

addNewTaskForm.addEventListener('submit', () => {
    const newTaskName = taskNameInput.value;

    fetch('http://localhost:3000/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: newTaskName
        })
    })
});

fetch('http://localhost:3000/users')
    .then(res => res.json())
    .then(data => {
        console.log(data);
    });

fetch('http://localhost:3000/tasks')
    .then(res => res.json())
    .then(data => {
        const ul = document.createElement('ul');

        data.forEach((task) => {
            const li = document.createElement('li');
            
            const taskNameElement = document.createElement('span');
            taskNameElement.textContent = task.name;

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'DELETE';

            deleteButton.addEventListener('click', () => {
                if (confirm(`Are you sure you want to delete ${task.name} task?`)) {
                    fetch(`http://localhost:3000/tasks/${task.id}`, {
                        method: 'DELETE'
                    }).then(() => {
                        location.reload();
                    });
                }
            });

            li.appendChild(taskNameElement);
            li.appendChild(deleteButton);

            ul.appendChild(li);
        });

        document.body.appendChild(ul);
    });