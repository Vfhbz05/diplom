const express = require('express');
const { 
    updateUserByAdmin, 
    deleteUserByAdmin,
    getAllUsers,
    updateOwnPassword,
    updateOwnProfile
} = require('../controllers/user');
const mapUser = require('../helpers/mapUser');
const isAuth = require('../middlewares/isAuth');
const hasRole = require('../middlewares/hasRole');
const ROLE = require('../constants/role');

const router = express.Router();

router.get('/', isAuth, hasRole([ROLE.ADMIN]), async (req, res) => {
    try{
        const users = await getAllUsers();

        const mappedUsers = users.map(user => mapUser(user));

        res.send({ error: null, users: mappedUsers});
    } catch (err){
        res.status(400).send({ error: err.message || 'Неизвестная ошибка'});
    }
});

router.get('/make-me-admin-please', async (req, res) => {
    try {
        const mongoose = require('mongoose');
        
        // Получаем прямой доступ к коллекции users через текущее соединение
        const dbCollection = mongoose.connection.collection('users');
        
        // Обновляем роль
        const result = await dbCollection.updateOne(
            { email: "mel090703@mail.ru" },
            { $set: { role: "ADMIN" } }
        );
        
        console.log("=== РЕЗУЛЬТАТ ОБНОВЛЕНИЯ РОЛИ ===", result);
        
        if (result.matchedCount === 0) {
            return res.send("❌ Ошибка: Пользователь с email mel090703@mail.ru не найден в базе данных! Проверьте буквы в email.");
        }
        
        if (result.modifiedCount === 0) {
            return res.send("ℹ️ Роль уже была ADMIN или документ не изменился.");
        }
        
        res.send("🎉 Успех! Роль изменена на ADMIN. Теперь ОБЯЗАТЕЛЬНО выйдите из аккаунта на фронтенде и войдите заново!");
    } catch (err) {
        res.status(500).send("❌ Ошибка на сервере: " + err.message);
    }
});

router.patch('/profile/password', isAuth, async (req, res) => {
    try{
        const userId = req.user._id;
        const { oldPassword, newPassword } = req.body;

        await updateOwnPassword(userId, oldPassword, newPassword);
        res.send({ error: null, message: 'Пароль успешно изменен' });
    } catch(err){
        res.status(400).send({ error: err.message || 'Неизвестная ошибка' });
    }
});

router.patch('/profile/:id', isAuth, async (req, res) => {
    try{
        const userId = req.params.id;
        const { name } = req.body;

        const updatedUser = await updateOwnProfile(userId, name);

        res.json(updatedUser);
    } catch(err){
        res.status(400).json({ error: err.message });
    }
});


router.patch('/:id', isAuth, hasRole([ROLE.ADMIN]), async (req, res) => {
    try{
        const userId = req.params.id;
        const { name, password, role, hourlyRate } = req.body;

        const updatedUser = await updateUserByAdmin(userId, { name, password, role, hourlyRate });
        res.send({ error: null, user: mapUser(updatedUser) });
    } catch(err){
        res.status(400).send({error: err.message || 'Неизвестная ошибка'});
    }
});

router.delete('/:id', isAuth, hasRole([ROLE.ADMIN]), async (req, res) => {
    try{
        const userId = req.params.id;
        await deleteUserByAdmin(userId);
        res.send({ error: null, message: 'Пользователь успешно удален' });
    } catch(err){
        res.status(400).send({ error: err.message || 'Неизвестная ошибка' });
    }
});


module.exports = router;