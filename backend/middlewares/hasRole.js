const { verify } = require('../helpers/token');

function hasRole(allowedRoles){
    return (req, res, next) => {
        if(!allowedRoles.includes(req.user.role)){
            res.send({ error: 'Доступ запрещен' });
            return;
        }
        next();
    }
}

module.exports = hasRole;