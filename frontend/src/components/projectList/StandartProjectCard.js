import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import styled from "styled-components";

export const StandartProjectCard = ({ project}) => {
    const formattedDeadline = project.deadline 
            ? new Date(project.deadline).toLocaleDateString('ru-RU')
            : 'Не указана';

    const ownerDisplay = typeof project.owner === 'object' 
            ? project.owner.name 
            : 'Вы';

    const progressPercent = project.progress || 0;

    const isOverdue = project.deadline ? new Date(project.deadline) < new Date() : false;
    return(
        <StyledCardLink to = {`/${project._id}/tasks`} className = 'project-card' $isOverdue={isOverdue}>
            <div className="card-top">
                <h2>{project.name}</h2>
                <span>👤  {ownerDisplay}</span>
            </div>
            {project.description && 
                <p className="project-desc">{project.description}</p>}
                <div className = 'card-footer'>
                    <div className="project-deadline-top">
                        <span>Сдать проект до </span>
                        <strong>{formattedDeadline}</strong>
                    </div>

                    <div className = 'progress-section'>
                        <div className = 'progress-text'>
                                <span>Прогресс:</span>
                                <strong>{progressPercent}%</strong>
                        </div>
                        <div className="progress-bar-bg">
                            <div className="progress-bar-fill" style = {{width: `${progressPercent}%`}}/>
                        </div>
                    </div>
                </div>
        </StyledCardLink>
    );
};

StandartProjectCard.propTypes = {
  project: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    deadline: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    owner: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    progress: PropTypes.number,
  }).isRequired,
};

const StyledCardLink = styled(Link)`
  padding: 24px;
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  flex: 1;

  border: 1px solid ${props => props.$isOverdue ? 'rgba(239, 68, 68, 0.4)' : 'transparent'};
  border-radius: 8px;
  background: ${props => props.$isOverdue ? 'rgba(239, 68, 68, 0.01)' : 'transparent'};
  transition: all 0.2s ease;

  & .card-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 12px;

    & h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
      color: #1d3557;
      line-height: 1.3;
    }

    & span {
      font-size: 13px;
      color: #495057;
      background: #e9ecef;
      padding: 4px 10px;
      border-radius: 20px;
      white-space: nowrap;
      font-weight: 500;
      gap: 6px; 
    }
  }

  & .project-desc {
    font-size: 14px;
    color: #6c757d;
    margin: 0 0 24px 0;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-align: left;
  }

  & .card-footer {
    margin-top: auto;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  & .project-deadline-top {
    font-size: 15px;
    color: #868e96;
    margin-bottom: 12px;
    text-align: left;
    
    & span { 
      color: #868e96; 
    }

    & strong { 
      color: ${props => props.$isOverdue ? '#ef4444' : '#007bff'}; 
      margin-top: 3px; 
      font-weight: 600; 
    }
  }

  & .progress-section {
    & .progress-text {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      margin-bottom: 6px;
      & span { color: #868e96; }
      & strong { color: #007bff; font-weight: 600; }
    }

    & .progress-bar-bg {
      width: 100%;
      height: 6px;
      background: #e9ecef;
      border-radius: 4px;
      overflow: hidden;
    }

    & .progress-bar-fill {
      height: 100%;
      background: #007bff;
      transition: width 0.3s ease;
    }
  }
`;