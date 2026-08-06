import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { fetchProjects, fetchProjectTasks } from "../actions";
import { selectProjectById, selectTasksError, selectTasksLoading } from "../selectors";
import { TeamPanel } from "../components";
import { ProjectAnalytics } from '../components/analytics/ProjectAnalytics';

export const Analytics = () => {
    const { projectId } = useParams();
    const dispatch = useDispatch();

    const currentProject = useSelector(selectProjectById(projectId));
    const isTasksLoading = useSelector(selectTasksLoading);
    const tasksError = useSelector(selectTasksError);

    useEffect(()=>{
        if(projectId){
            dispatch(fetchProjectTasks(projectId));
            dispatch(fetchProjects());
        }
    }, [projectId, dispatch]);

    if(isTasksLoading) return <CenteredStyle>⏳ Загрузка графиков аналитики...</CenteredStyle>;
    if (tasksError) return <CenteredStyle style={{ color: '#dc2626' }}>❌ Ошибка: {tasksError}</CenteredStyle>;

    return (
        <AnalyticsPageContainer>
            <div className="board-header">
                <Link to="/">← Вернуться к проектам</Link>
                <div className="project-meta-info">
                    <h1 className="project-main-title">
                        Аналитика: {currentProject?.name || 'Проект'}
                    </h1>
                    {currentProject?.progress !== undefined && (
                        <span className="progress-badge"> 
                            Прогресс: {currentProject.progress}% 
                        </span>
                    )}
                </div>
            </div>

            <TeamPanel />

            <TabNavigationBar>
                <NavLinkTab to={`/${projectId}/tasks`}>
                📋 Доска задач
                </NavLinkTab>
            </TabNavigationBar>

            <ProjectAnalytics />
        </AnalyticsPageContainer>
    );
};

const AnalyticsPageContainer = styled.div`
  padding: 32px 12px;
  width: 100%;
  box-sizing: border-box;
  background-color: #f8fafc;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  .board-header {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 28px;
    padding: 0 16px;
    
    a {
      text-decoration: none;
      color: #64748b;
      font-weight: 500;
      font-size: 14px;
      transition: color 0.15s ease;
      width: fit-content;
      
      &:hover { 
        color: #0f172a; 
      }
    }
  }

  .project-meta-info { 
    display: flex; 
    align-items: center; 
    gap: 16px; 
  } 

  .project-main-title { 
    font-size: 26px; 
    color: #0f172a; 
    margin: 0; 
    font-weight: 700; 
    letter-spacing: -0.02em;
  } 

  .progress-badge { 
    background: #e2e8f0; 
    color: #334155; 
    padding: 4px 12px; 
    border-radius: 20px; 
    font-size: 13px; 
    font-weight: 600; 
    white-space: nowrap; 
  }
`;

const TabNavigationBar = styled.div`
  display: flex;
  gap: 8px;
  margin: 16px 16px 20px 16px;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 8px;
`;

const NavLinkTab = styled(Link)`
  text-decoration: none;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  border-radius: 6px;
  font-family: inherit;
  transition: all 0.15s ease;

  &:hover {
    color: #0f172a;
    background: #f1f5f9;
  }

  &.active {
    color: #2563eb;
    background: #eff6ff;
  }
`;

const CenteredStyle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 15px;
  color: #64748b;
  font-weight: 500;
  background-color: #f8fafc;
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
`;