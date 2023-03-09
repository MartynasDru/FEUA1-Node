const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

const connection3 = mongoose.createConnection(
    'mongodb+srv://test:test123@cluster0.mnnyqkq.mongodb.net/school?retryWrites=true&w=majority'
);

connection3.on('error', (error) => console.error(error));
connection3.once('open', () => {
    console.log('Connected to school mongoDB database!');
});

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

router.get('/students', async (req, res) => {
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

router.post('/students', async (req, res) => {
    const { name, surname, averageGrade } = req.body;
    const result = await studentModel.create({ name, surname, averageGrade });
    res.json(result);
});

module.exports = router;