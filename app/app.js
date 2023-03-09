require('dotenv').config();
const express = require('express');
const cors = require('cors');

const libraryRouter = require('./router/library');
const schoolRouter = require('./router/school');
const shopRouter = require('./router/shop');
const tasksManagerRouter = require('./router/tasksManager');

const app = express();

app.use(cors());
app.use(express.json());
app.use(libraryRouter);
app.use(schoolRouter);
app.use(shopRouter);
app.use(tasksManagerRouter);

app.get('*', (req, res) => {
    res.json({
        message: 'Šis endpoint neegzistuoja'
    });
});

app.listen(process.env.PORT, () => {
    console.log(`Server started on PORT ${process.env.PORT}`);
});