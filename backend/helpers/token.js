const jwt = require('jsonwebtoken');
const sing = process.env.JWT_SECRET;

module.exports = {
    generate(data){
        return jwt.sing(data, sing, { expiresIn: '30d' });
    },
    verify(token){
        try{
            return jwt.verify(token, sing);
        } catch (err) {
            return null;
        }
    }
};