
import { COLUMNS } from "../../constants/columns";
import styled from "styled-components";
import { useState } from "react";
import { TaskViewModal } from "./TaskViewModal";
import { KanbanColumn } from "./KanbanColumn";

export const KanbanBoard = () => {
    const [selectedTask, setSelectedTask] = useState(null);

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleClearDateFilter = () => {
      setStartDate('');
      setEndDate('');
    };

    return (
        <BoardWrapper>
          <DateFilterBar>
            <div className="filter-inputs">
              <div className="input-field">
                <label>Период с:</label>
                <input 
                  type="date" 
                  value={startDate} 
                  onChange={(e) => setStartDate(e.target.value)} 
                />
              </div>
              <div className="input-field">
                <label>по:</label>
                <input 
                  type="date" 
                  value={endDate} 
                  min={startDate}
                  onChange={(e) => setEndDate(e.target.value)} 
                />
              </div>
            </div>
            
            {(startDate || endDate) && (
              <button className="clear-filter-btn" onClick={handleClearDateFilter}>
                ✕ Сбросить фильтр
              </button>
            )}
          </DateFilterBar>

          <GridContainer>
            {COLUMNS.map((col) => (
              <KanbanColumn 
                key={col.id} 
                col={col} 
                onSelectTask={setSelectedTask} 
                filterStartDate={startDate}
                filterEndDate={endDate}
              />
            ))} 
          </GridContainer>

          {selectedTask && (
            <TaskViewModal 
              task={selectedTask} 
              onClose={() => setSelectedTask(null)} 
              onTimeUpdated={(minutesOrTask) => {
                setSelectedTask((prev) => {
                  if (minutesOrTask && typeof minutesOrTask === 'object') {
                    return { ...prev, ...minutesOrTask };
                  }
                  return { ...prev, loggedTime: (prev.loggedTime || 0) + minutesOrTask };
                });
              }} 
            />
          )}
        </BoardWrapper>
  );
};

const BoardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  background-color: #f8fafc;
  min-height: 100vh;
`;

export const GridContainer = styled.div`
  display: flex;
  gap: 16px; 
  align-items: flex-start;
  width: 100%;
  max-width: 100%;
  padding: 16px 0;
  box-sizing: border-box;
  overflow-x: auto; 
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
`;

const DateFilterBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #ffffff;
  padding: 14px 20px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  margin-bottom: 8px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);

  .filter-inputs {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .input-field {
    display: flex;
    align-items: center;
    gap: 8px;

    label {
      font-size: 12px;
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    input[type="date"] {
      padding: 8px 12px;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      font-size: 14px;
      color: #0f172a;
      outline: none;
      font-family: inherit;
      background: #f8fafc;
      transition: all 0.15s ease;

      &:focus {
        border-color: #007bff;
        background: #ffffff;
        box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.15);
      }
    }
  }

  .clear-filter-btn {
    background: #fff1f2;
    color: #e11d48;
    border: 1px solid #ffe4e6;
    padding: 8px 14px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s ease;

    &:hover {
      background: #ffe4e6;
      color: #be123c;
    }
  }
`;