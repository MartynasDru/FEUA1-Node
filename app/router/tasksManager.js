const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

let TASKS = [
    { id: 1, name: 'Išnešti šiukšles', isComplete: false },
    { id: 2, name: 'Išsiurbti kambarį', isComplete: true }
];
let LAST_TASK_ID = TASKS[TASKS.length - 1].id;

router.get('/tasks', (req, res) => {
    res.json(TASKS);
});

router.get('/tasks/:id', (req, res) => {
    // const id = req.params.id;
    const { id } = req.params;

    const task = TASKS.find((task) => task.id.toString() === id.toString());

    if (!task) {
        res.status(404);
        res.json({ message: 'Task not found' })
    }

    res.json(task);
});

router.post('/tasks', (req, res) => {
    const newTask = req.body;
    LAST_TASK_ID++;
    const newTaskId = LAST_TASK_ID;
    TASKS.push({ id: newTaskId, name: newTask.name, isComplete: false });
    res.json(TASKS);
});

router.delete('/tasks/:id', (req, res) => {
    const id = req.params.id;
    const UPDATED_TASKS = TASKS.filter((task) => task.id.toString() !== id.toString());
    TASKS = UPDATED_TASKS;
    res.json(TASKS);
});

router.patch('/tasks/:id', (req, res) => {
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

module.exports = router;