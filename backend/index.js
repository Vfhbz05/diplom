const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const chalk = require('chalk');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT;
const DB_URL = process.env.MONGODB_URI;

app.use(cors());
app.use(express.json());

mongoose.connect(DB_URL).then(()=> console.log(chalk.blue('Успешное подключение к MongoDB!')))
    .catch((err)=> console.error(chalk.red('Ошибка подключения к MongoDB', err)));

app.get('/', (req, res) => {
    res.send('Бэкенд работает и подключен к базе данных');
});

app.listen(PORT, () => {
    console.log(chalk.green(`Сервер запущен и слушает порт ${PORT}`));
});