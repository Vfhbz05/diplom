const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const chalk = require('chalk');
const cookieParser = require('cookie-parser');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT;
const DB_URL = process.env.MONGODB_URI;

const allowedOrigins = [
  'http://localhost:3000', 
  'http://localhost:5173', 
  'https://my-diplom-app.onrender.com' 
];


app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
        } else {
        callback(new Error('Blocked by CORS: Unauthorized origin'));
        }
    },
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