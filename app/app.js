require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const libraryRouter = require('./router/library');
const { SORT_DIRECTION } = require('./utils/constants');

const app = express();

app.use(cors());
app.use(express.json());
app.use(libraryRouter);

const connection2 = mongoose.createConnection(
    'mongodb+srv://test:test123@cluster0.mnnyqkq.mongodb.net/shop?retryWrites=true&w=majority'
);

const connection3 = mongoose.createConnection(
    'mongodb+srv://test:test123@cluster0.mnnyqkq.mongodb.net/school?retryWrites=true&w=majority'
);

// mongoose.connect(
//     'mongodb+srv://test:test123@cluster0.mnnyqkq.mongodb.net/library?retryWrites=true&w=majority'
// );

// const db = mongoose.connection;

connection2.on('error', (error) => console.error(error));
connection2.once('open', () => {
    console.log('Connected to shop mongoDB database!');
});

connection3.on('error', (error) => console.error(error));
connection3.once('open', () => {
    console.log('Connected to school mongoDB database!');
});

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

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true,
    },
    averageGrade: {
        type: Number,
        required: false
    }
});

const studentModel = connection3.model('student', studentSchema);

app.get('/students', async (req, res) => {
    const { name, surname, averageGrade, sortDirection = SORT_DIRECTION.asc, sortBy } = req.query; 
    const searchFilter = {};
    const sortFilter = {};

    if (Object.values(SORT_DIRECTION).includes(sortDirection) && sortBy) {
        sortFilter[sortBy] = sortDirection === SORT_DIRECTION.asc ? 1 : -1;
    }
    
    if (name) {
        searchFilter.name = name;
    }

    if (surname) {
        searchFilter.surname = surname;
    }

    if (averageGrade) {
        searchFilter.averageGrade = averageGrade;
    }

    const students = await studentModel.find(searchFilter).sort(sortFilter);
    res.json(students);
});

app.post('/students', async (req, res) => {
    const { name, surname, averageGrade } = req.body;
    const result = await studentModel.create({ name, surname, averageGrade });
    res.json(result);
});

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

app.listen(process.env.PORT, () => {
    console.log(`Server started on PORT ${process.env.PORT}`);
});