const addNewTaskForm = document.querySelector('#add-new-task-form');
const taskNameInput = document.querySelector('#task-name-input');
const tasksListContainer = document.querySelector('#tasks-list');
const studentsListContainer = document.querySelector('#students-list');

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

        ul.style.padding = 0;
        ul.style.listStyle = 'none';
        ul.style.display = 'flex';
        ul.style.gap = '10px';
        ul.style.flexDirection = 'column';

        data.forEach((task) => {
            const li = document.createElement('li');

            li.style.display = 'flex';
            li.style.gap = '10px';
            
            const taskNameElement = document.createElement('span');
            taskNameElement.textContent = task.name;

            taskNameElement.style.flexGrow = 1;

            if (task.isComplete) {
                taskNameElement.style.textDecoration = 'line-through';
            }

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

            const completeButton = document.createElement('button');
            completeButton.textContent = task.isComplete ? 'BRING BACK TO INCOMPLETE' : 'COMPLETE';

            completeButton.addEventListener('click', () => {
                fetch(`http://localhost:3000/tasks/${task.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        isComplete: !task.isComplete
                    })
                })
                .then(() => {
                    location.reload();
                });
            });

            li.appendChild(taskNameElement);
            li.appendChild(deleteButton);
            li.appendChild(completeButton);

            ul.appendChild(li);
        });

        tasksListContainer.appendChild(ul);
    });

fetch('http://localhost:3000/students')
    .then(res => res.json())
    .then(students => {
        const ul = document.createElement('ul');

        students.forEach((student) => {
            const li = document.createElement('li');
            li.textContent = `${student.name} ${student.surname}`;
            ul.appendChild(li);
        });

        studentsListContainer.appendChild(ul);
    });