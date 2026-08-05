import PropTypes from "prop-types";
import { TaskTimer } from './TaskTimer';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../selectors';
import { STATUS } from '../../constants/status';
import { COLUMNS } from '../../constants/columns';
import { useState } from "react";
import { TaskForm } from "./TaskForm";
import { formatTotalLoggedTime } from "../../utils/formatTotalLoggedTime";
import { formatDeadline } from "../../utils/formatDeadline";

export const TaskViewModal = ({ task,  onClose, onTimeUpdated }) => {
    const currentUser = useSelector(selectCurrentUser);
    const [isEditing, setIsEditing] = useState(false);
    const [currentTotalDuration, setCurrentTotalDuration] = useState(task.totalDuration || 0);
    
    if(!task) return null;

    const executorId =  task.assignedTodo?._id || task.assignedTodo;
    const isExecutor = executorId === currentUser?._id;

    const isInProgress = task.status === STATUS.IN_PROGRESS;

    const currentColumn = COLUMNS.find(col => col.id === task.status);
    const colTitle = currentColumn ? currentColumn.title : task.status;

    const formatCreationDate = (dateString) => {
      if (!dateString) return "Не указана";
      const date = new Date(dateString);
      return date.toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "short",
        year: "numeric"
      });
    };

    if (isEditing) {
        return (
        <TaskForm 
            key={`${task._id || task.id}-edit`} 
            task={task} 
            colId={task.status} 
            setActiveFormCol={(updatedTask) => {
              if (updatedTask && typeof updatedTask === 'object') {
                if (onTimeUpdated) onTimeUpdated(updatedTask);
              }
              setIsEditing(false);
            }}  
        />
        );
    }
    
    return(
         <ModalOverlay onClick={onClose}>
            <ModalContainer onClick={(e) => e.stopPropagation()}>
              <ModalHeader>
                <div className="title-area">
                  <span className="status-badge">{colTitle}</span>
                  <h2>{task.title}</h2>
                </div>
                <div className="header-actions">
                  <button className="edit-toggle-btn" onClick={() => setIsEditing(true)}>
                    ✏️ Редактировать
                  </button>
                  <button type="button" className="close-x-btn" onClick={onClose}>×</button>
                </div>
              </ModalHeader>

              <ModalBody>
                <div className="modal-section">
                  <h4>📋 Описание задачи</h4>
                  <div className="description-box">
                    {task.description || <span className="empty-text">Описание отсутствует</span>}
                  </div>
                </div>

                <div className="modal-grid-info">
                  <div className="info-cell">
                    <span className="cell-label">📅 Срок сдачи</span>
                    <span className="cell-value estimate" style={{ color: task.dueDate ? '#b91c1c' : '#64748b' }}>
                      {task.dueDate ? formatDeadline(task.dueDate) : "Не установлен"}
                    </span>
                  </div>

                  <div className="info-cell">
                    <span className="cell-label">💼 Фактически затрачено</span>
                    <span className="cell-value logged">
                      {formatTotalLoggedTime(currentTotalDuration)}
                    </span>
                  </div>

                  <div className="info-cell">
                    <span className="cell-label">👤 Исполнитель</span>
                    <span className="cell-value executor">
                      {task.assignedTodo?.name || task.assignedTodo?.email || "Не назначен"}
                    </span>
                  </div>
                  <div className="info-cell">
                    <span className="cell-label">📝 Создана</span>
                    <span className="cell-value creation-date">
                      {formatCreationDate(task.createdAt)}
                    </span>
                  </div>
                </div>

                <TaskTimer
                  taskId={task._id || task.id}
                  isExecutor={isExecutor}
                  isInProgress={isInProgress}
                  onTimeLogged={(seconds) => {
                     setCurrentTotalDuration((prev) => prev + seconds);
                     if (onTimeUpdated) onTimeUpdated(seconds);
                  }}
                />
              </ModalBody>
            </ModalContainer>
        </ModalOverlay>
  );
};

TaskViewModal.propTypes = {
  task: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onTimeUpdated: PropTypes.func
};


const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const ModalContainer = styled.div`
  background: #ffffff;
  width: 600px;
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
  padding: 28px;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 16px;

  .title-area {
    display: flex;
    flex-direction: column;
    gap: 6px;
    align-items: flex-start;
    width: 70%; 
  }

  .status-badge {
    background: #e2e8f0;
    color: #475569;
    font-size: 11px;
    font-weight: 700;
    padding: 3px 8px;
    border-radius: 6px;
    text-transform: uppercase;
    width: fit-content;
  }

  h2 {
    margin: 0;
    font-size: 20px;
    font-weight: 800;
    color: #0f172a;
    line-height: 1.3;
    text-align: left;
    width: 100%;  
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .edit-toggle-btn {
    background: #f8fafc;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    padding: 6px 12px;
    font-size: 12px;
    font-weight: 600;
    color: #475569;
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
    &:hover { background: #f1f5f9; color: #0f172a; }
  }

  .close-x-btn {
    background: #f1f5f9;
    border: none;
    font-size: 22px;
    color: #64748b;
    cursor: pointer;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s, color 0.15s;
    &:hover { background: #e2e8f0; color: #0f172a; }
  }
`;

const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;

  h4 {
    margin: 0 0 8px 0;
    font-size: 14px;
    font-weight: 700;
    color: #334155;
  }

  .description-box {
    background: #f8fafc;
    padding: 14px 18px;
    border-radius: 10px;
    font-size: 14.5px;
    color: #334155;
    line-height: 1.6;
    border: 1px solid #e2e8f0;
    min-height: 60px;
    white-space: pre-wrap;
  }

  .empty-text {
    color: #94a3b8;
    font-style: italic;
  }

  .modal-grid-info {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .info-cell {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .cell-label {
    font-size: 11px;
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
  }

  .cell-value {
    font-size: 14px;
    font-weight: 700;
  }

  .cell-value.estimate {
    color: #166534;
  }

  .cell-value.logged {
    color: #1e40af;
  }

  .cell-value.executor {
    color: #334155;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .cell-value.creation-date {
    color: #475569;
  }
`;