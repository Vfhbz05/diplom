import { useDispatch, useSelector } from "react-redux"
import { selectCurrentUser, selectProjectById } from "../../selectors";
import { ROLE } from "../../constants/role";
import { changeTaskStatus, deleteTaskAction } from "../../actions";
import { STATUS } from "../../constants/status";
import PropTypes from "prop-types";
import styled from "styled-components";
import { formatDeadline } from "../../utils/formatDeadline";

export const TaskCard = ({task, onOpenModal, isProjectOwner = false}) => {
    const dispatch = useDispatch();
    const targetTaskId = task._id || task.id;

    const currentUser = useSelector(selectCurrentUser);
    
    const currentUserId = String(currentUser?._id || currentUser?.id || "").trim().replace(/[^\w]/g, "");
    const currentProjectId = task.project?._id || task.project;
    
    let rawExecutorId = "";
    if (task.assignedTodo) {
      if (typeof task.assignedTodo === "object") {
        rawExecutorId = task.assignedTodo._id || task.assignedTodo.id || "";
      } else if (typeof task.assignedTodo === "string") {
        rawExecutorId = task.assignedTodo;
      }
    }
    const executorId = String(rawExecutorId).trim().replace(/[^\w]/g, "");

    const isExecutor = Boolean(currentUserId && executorId && currentUserId === executorId);
    const isManagement = [ROLE.ADMIN].includes(currentUser?.role) || isProjectOwner;

    const getDeadlineStatus = (dateString) => {
      if (task.status === STATUS.DONE) return "normal";
      if (!dateString) return "normal";

      const taskDate = new Date(dateString);
      taskDate.setHours(0, 0, 0, 0);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      if (taskDate <= today) return "overdue";
      
      if (taskDate.getTime() === tomorrow.getTime()) return "tomorrow";

      return "normal";
    };

    const deadlineStatus = getDeadlineStatus(task.dueDate);

    const handleDeleteClick = (e) => {
        e.stopPropagation(); 
        if (window.confirm("Внимание! Задача будет удалена безвозвратно. Продолжить?")) {
        dispatch(deleteTaskAction(targetTaskId));
        }
    };

    let taskHandlerName = "Не назначен";
    if (task.assignedTodo) {
      if (typeof task.assignedTodo === "object") {
        taskHandlerName = task.assignedTodo.name || task.assignedTodo.email || "Не назначен";
      } else if (typeof task.assignedTodo === "string") {
        taskHandlerName = String(task.assignedTodo) === String(currentUser?._id) 
          ? `${currentUser.name || currentUser.email} (Вы)` 
          : "Сотрудник назначен";
      }
    }
    const cardClass = deadlineStatus === "overdue" 
      ? "deadline-overdue" 
      : deadlineStatus === "tomorrow" 
        ? "deadline-tomorrow" 
        : "";
    return(
        <CardWrapper className={cardClass} onClick={onOpenModal}>
          <div className="task-card-top-row">
            <p className="task-title-heading">{task.title}</p>
            {isManagement && (
              <button className="delete-task-btn" onClick={handleDeleteClick}> × </button>
            )}
          </div>
          
          <div className="task-deadline-row">
            {task.dueDate ? (
              <span className="compact-tag date-tag"> 📅 {formatDeadline(task.dueDate)} </span>
            ) : (
              <span className="compact-tag no-date-tag">📅 Без срока</span>
            )}
          </div>
          
          <div className="task-executor-row">
            <span className="handler-name-badge" title="Ответственный"> 👤 {taskHandlerName} </span>
          </div>
          
          <div className="task-card-actions-area" onClick={(e) => e.stopPropagation()}>
            {task.status === STATUS.TODO && isExecutor && (
              <button className="move-state-btn" onClick={(e) => {e.stopPropagation(); dispatch(changeTaskStatus(targetTaskId, STATUS.IN_PROGRESS, currentProjectId))} } >
                В работу →
              </button>
            )}
            
            {(task.status === STATUS.IN_PROGRESS || task.status === STATUS.IN_REVISION) && isExecutor && (
              <button className="move-state-btn" onClick={(e) => { e.stopPropagation(); dispatch(changeTaskStatus(targetTaskId, STATUS.REVIEW, currentProjectId))} } >
                На проверку →
              </button>
            )}
            
            {task.status === STATUS.REVIEW && isManagement && (
              <div className="management-control-group">
                <button className="reject-state-btn" onClick={(e) => { e.stopPropagation(); dispatch(changeTaskStatus(targetTaskId, STATUS.IN_REVISION, currentProjectId))}} >
                  ↩ Доработать
                </button>
                <button className="accept-state-btn" onClick={(e) => { e.stopPropagation(); dispatch(changeTaskStatus(targetTaskId, STATUS.DONE, currentProjectId))}} >
                  Принять ✓
                </button>
              </div>
            )}
          </div>
        </CardWrapper>
	);
};

