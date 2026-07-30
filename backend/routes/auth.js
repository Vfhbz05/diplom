const express = require('express');
const router = express.Router();
const User = require('../models/User');
const mapUser = require('../helpers/mapUser');
const { register, login } = require('../controllers/user');

router.post('/register', async (req, res) => {
    try{
        const { name, email, password } = req.body;
        const { token, user } = await register(name, email, password);

        res.cookie('token', token, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000})
        .send({error: null, user: mapUser(user)});
    } catch(err){
        res.status(400).send({ error: err.message || 'Неизвестная ошибка'});
    }
});

router.post('/login', async (req, res) => {
    try{
        const { email, password } = req.body;
        const { token, user } = await login(email, password);

        res.cookie('token', token, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000})
        .send({error: null, user: mapUser(user)});
    } catch(err){
        res.status(400).send({ error: err.message || 'Неизвестная ошибка'});
    }
});

router.post('/logout', (req, res) => {
    res.cookie('token', '', {httpOnly: true})
        .send({});
})

module.exports = router;