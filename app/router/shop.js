const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

const connection2 = mongoose.createConnection(
    'mongodb+srv://test:test123@cluster0.mnnyqkq.mongodb.net/shop?retryWrites=true&w=majority'
);

connection2.on('error', (error) => console.error(error));
connection2.once('open', () => {
    console.log('Connected to shop mongoDB database!');
});

const PRODUCTS = [
    { name: 'Gitara', price: 100 },
    { name: 'Smuikas', price: 300 }
];

router.get('/products', (req, res) => {
    res.json(PRODUCTS);
});

router.post('/products', (req, res) => {
    const newProduct = req.body;
    PRODUCTS.push(newProduct);
    res.json(PRODUCTS);
});

module.exports = router;