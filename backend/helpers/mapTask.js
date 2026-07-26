const STATUS = require("../constants/status");

module.exports = function mapTask(task){
    const now = new Date();

    const isOvertime = task.estimatedTime > 0 && task.totalDuration > task.estimatedTime;

    const targetDate = task.assignedAt || task.createdAt;
    const millisecondsInHour = 1000 * 60 * 60;
    const hoursPassed = Math.abs(now - targetDate) / millisecondsInHour;
    const isStagnant = task.status === STATUS.TODO && hoursPassed > 24;

    return{
        id: task._id,
        title: task.title,
        description: task.description,
        status: task.status,
        estimatedTime: task.estimatedTime,
        totalDuration: task.totalDuration,
        cost: task.cost,
        project: task.project,
        assignedTodo: task.assignedTodo,
        assignedAt: task.assignedAt,
        timeLogs: task.timeLogs,
        createdAt: task.createdAt,
        isOvertime,
        isStagnant 
    }
}
