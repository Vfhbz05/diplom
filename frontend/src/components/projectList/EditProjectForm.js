import { useState } from "react";
import { useDispatch } from "react-redux";
import { editProjectOnServer } from "../../actions";
import PropTypes from "prop-types";
import { InputGroup } from "../InputGroup";
import styled from "styled-components";

export const EditProjectForm = ({ project, onCancel, onSuccess }) => {
  const [editName, setEditName] = useState(project.name || "");
  const [editDesc, setEditDesc] = useState(project.description || "");
  const dateIso = project.deadline
    ? new Date(project.deadline).toISOString().split("T")[0]
    : "";
  const [editDeadline, setEditDeadline] = useState(dateIso);

  const dispatch = useDispatch();

  const handleSaveEdit = (projectId) => {
    if (!editName.trim()) {
      alert("Название проекта обязательно для заполнения");
      return;
    }

    dispatch(
      editProjectOnServer(projectId, {
        name: editName.trim(),
        description: editDesc.trim(),
        deadline: editDeadline,
      }),
    ).then((data) => {
      if (data && data.error) {
        alert(`Ошибка при сохранении: ${data.error}`);
        return;
      }
      onSuccess();
    });
  };

  return (
    <EditFormContainer>
      <InputGroup
        id="edit-name"
        label="Название проекта"
        type="text"
        placeholder="Введите новое название..."
        value={editName}
        onChange={(e) => setEditName(e.target.value)}
      />

      <InputGroup
        id="edit-description"
        label="Описание проекта"
        type="textarea"
        placeholder="Кратко опишите изменения..."
        value={editDesc}
        onChange={(e) => setEditDesc(e.target.value)}
      />

      <InputGroup
        id="edit-deadline"
        label="Дата сдачи проекта"
        type="date"
        value={editDeadline}
        onChange={(e) => setEditDeadline(e.target.value)}
      />

      <div className="inline-form-actions">
        <button className="save-btn" onClick={handleSaveEdit}>
          Сохранить
        </button>
        <button className="cancel-btn" onClick={onCancel}>
          Отмена
        </button>
      </div>
    </EditFormContainer>
  );
};

EditProjectForm.propTypes = {
  project: PropTypes.object.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

const EditFormContainer = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  flex: 1;
  background: #ffffff;
  box-sizing: border-box;

  /* Стилизуем кнопки действий внутри инлайн-формы */
  & .inline-form-actions {
    display: flex;
    gap: 10px;
    margin-top: 10px;

    & button {
      flex: 1;
      padding: 12px;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
      transition: opacity 0.2s;

      &:hover {
        opacity: 0.9;
      }
    }

    & .save-btn {
      background-color: #28a745;
      color: white;
    }

    & .cancel-btn {
      background-color: #e9ecef;
      color: #495057;
    }
  }

  & ${InputGroup} {
    margin-bottom: 12px;

    &:last-of-type {
      margin-bottom: 0;
    }
  }
`;