TaskCard.propTypes = {
  task: PropTypes.shape({
    _id: PropTypes.string,
    id: PropTypes.string,
    title: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    project: PropTypes.string.isRequired,
    estimatedTime: PropTypes.number,
    loggedTime: PropTypes.number,
    assignedTodo: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
  }).isRequired,
  onOpenModal: PropTypes.func.isRequired,
  isProjectOwner: PropTypes.bool
};

const CardWrapper = styled.div`
  background: #ffffff;
	border-radius: 10px;
	padding: 12px;
	border: 1px solid #e2e8f0;
	box-shadow: 0 2px 4px rgba(15, 23, 42, 0.01);
	display: flex;
	flex-direction: column;
	gap: 8px;
	cursor: pointer;
	transition: all 0.15s ease-in-out;
	box-sizing: border-box;

	&:hover {
		transform: translateY(-1px);
		box-shadow: 0 6px 10px rgba(15, 23, 42, 0.05);
		border-color: #cbd5e1;
	}

	&.deadline-overdue {
		background: #fef2f2;
		border-color: #fca5a5;
		box-shadow: 0 2px 6px rgba(239, 68, 68, 0.03);
		.date-tag {
			background: #dc2626;
			color: #ffffff;
			border-color: #dc2626;
		}
	}

	&.deadline-tomorrow {
		background: #fff7ed;
		border-color: #fed7aa;
		box-shadow: 0 2px 6px rgba(249, 115, 22, 0.03);
		.date-tag {
			background: #f97316;
			color: #ffffff;
			border-color: #f97316;
		}
	}

  .task-card-top-row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 6px;
  }

  .task-title-heading {
    margin: 0;
    font-size: 13.5px;
    font-weight: 700;
    color: #0f172a;
    line-height: 1.4;
    word-break: break-word;
  }

  .delete-task-btn {
    background: none;
    border: none;
    color: #94a3b8;
    font-size: 18px;
    cursor: pointer;
    line-height: 1;
    padding: 0;
    transition: color 0.1s ease;
    &:hover { color: #ef4444; }
  }

  .task-deadline-row {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
  }

  .compact-tag {
    font-size: 10px;
    font-weight: 700;
    padding: 3px 6px;
    border-radius: 4px;
    white-space: nowrap;
    border: 1px solid transparent;
    
    &.date-tag { 
      background: #f1f5f9; 
      color: #475569; 
      border-color: #e2e8f0; 
    }
    &.no-date-tag { 
      background: #f8fafc; 
      color: #94a3b8; 
      border-color: #f1f5f9; 
      font-weight: 500; 
    }
  }

  .task-executor-row {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    margin-top: -2px;
  }

  .handler-name-badge {
    font-size: 11px;
    font-weight: 600;
    color: #475569;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: left;
  }

  .task-card-actions-area {
    display: flex;
    justify-content: flex-end;
    margin-top: 4px;
    width: 100%;
  }

  .management-control-group {
    display: flex;
    gap: 4px;
    width: 100%;
  }

  button {
    font-family: inherit;
    border: none;
    border-radius: 6px;
    font-size: 10.5px;
    font-weight: 700;
    cursor: pointer;
    padding: 5px 8px;
    box-sizing: border-box;
    transition: background-color 0.1s ease;
  }

  .move-state-btn { background: #2563eb; color: #ffffff; width: 100%; &:hover { background: #1d4ed8; } }
  .accept-state-btn { background: #16a34a; color: #ffffff; flex-grow: 1; &:hover { background: #15803d; } }
  .reject-state-btn { background: #dc2626; color: #ffffff; flex-grow: 1; &:hover { background: #b91c1c; } }
`;