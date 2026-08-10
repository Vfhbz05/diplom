import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { logoutUser } from "../../actions";
import { selectCurrentUserName } from "../../selectors";
import { openCreateModal } from "../../actions";
import { CreateProjectForm } from "./CreateProjectForm"; 


export const UserControlPanel = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userName = useSelector(selectCurrentUserName) || "Пользователь";
     const isCreateModalOpen = useSelector((state) => state.projects?.isCreateModalOpen);

    const handleLogout = () => {
        sessionStorage.removeItem("userData");
        dispatch(logoutUser());
        navigate("/login");
    };

  return(
    <PanelWrapper>
      <ExpandableCreateButton onClick={() => dispatch(openCreateModal())} title="Создать новый проект">
          <span className="plus-icon">＋</span> 
          <span className="button-text">Создать проект</span>
        </ExpandableCreateButton>
      <StyledProfileLink to="/settings" title="Перейти в настройки профиля">Привет, <strong>{userName}</strong>!</StyledProfileLink>
      
      <button className="logout-button" onClick={handleLogout}>
        Выйти 🚪
      </button>

      {isCreateModalOpen && <CreateProjectForm />}

    </PanelWrapper>
  );
}

const ExpandableCreateButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  
  width: 40px;
  height: 40px;
  padding: 0 12px; 
  background-color: #007bff;
  color: #ffffff;
  border: none;
  border-radius: 20px; 
  cursor: pointer;
  overflow: hidden; 
  white-space: nowrap;

  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.2s;

  & .plus-icon {
    font-size: 16px;
    font-weight: 700;
    line-height: 1;
    display: inline-block;
    min-width: 16px; 
    text-align: center;
  }

  & .button-text {
    font-size: 14px;
    font-weight: 600;
    margin-left: 8px; 
    opacity: 0; 
    transition: opacity 0.2s ease-in-out;
  }

  &:hover {
    background-color: #0056b3;
    width: 160px;
    border-radius: 8px;

    & .button-text {
      opacity: 1;
      transition-delay: 0.1s; 
    }
  }

  &:active {
    transform: scale(0.96);
  }
`;

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

const StyledProfileLink = styled(Link)`
  font-size: 15px;
  color: var(--text, #495057);
  text-decoration: none; 
  transition: all 0.2s ease;
  cursor: pointer;

  & strong {
    color: var(--text-h, #1d3557);
    transition: color 0.2s ease;
  }

  &:hover {
    color: #007bff; 
    
    & strong {
      color: #0056b3; 
      text-decoration: underline; 
    }
  }
`;
