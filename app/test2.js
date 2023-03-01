const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const PRODUCTS = [
    { name: 'Gitara', price: 100 },
    { name: 'Smuikas', price: 300 }
];

const USERS = [
    { id: 1, name: 'Petras', email: 'petras123@gmail.com' },
    { id: 2, name: 'Antanas', email: 'antanas@gmail.com' }
];

let TASKS = [
    { id: 1, name: 'Išnešti šiukšles', isComplete: false },
    { id: 2, name: 'Išsiurbti kambarį', isComplete: true }
];
let LAST_TASK_ID = TASKS[TASKS.length - 1].id;

app.get('/products', (req, res) => {
    res.json(PRODUCTS);
});

app.post('/products', (req, res) => {
    const newProduct = req.body;
    PRODUCTS.push(newProduct);
    res.json(PRODUCTS);
});

app.get('/users', (req, res) => {
    res.json(USERS);
});

app.get('/users/:name', (req, res) => {
    res.json(
        USERS.find((user) => user.name.toLowerCase() === req.params.name.toLowerCase())
    );
});

app.get('/tasks', (req, res) => {
    res.json(TASKS);
});

app.get('/tasks/:id', (req, res) => {
    // const id = req.params.id;
    const { id } = req.params;

    const task = TASKS.find((task) => task.id.toString() === id.toString());

    if (!task) {
        res.status(404);
        res.json({ message: 'Task not found' })
    }

    res.json(task);
});

app.post('/tasks', (req, res) => {
    const newTask = req.body;
    LAST_TASK_ID++;
    const newTaskId = LAST_TASK_ID;
    TASKS.push({ id: newTaskId, name: newTask.name, isComplete: false });
    res.json(TASKS);
});

app.delete('/tasks/:id', (req, res) => {
    const id = req.params.id;
    const UPDATED_TASKS = TASKS.filter((task) => task.id.toString() !== id.toString());
    TASKS = UPDATED_TASKS;
    res.json(TASKS);
});

app.patch('/tasks/:id', (req, res) => {
    const body = req.body;
    const id = req.params.id;
    const UPDATED_TASKS = TASKS.map((task) => {
        if (task.id.toString() === id.toString()) {
            return {
                ...task, // id, name, isComplete
                ...body // isComplete
            }
        }

        return task;
    });
    TASKS = UPDATED_TASKS;
    res.json(TASKS); 
});

app.get('*', (req, res) => {
    res.json({
        message: 'Šis endpoint neegzistuoja'
    });
});

app.listen(3000, () => {
    console.log('Server started');
});