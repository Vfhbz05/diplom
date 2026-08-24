const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const chalk = require('chalk');
const cookieParser = require('cookie-parser');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT;
const DB_URL = process.env.MONGODB_URI;

app.use(cors({
    origin: ['http://localhost:5173', 'https://my-diplom-backend.onrender.com'],
    credentials: true 
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.static('../frontend/build'));

mongoose.connect(DB_URL).then(()=> console.log(chalk.blue('Успешное подключение к MongoDB!')))
    .catch((err)=> console.error(chalk.red('Ошибка подключения к MongoDB', err)));

app.use('/auth', require('./routes/auth'));
app.use('/users', require('./routes/user'));
app.use('/projects', require('./routes/project'));
app.use('/tasks', require('./routes/task'));

app.get('/', (req, res) => {
    res.send('Бэкенд работает и подключен к базе данных');
});

app.listen(PORT, () => {
    console.log(chalk.green(`Сервер запущен и слушает порт ${PORT}`));
});