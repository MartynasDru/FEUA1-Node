const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

const tasksManagerDbConnection = mongoose.createConnection(
    'mongodb+srv://test:test123@cluster0.mnnyqkq.mongodb.net/tasksManager?retryWrites=true&w=majority'
);

tasksManagerDbConnection.on('error', (error) => console.error(error));
tasksManagerDbConnection.once('open', () => {
    console.log('Connected to tasks manager mongoDB database!');
});

const taskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    isComplete: {
        type: Boolean,
        required: true
    }
});

const taskModel = tasksManagerDbConnection.model('task', taskSchema);

router.get('/tasks', async (req, res) => {
    const tasks = await taskModel.find();
    res.json(tasks);
});

router.get('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const task = await taskModel.find({ _id: id });
        res.json(task);
    } catch (e) {
        res.json(e.message);
    }
});

router.post('/tasks', async (req, res) => {
    const { name, isComplete } = req.body;

    try {
        const result = await taskModel.create({ name, isComplete });
        res.json(result);
    } catch (e) {
        res.json(e.message);
    }
});

router.delete('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
        const result = await taskModel.deleteOne({ _id: id });
        res.json(result);
    } catch (e) {
        res.json(e.message);
    }
});

router.patch('/tasks/:id', async (req, res) => {
    const body = req.body;
    const { id } = req.params;

    // const UPDATED_TASKS = TASKS.map((task) => {
    //     if (task.id.toString() === id.toString()) {
    //         return {
    //             ...task, // id, name, isComplete
    //             ...body // isComplete
    //         }
    //     }

    //     return task;
    // });
    // TASKS = UPDATED_TASKS;

    try {
        const result = await taskModel.updateOne({ _id: id }, body);
        res.json(result); 
    } catch (e) {
        res.json(e.message);
    }
});

module.exports = router;