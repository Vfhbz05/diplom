const express = require('express');
const router = express.Router();
const User = require('../models/User');
const mapUser = require('../helpers/mapUser');
const { register, login } = require('../controllers/user');
const isAuth = require('../middlewares/isAuth');

router.post('/register', async (req, res) => {
    try{
        const { name, email, password } = req.body;
        const { token, user } = await register(name, email, password);

        res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 30 * 24 * 60 * 60 * 1000})
        .send({error: null, user: mapUser(user)});
    } catch(err){
        res.status(400).send({ error: err.message || 'Неизвестная ошибка'});
    }
});

router.post('/login', async (req, res) => {
    try{
        const { email, password } = req.body;
        const { token, user } = await login(email, password);

        res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 30 * 24 * 60 * 60 * 1000})
        .send({error: null, user: mapUser(user)});
    } catch(err){
        res.status(400).send({ error: err.message || 'Неизвестная ошибка'});
    }
});

router.post('/logout', (req, res) => {
    res.cookie('token', '', {httpOnly: true, secure: true, sameSite: 'none'})
        .send({});
});

router.get('/me', isAuth, async(req, res) => {
    try{
        const user = await User.findById(req.uaer._id).select('-password');
        if(!user){
            return res.status(401).json({ error: 'Пользователь не найден в базе данных'});
        }
        res.json({ error: null, user });
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;