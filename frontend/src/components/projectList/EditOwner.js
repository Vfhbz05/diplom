import { useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { updateProjectOwner } from "../../actions";
import { InputGroup } from "../InputGroup";

export const EditOwner = ({ project, onCancel, onSuccess }) => {
  const dispatch = useDispatch();

  const initialEmail =
    typeof project.owner === "object" ? project.owner.email || "" : "";
  const [newOwnerEmail, setNewOwnerEmail] = useState(initialEmail);

  const handleSaveOwner = (projectId) => {
    if (!newOwnerEmail.trim() || !newOwnerEmail.includes("@")) {
      alert("Введите корректный Email нового владельца проекта");
      return;
    }

    dispatch(
      updateProjectOwner(projectId, newOwnerEmail.trim().toLowerCase()),
    ).then((data) => {
      if (data && data.error) {
        alert(`Не удалось сменить владельца: ${data.error}`);
        return;
      }
      alert("Владелец проекта успешно изменен!");
      onSuccess();
    });
  };

  return (
    <EditOwnerContainer>
      <h3>Передача прав проекта</h3>
      <InputGroup
        id="new-owner-email"
        label="Электронная почта нового владельца"
        type="email"
        placeholder="Например: employee@company.com"
        value={newOwnerEmail}
        onChange={(e) => setNewOwnerEmail(e.target.value)}
      />
      <p className="warning-text">
        Внимание: после смены владельца карточка обновится. Вы потеряете доступ
        к управлению проектом, если не являетесь Администратором.
      </p>
      <div className="inline-form-actions">
        <button className="save-btn" onClick={handleSaveOwner}>
          Назначить владельцем
        </button>
        <button className="cancel-btn" onClick={onCancel}>
          Отмена
        </button>
      </div>
    </EditOwnerContainer>
  );
};

const EditOwnerContainer = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  flex: 1;
  background: #ffffff;
  box-sizing: border-box;

  & h3 {
    margin: 0 0 4px 0;
    font-size: 16px;
    color: #1d3557;
    font-weight: 600;
  }

  & .warning-text {
    margin: 8px 0 0 0;
    font-size: 12px;
    color: #6c757d;
    line-height: 1.45;
  }

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
      background-color: #ffc107;
      color: #212529;
    }

    & .cancel-btn {
      background-color: #e9ecef;
      color: #495057;
    }
  }

  & ${InputGroup} {
    margin-bottom: 4px;
  }
`;
