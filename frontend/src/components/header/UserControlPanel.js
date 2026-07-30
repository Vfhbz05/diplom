import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { logoutUser } from "../../actions";
import { selectCurrentUserName } from "../../selectors";


const PanelWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;

  & .create-project-btn {
    background-color: var(--accent);
    border: none;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    cursor: pointer;
    box-shadow: var(--shadow);
    transition: transform 0.2s, background-color 0.2s;

    &:hover {
      transform: scale(1.1);
      opacity: 0.9;
    }
  }

  & .user-name {
    font-size: 15px;
    color: var(--text);
    
    & strong {
      color: var(--text-h);
    }
  }

  & .logout-button {
    background: none;
    border: 1px solid var(--border);
    padding: 8px 16px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    color: var(--text-h);
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background-color: rgba(239, 68, 68, 0.1);
      border-color: rgba(239, 68, 68, 0.4);
      color: #ef4444;
    }
  }
`;


export const UserControlPanel = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userName = useSelector(selectCurrentUserName) || "Пользователь";

    const handleLogout = () => {
        sessionStorage.removeItem("userData");
        dispatch(logoutUser());
        navigate("/login");
    };

    const handleCreateNewProject = () => {
    const title = prompt("Введите название нового проекта:");
    if (title && title.trim()) {
      alert(`Запрос на создание проекта "${title}" будет отправлен на бэкенд!`);
    }
  };

  return(
    <PanelWrapper>
        <button 
        className="create-project-btn" 
        onClick={handleCreateNewProject}
        title="Создать новый проект"
      >
        ➕
      </button>

      <span className="user-name">Привет, <strong>{userName}</strong>!</span>
      
      <button className="logout-button" onClick={handleLogout}>
        Выйти 🚪
      </button>
    </PanelWrapper>
  );
}