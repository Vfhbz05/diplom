const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generate }= require('../helpers/token');

async function register(name, email, password){
    if(!password) throw new Error('Пароль пуст');
    if(!email) throw new Error('Email обязателен');

    const candidate = await User.findOne({ email });
     if(candidate){
        throw new Error('Пользователь с таким Email уже зарегистрирован');
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

async function getAllUsers(){
    return await User.find({}, '-password').sort({ createdAt: -1})
}

async function updateUserByAdmin(userId, newData){
    const { name, password, role, hourlyRate } = newData;
    const updateFields = {};

    if(name){ updateFields.name = name; }
    if(role){ updateFields.role = role; }

    if(hourlyRate !== undefined) {
        if(hourlyRate < 0) {
            throw new Error('Почасовая ставка не может быть отрицательной');
        }
        updateFields.hourlyRate = hourlyRate;
    }

    if(password){
        if(password.length < 6){
            throw new Error('Пароль должен быть не менее 6 символов');
        }
        updateFields.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateFields, {new: true, runValidators: true});
    if(!updatedUser){
        throw new Error('Пользователь не найден');
    }

    return updatedUser;
}

async function deleteUserByAdmin(userId){
    const deletedUser = await User.findByIdAndDelete(userId);
    if(!deletedUser) throw new Error('Пользователь не найден');
    return true;
}

async function updateOwnPassword(userId, oldPassword, newPassword){
    if(!oldPassword || !newPassword){
        throw new Error('Необходимо указать старый и новый пароли');
    }

    if(newPassword.length < 6){
        throw new Error('Новый пароль должен быть не менее 6 символов');
    }

    const user = await User.findById(userId);
    if(!user){
        throw new Error('Пользователь не найден');
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if(!isMatch){
        throw new Error('Старый пароль введен неверно');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return true;
}


module.exports = {
    register, 
    login,
    updateUserByAdmin, 
    deleteUserByAdmin,
    getAllUsers,
    updateOwnPassword
};