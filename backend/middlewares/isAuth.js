const User = require('../models/User');
const { verify } = require('../helpers/token');

module.exports = async function (req, res, next){
    try{
        if(!req.cookies || !req.cookies.token){
            return res.status(401).send({ error: 'Вы не авторизованы'}); 
        }

        const tokenData = verify(req.cookies.token);

        if(!tokenData){
            return res.status(401).send({ error: 'Неверный или просроченный токен' });
        }

        const user = await User.findOne({ _id: tokenData.userId });

        req.user = user;

        next();
    } catch (err){
        res.status(500).send({ error: 'Внутренняя ошибка проверки авторизации' });
    }
};