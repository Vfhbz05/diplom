const express = require('express');
const { 
    updateUserByAdmin, 
    deleteUserByAdmin,
    getAllUsers,
    updateOwnPassword
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

router.patch('/:id', isAuth, hasRole([ROLE.ADMIN]), async (req, res) => {
    try{
        const userId = req.params.id;
        const { na,e, password, role } = req.body;

        const updatedUser = await updateUserByAdmin(userId, { name, password, role });
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

module.exports = router;