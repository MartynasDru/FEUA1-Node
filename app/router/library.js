const express = require('express');
const mongoose = require('mongoose');
const { SORT_DIRECTION } = require('../utils/constants');

const router = express.Router();

const connection = mongoose.createConnection(
    'mongodb+srv://test:test123@cluster0.mnnyqkq.mongodb.net/library?retryWrites=true&w=majority'
);

connection.on('error', (error) => console.error(error));
connection.once('open', () => {
    console.log('Connected to library mongoDB database!');
});

const bookSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    pageCount: {
        type: Number,
        required: true
    }
});

const bookModel = connection.model('book', bookSchema);

router.get('/books', async (req, res) => {
    const { name, author, pageCount, sortDirection = SORT_DIRECTION.asc, sortBy } = req.query;
    const searchFilter = {};
    const sortFilter = {};

    if (Object.values(SORT_DIRECTION).includes(sortDirection) && sortBy) {
        sortFilter[sortBy] = sortDirection === SORT_DIRECTION.asc ? 1 : -1;
    }

    if (name) {
        searchFilter.name = name;
    }

    if (author) {
        searchFilter.author = author;
    }

    if (pageCount) {
        searchFilter.pageCount = pageCount;
    }

    // const books = await bookModel.find(searchFilter).sort(sortFilter);
    const books = await bookModel.aggregate([
        {
            $lookup: {
                from: 'users',
                foreignField: '_id',
                localField: 'userId',
                as: 'user'
            }
        },
        {
            $unwind: {
                path: "$user",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $unset: "userId"
        }
    ]);
    res.json(books);
});

router.get('/books/:id', async (req, res) => {
    const { id } = req.params;

    // 1 variantas - const book = await bookModel.find({ _id: id });

    // 2 variantas
    // const objectId = mongoose.Types.ObjectId(id);
    // const book = await bookModel.find(objectId);

    // 3 variantas
    try {
        const book = await bookModel.findById(id);
        res.json(book);
    } catch (error) {
        res.json({
            message: error.message
        })
    }
});

router.post('/books', async (req, res) => {
    const body = req.body;
    const result = await bookModel.create(
        { 
            name: body.name, 
            author: body.author, 
            pageCount: body.pageCount 
        }
    );
    res.json(result);
});

router.put('/books/:id', async (req, res) => {
    const id = req.params.id;
    const body = req.body;

    if (body.name && body.author && body.pageCount) {
        const result = await bookModel.updateOne(
            { _id: id }, 
            { name: body.name, author: body.author, pageCount: body.pageCount }
        );
        res.json(result);
    }

    res.json({ message: 'Incorrect book information' })
});

router.patch('/books/:id', async (req, res) => {
    const id = req.params.id;
    const body = req.body;
    const result = await bookModel.updateOne(
        { _id: id }, 
        { name: body.name, author: body.author, pageCount: body.pageCount }
    );
    res.json(result);
});

module.exports = router;