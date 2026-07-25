const mongoose = require('mongoose');
const ROLE = require('../constants/role');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Имя пользователя обязательно'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email обязателен'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Пароль обязателен'],
        minlength: [6, 'Пароль должен быть не менее 6 символов']
    },
    role: {
        type: String,
        default: ROLE.USER
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);