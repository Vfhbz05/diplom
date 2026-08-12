const STATUS = require("../constants/status");

module.exports = function mapTask(task){
    const now = new Date();

    const isOvertime = task.dueDate > 0 && task.totalDuration > task.dueDate;

    const targetDate = task.assignedAt || task.createdAt;
    const millisecondsInHour = 1000 * 60 * 60;
    const hoursPassed = Math.abs(now - targetDate) / millisecondsInHour;
    const isStagnant = task.status === STATUS.TODO && hoursPassed > 24;

    return{
        id: task._id,
        title: task.title,
        description: task.description,
        status: task.status,
        dueDate: task.dueDate,
        totalDuration: task.totalDuration,
        cost: task.cost,
        project: task.project,
        assignedTodo: task.assignedTodo,
        assignedAt: task.assignedAt,
        createdBy: task.createdBy, 
        timeLogs: task.timeLogs,
        createdAt: task.createdAt,
        isOvertime,
        isStagnant 
    }
}
