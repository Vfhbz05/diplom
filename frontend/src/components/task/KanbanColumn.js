import { useSelector } from "react-redux";
import { useParams } from "react-router-dom"
import { selectAllTasks } from "../../selectors";
import { useState } from "react";
import styled from "styled-components";
import { STATUS } from "../../constants/status";
import { TaskForm } from "./TaskForm";
import { TaskCard } from "./TaskCard";
import PropTypes from "prop-types";

export const KanbanColumn = ({ col, onSelectTask, filterStartDate, filterEndDate }) => {
    const { projectId } = useParams();

    const allTasks = useSelector(selectAllTasks);

    const [isFormActive, setIsFormActive] = useState(false);

    const colTasks = allTasks.filter((task) => {
      const taskProjectId = task?.project?._id || task.project;
      
      const matchesProjectAndStatus = taskProjectId === projectId && task.status === col.id;
      if (!matchesProjectAndStatus) return false;

      if (!filterStartDate && !filterEndDate) return true;

      if (!task.dueDate) return false;

      const taskTime = new Date(task.dueDate).setHours(0, 0, 0, 0);

      if (filterStartDate) {
        const startTime = new Date(filterStartDate).setHours(0, 0, 0, 0);
        if (taskTime < startTime) return false;
      }

      if (filterEndDate) {
        const endTime = new Date(filterEndDate).setHours(23, 59, 59, 999);
        if (taskTime > endTime) return false;
      }

      return true;
    });

    return(
        <ColumnWrapper>
          <h3 className="column-header-title" style={{ borderBottom: `2.5px solid ${col.color}` }}>
            {col.title} 
            <span className="task-count-badge">{colTasks.length}</span>
          </h3>

          {isFormActive ? (
            <TaskForm setActiveFormCol={setIsFormActive} colId={col.id} />
          ) : (
            col.id === STATUS.TODO && (
              <button className="open-task-form-btn" onClick={() => setIsFormActive(true)}>
                + Добавить задачу
              </button>
            )
          )}
          <div className="tasks-scroll-list">
            {colTasks
              .slice()
              .sort((a,b) => {
                if (a.dueDate && b.dueDate) {
                  return new Date(a.dueDate) - new Date(b.dueDate);
                }

                if (a.dueDate) return -1;
                if (b.dueDate) return 1;
                return 0;
              })
              .map((task) => (
              <TaskCard key={task._id || task.id} task={task} onOpenModal={() => onSelectTask(task)} />
            ))}
          </div>
          
          
        </ColumnWrapper>
  );
};

KanbanColumn.propTypes = {
  col: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
  }).isRequired,
  onSelectTask: PropTypes.func.isRequired,
  filterStartDate: PropTypes.string,
  filterEndDate: PropTypes.string,
};

const ColumnWrapper = styled.div`
  flex: 1 1 0px;
  min-width: 0px;
  background: #f1f5f9;
  border-radius: 12px;
  padding: 14px;
  border: 1px solid #e2e8f0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: auto;
  min-height: 450px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.01);
  
  .column-header-title {
    margin: 0;
    font-size: 14px;
    font-weight: 700;
    color: #334155;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 8px;
  }
  
  .task-count-badge {
    background: #ffffff;
    color: #475569;
    padding: 2px 8px;
    border-radius: 10px;
    font-size: 11.5px;
    font-weight: 700;
    border: 1px solid #e2e8f0;
  }
  
  .tasks-scroll-list {
    min-height: 50px;
    max-height: calc(100vh - 280px);
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding-right: 2px;
    &::-webkit-scrollbar {
      width: 4px;
    }
    &::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 10px;
    }
  }
  
  .open-task-form-btn {
    width: 100%;
    background: transparent;
    color: #64748b;
    border: 1px dashed #cbd5e1;
    border-radius: 8px;
    text-align: center;
    font-size: 12px;
    font-weight: 600;
    padding: 10px;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.15s ease-in-out;
    margin-bottom: 4px;
    &:hover {
      background: #ffffff;
      color: #0f172a;
      border-color: #94a3b8;
      box-shadow: 0 2px 4px rgba(15, 23, 42, 0.02);
    }
  }
`;
