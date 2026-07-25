const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generate }= require('../helpers/token');

async function register(name, email, password){
    if(!password) throw new Error('Пароль пуст');
    if(!email) throw new Error('Email обязателен');

    const candidate = await User.findOne({ email });
     if(candidate){
            return res.status(400).json({ message: 'Пользователь с таким Email уже зарегистрирован'});
        }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: passwordHash});
    
    const token = generate({ userId: user._id, email: user.email, role: user.role });
    return { user, token };
}

async function login(email, password){
    if(!email || !password) throw new Error('Заполните все поля');

    const user = await User.findOne({ email });

    if(!user){
        throw new Error('Пользователь не найден, неверный логин или пароль');
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if(!isPasswordMatch){
        throw new Error('Неверный логин или пароль');
    }

    const token = generate({ userId: user._id, email: user.email, role: user.role})

    return { token, user };
}



module.exports = {
    register, 
    login,

};