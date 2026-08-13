import { useEffect, useRef, useState } from "react";
import { InputGroup } from "../InputGroup";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import PropTypes from "prop-types";
import { getTodayString } from "../../utils/getTodayString";
import { createTaskAction, updateTaskFieldAction } from "../../actions";
import { selectProjectById, selectProjectTeam, selectTaskById } from "../../selectors";

export const TaskForm = ({setActiveFormCol, colId, task = null}) => {
    const taskId = task?._id || task?.id || null;  
    const { projectId } = useParams();
    const dispatch = useDispatch();

    const reduxTask = useSelector(selectTaskById(taskId));
    const currentTask = reduxTask || task;
    const currentProject = useSelector(selectProjectById(projectId));
    const projectTeam = useSelector(selectProjectTeam(projectId));
    
    const formatDateForInput = (dateString) => {
      if (!dateString) return "";
      return dateString.split("T")[0];
    };

    const [newTaskTitle, setNewTaskTitle] = useState(currentTask?.title || '');
    const [newTaskDesc, setNewTaskDesc] = useState(currentTask?.description || '');
    const [newTaskDueDate, setNewTaskDueDate] = useState(taskId  ? formatDateForInput(currentTask?.dueDate) : '');
    const [newTaskExecutor, setNewTaskExecutor] = useState(
      task ? (currentTask?.assignedTodo?._id || currentTask?.assignedTodo || '') : ''
    );
    const isInitializedRef = useRef(false);

    useEffect(() => {
      if (taskId && currentTask && !isInitializedRef.current) {
        setNewTaskTitle(currentTask.title || "");
        setNewTaskDesc(currentTask.description || "");
        setNewTaskDueDate(formatDateForInput(currentTask.dueDate));
        setNewTaskExecutor(currentTask.assignedTodo?._id || currentTask.assignedTodo || "");
        if (currentTask.title) {
          isInitializedRef.current = true; 
        }
      }
    }, [taskId, currentTask]);

    useEffect(() => {
      return () => {
        isInitializedRef.current = false;
      };
    }, [taskId]);

    const handleFormSubmit = (e) => {
      e.preventDefault();

        if (!newTaskTitle.trim()) return;

        const finalDueDate = newTaskDueDate ? newTaskDueDate : getTodayString();

        const taskData = {
          title: newTaskTitle,
          description: newTaskDesc,
          dueDate: finalDueDate, 
          assignedTodo: newTaskExecutor || null,
        };
        
        if (taskId) {
          
          dispatch(updateTaskFieldAction(taskId, taskData)).then((res) => {
            if (!res?.error) {
              const updatedTaskFromServer = res.task || res;
              handleCleanAndClose(updatedTaskFromServer);
            }
          });
        } else {
          dispatch(createTaskAction({ ...taskData, projectId, status: colId })).then((res) => {
            if (!res?.error) {
              handleCleanAndClose(false);
            }
          });
        }
      };

      const handleCleanAndClose = (payload = false) => {
            setNewTaskTitle(''); 
            setNewTaskDesc(''); 
            setNewTaskDueDate(''); 
            setNewTaskExecutor('');
            setActiveFormCol(payload); 
      };

    return(
        <ModalOverlay onClick={(e) => {
          if (e.target === e.currentTarget) {
            handleCleanAndClose(false);
          }
        }}>
          <ModalContainer onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <h3>{task  ? "Редактирование задачи" : "Создание новой задачи"}</h3>
              <button type="button" className="close-x-btn" onClick={() => handleCleanAndClose(false)}>×</button>
            </ModalHeader>

            <StyledTaskForm onSubmit={handleFormSubmit}>
              <InputGroup 
                id="task-title-input" 
                label="Название задачи" 
                value={newTaskTitle} 
                onChange={e => setNewTaskTitle(e.target.value)} 
                placeholder="Введите название задачи..." 
                autoFocus 
              />

              <InputGroup 
                id="task-desc-input" 
                label="Описание задачи" 
                type="textarea" value={newTaskDesc} 
                onChange={e => setNewTaskDesc(e.target.value)} 
                placeholder="Опишите детали выполнения задачи..." 
              />

              <div className="form-row-grid">
                <InputGroup 
                  id="task-date-input" 
                  label="Срок сдачи (Дедлайн)" 
                  type="date" 
                  min="0" 
                  value={newTaskDueDate} 
                  onChange={e => setNewTaskDueDate(e.target.value)} 
                />

                <div className="form-field">
                  <label>Исполнитель:</label>
                  <select value={newTaskExecutor} onChange={e => setNewTaskExecutor(e.target.value)} >
                    <option value="">Не назначен</option>
                    <option value={currentProject?.owner?._id || currentProject?.owner}>
                      👑 {currentProject?.owner?.name || 'Владелец'}
                    </option>
                    {projectTeam.filter(member => {
                        const memberId = member._id || member;
                        const ownerId = currentProject?.owner?._id || currentProject?.owner;
                        return String(memberId) !== String(ownerId);
                      }).map(m => (
                          <option key={m._id || m} value={m._id || m}>
                              👤 {m.name || m.email}
                          </option>
                        ))}
                  </select>
                </div>
              </div>
              <div className="inline-task-button-group">
                <button type="submit" className='save-task-btn'>
                  {currentTask ? "Сохранить" : "Создать"}
                </button>
                <button type="button" className="cancel-task-btn" onClick={() => handleCleanAndClose(false)}>
                  Отмена
                </button>
              </div>
            </StyledTaskForm>
          </ModalContainer>
        </ModalOverlay>
  );
};

