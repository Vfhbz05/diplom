import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { selectCurrentUser, selectProjectById, selectProjectTeam } from "../../selectors";
import { useParams } from "react-router-dom";
import { ROLE } from "../../constants/role";
import { addTeamMember, fetchProjectTasks, removeTeamMember } from "../../actions";

export const TeamPanel = () => {

    const dispatch = useDispatch();
    const { projectId } = useParams();

    const rawTeam = useSelector(selectProjectTeam(projectId));
    const projectTeam = Array.isArray(rawTeam) ? rawTeam : [];

    const currentUser = useSelector(selectCurrentUser);
    const currentProject = useSelector(selectProjectById(projectId));

    const [newMemberEmail, setNewMemberEmail] = useState('');
    const [isAddingMember, setIsAddingMember] = useState(false);

    const isOwnerOrAdmin = currentProject?.owner?._id === currentUser?._id ||
        currentProject?.owner === currentUser?._id ||
        currentUser?.role === ROLE.ADMIN;
    
    const handleAddMemberSubmit = (e) => {
         e.preventDefault();
        if(!newMemberEmail.trim()) return;
    
        dispatch(addTeamMember(projectId, newMemberEmail)).then((res) => {
            if(!res?.error){
                setNewMemberEmail('');
                setIsAddingMember(false);
            }
        });
    };
    
    const handleRemoveMemberClick = (userId, userName) => {
            if(window.confirm(`Вы уверены, что хотите удалить ${userName} из команды проекта?`)){
                dispatch(removeTeamMember(projectId, userId)).then((res) => {
                    if(!res?.error){
                        dispatch(fetchProjectTasks(projectId));
                    }
                });
            }
    };

    return(
        <TeamPanelContainer>
            <div className='team-panel-header'>
                <h2>👥 Участники проекта ({projectTeam.length})</h2>
                {isOwnerOrAdmin && !isAddingMember && (
                <button className="toggle-btn" onClick={() => setIsAddingMember(true)}>
                    + Добавить участника команды
                </button>
                )}
            </div>

            <div className="team-panel-content">
                <div className="members-grid">
                <div className="member-badge member-badge--owner">
                    <div className="avatar-icon" style={{ backgroundColor: '#d97706' }}>👑</div>
                    <div className="member-text-details">
                    <span className="member-name-text">{currentProject?.owner?.name || 'Владелец'}</span>
                    <span className="member-email-text">{currentProject?.owner?.email}</span>
                    </div>
                </div>

            
            {projectTeam.map(member => {
                const memberId = member._id || member;
                const memberName = member.name || 'Разработчик';
                const memberEmail = member.email || '';

                if (memberId === currentProject?.owner?._id || memberId === currentProject?.owner) return null;

                return (
                <div className="member-badge" key={memberId}>
                    <div className="avatar-icon" style={{ backgroundColor: '#475569' }}>
                    {memberName.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="member-text-details">
                    <span className="member-name-text">{memberName}</span>
                    <span className="member-email-text">{memberEmail}</span>
                    </div>
                    {isOwnerOrAdmin && (
                    <button className="kick-member-btn" onClick={() => handleRemoveMemberClick(memberId, memberName)}>×</button>
                    )}
                </div>
                );
            })}
            </div>

            {isAddingMember && (
            <form className="inline-member-form" onSubmit={handleAddMemberSubmit}>
                <input 
                className="member-email-input"
                type="email" 
                placeholder="Введите email пользователя на платформе..." 
                value={newMemberEmail} 
                onChange={e => setNewMemberEmail(e.target.value)} 
                required 
                />
                <button className="member-submit-btn" type="submit">Добавить</button>
                <button className="member-cancel-btn" type="button" onClick={() => setIsAddingMember(false)}>Отмена</button>
            </form>
            )}
        </div>
        </TeamPanelContainer>
    );
};

const TeamPanelContainer = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 32px;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.02);
  border: 1px solid #e2e8f0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  box-sizing: border-box;

  .team-panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }

  .team-panel-content {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  h2, span, button, input, form {
    font-family: inherit;
    box-sizing: border-box;
  }

  h2 {
    font-size: 15px;
    color: #334155;
    margin: 0;
    font-weight: 600;
  }

  button.toggle-btn {
    background: none;
    border: none;
    color: #2563eb;
    font-weight: 600;
    font-size: 13.5px;
    cursor: pointer;
    transition: color 0.15s;
    padding: 0;
    
    &:hover {
      color: #1d4ed8;
      text-decoration: underline;
    }
  }

  .members-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }

  .member-badge { 
    display: flex; 
    align-items: center; 
    gap: 10px; 
    background: #f1f5f9; 
    border: 1px solid #e2e8f0; 
    padding: 6px 14px; 
    border-radius: 8px; 
    position: relative; 
    min-width: 180px; 
  } 
    .member-badge--owner { 
    background: #fef3c7; 
    border-color: #fde68a; 
    } 

  .avatar-icon {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: bold;
  }

  .member-text-details {
    display: flex;
    flex-direction: column;
  }

  .member-name-text {
    font-size: 13px;
    font-weight: 600;
    color: #1e293b;
  }

  .member-email-text {
    font-size: 11px;
    color: #64748b;
  }

  .kick-member-btn {
    background: none;
    border: none;
    color: #94a3b8;
    font-size: 18px;
    cursor: pointer;
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    padding: 0 4px;
    line-height: 1;
    transition: color 0.1s;

    &:hover {
      color: #ef4444;
    }
  }

  .inline-member-form {
    display: flex;
    gap: 8px;
    max-width: 550px;
    background: #f8fafc;
    padding: 8px;
    border-radius: 8px;
    border: 1px dashed #cbd5e1;
  }

  .member-email-input {
    flex-grow: 1;
    padding: 6px 12px;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    outline: none;
    font-size: 13px;
    background: #ffffff;

    &:focus {
      border-color: #2563eb;
    }
  }

  .member-submit-btn {
    background: #2563eb;
    color: #ffffff;
    border: none;
    padding: 6px 14px;
    border-radius: 6px;
    font-size: 13px;
    cursor: pointer;
    font-weight: 500;
    transition: background-color 0.1s;

    &:hover {
      background: #1d4ed8;
    }
  }

  .member-cancel-btn {
    background: transparent;
    border: none;
    color: #64748b;
    font-size: 13px;
    cursor: pointer;
    padding: 6px 10px;

    &:hover {
      color: #0f172a;
    }
  }
`;