const Project = require('../models/Project');
const ROLE = require('../constants/role');

module.exports = async (req, res, next) => {
    try{
        const projectId = req.params.id;
        const currentUserId = req.user._id;
        const currentUserRole = req.user.role;

        const project = await Project.findById(projectId);
        if(!project){
            return res.status(404).send({ error: 'Проект не найден'});
        }

        const isAdmin = currentUserRole === ROLE.ADMIN;
        const isOwner = project.owner.toString() === currentUserId.toString();

        if (!isAdmin && !isOwner) {
            return res.status(403).send({ error: 'Доступ запрещен: вы должны быть владельцем проекта или администратором' });
        }

        req.project = project;
        next();
    } catch(err){
        res.status(500).send({ error: 'Ошибка при проверке прав доступа к проекту'})
    }
}