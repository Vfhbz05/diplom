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
    origin: 'http://localhost:5173',
    credentials: true 
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.static('../frontend/build'));

mongoose.connect(DB_URL).then(()=> console.log(chalk.blue('Успешное подключение к MongoDB!')))
    .catch((err)=> console.error(chalk.red('Ошибка подключения к MongoDB', err)));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/user'));
app.use('/api/projects', require('./routes/project'));
app.use('/api/tasks', require('./routes/task'));

app.get('/', (req, res) => {
    res.send('Бэкенд работает и подключен к базе данных');
});

app.listen(PORT, () => {
    console.log(chalk.green(`Сервер запущен и слушает порт ${PORT}`));
});