TaskForm.propTypes = {
  setActiveFormCol: PropTypes.func.isRequired,
  colId: PropTypes.string,
  task: PropTypes.object  
};


const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; width: 100vw; height: 100vh;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  display: flex; justify-content: center; align-items: center;
  z-index: 9999;
`;

const ModalContainer = styled.div`
  background: #ffffff; width: 520px; border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  padding: 24px;
  animation: modalFadeIn 0.2s ease-out;
  @keyframes modalFadeIn {
    from { transform: translateY(-20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
`;

const ModalHeader = styled.div`
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 20px; border-bottom: 1px solid #f1f5f9; padding-bottom: 12px;
  h3 { margin: 0; font-size: 18px; font-weight: 700; color: #1e293b; }
  .close-x-btn {
    background: none; 
    border: none; 
    font-size: 24px; 
    color: #94a3b8; 
    cursor: pointer; 
    padding: 0 4px; 
    line-height: 1;
    &:hover { color: #64748b; }
  }
`;

const StyledTaskForm = styled.form`
  display: flex; flex-direction: column; gap: 16px; box-sizing: border-box;
  & > div { margin-bottom: 0px !important; }
  
  .form-row-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; align-items: flex-end; }
  
  .form-field {
    display: flex; flex-direction: column; width: 100%;
    label { font-size: 13px; font-weight: 600; color: #495057; margin-bottom: 8px; text-align: left; }
    select {
      width: 100%; 
      padding: 10px 16px; 
      border: 1px solid #ced4da; 
      border-radius: 8px; 
      font-size: 15px;
      background: #ffffff; 
      outline: none; 
      height: 46px; 
      box-sizing: border-box; 
      cursor: pointer; 
      color: #495057;
      transition: border-color 0.15s ease;
      &:focus { border-color: #007bff; }
    }
  }
  
  .inline-task-button-group { 
  display: flex; 
  gap: 12px; 
  margin-top: 8px; 
  justify-content: flex-end; 
  }
  
  button { 
  font-family: inherit; 
  border: none;
  border-radius: 8px; 
  font-size: 13px; 
  font-weight: 600; 
  cursor: pointer; 
  padding: 10px 20px; 
  transition: background-color 0.1s; 
  }
  .save-task-btn { background: #007bff; color: #ffffff; &:hover { background: #0056b3; } }
  .cancel-task-btn { background: #f1f5f9; color: #475569; &:hover { background: #e2e8f0; color: #0f172a; } }
`;