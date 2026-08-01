import { useEffect, useState } from "react";
import { request } from "../utils/request";
import styled from "styled-components";
import { CreateProjectForm, ProjectList } from "../components";


const Container = styled.div`
  width: 100%;
  padding: 40px 24px;
  box-sizing: border-box;
  text-align: left;

  & .projects-header {
    margin-bottom: 30px;
    & h1 { margin: 0 0 8px 0; }
  }

  & .projects-subtitle {
    color: var(--text);
    font-size: 16px;
  }

  & .create-project-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 40px;
    max-width: 600px;
    width: 100%;

    & .form-inputs {
      display: flex;
      flex-direction: column;
      width: 100%;
    }
  }

  & .submit-project-btn {
    align-self: flex-start;
    padding: 12px 24px;
    background-color: var(--accent);
    color: #fff;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.2s;

    &:hover:not(:disabled) { opacity: 0.9; }
    &:disabled {
      background-color: var(--border);
      cursor: not-allowed;
    }
  }

  & .error-message {
    background-color: rgba(239, 68, 68, 0.1);
    color: #ef4444;
    padding: 12px 16px;
    border-radius: 8px;
    margin-bottom: 20px;
    border: 1px solid rgba(239, 68, 68, 0.2);
    max-width: 600px;
  }

  & .projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
    width: 100%;
  }

  & .project-card {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 24px;
    text-decoration: none;
    transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
    box-shadow: var(--shadow);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 140px;

    & h2 {
      margin: 0 0 8px 0;
      font-size: 20px;
    }

    & .project-desc {
      font-size: 14px;
      color: var(--text);
      margin: 0 0 16px 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    & .tasks-count {
      font-size: 14px;
      color: var(--accent);
      font-weight: 600;
      margin-top: auto;
    }

    &:hover {
      transform: translateY(-2px);
      border-color: var(--accent);
    }
  }

  & .empty-state, & .loading {
    grid-column: 1 / -1;
    text-align: center;
    padding: 40px;
    color: var(--text);
    border: 1px dashed var(--border);
    border-radius: 12px;
  }
`;


export const Project = () => {

    const [projects, setProjects] = useState([]);
    const [projectsError, setProjectsError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    
    useEffect(()=> {
        request('/projects').then((data) => {
            if(data.error){
                setProjectsError(`Не удалось загрузить проекты: ${data.error}`);
                return;
            }

            setProjects(data.projects || []);
        }).catch((err)=> setProjectsError(`Системная ошибка: ${err.message}`))
            .finally(()=> setIsLoading(false));
    }, []);
    

    return(
        <Container>
            <header className = 'projects-header'>
                <h1>Мои проекты</h1>
                <p className="projects-subtitle">Управляйте рабочими пространствами и задачами вашей команды</p>
            </header>

            <CreateProjectForm projects={projects} setProjects={setProjects}/>
            {projectsError && <div className="error-message">{projectsError}</div>}
            {isLoading ? (
                <div className="loading">Синхронизация с базой данных...</div>
            ) : (
                <ProjectList projects={projects}/>
            )}
        </Container>
    );
}
