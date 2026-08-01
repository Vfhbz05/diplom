import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { fetchProjects } from "../actions";
import { selectProjectsIsLoading, selectProjectsError } from "../selectors";
import { CreateProjectForm, ProjectList } from "../components"; 

export const Projects = () => {
    const dispatch = useDispatch();
    
    const isLoading = useSelector(selectProjectsIsLoading);
    const projectsError = useSelector(selectProjectsError);

    
    useEffect(()=> {
         dispatch(fetchProjects());
    }, [dispatch]);
    

    return(
        <Container>
            <header className = 'projects-header'>
                <h1>Мои проекты</h1>
                <p className="projects-subtitle">Управляйте рабочими пространствами и задачами вашей команды</p>
            </header>

            <CreateProjectForm />
            {projectsError && <div className="error-message">{projectsError}</div>}
            {isLoading ? (
                <div className="loading">Синхронизация с базой данных...</div>
            ) : (
                <ProjectList />
            )}
        </Container>
    );
}

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px;
  box-sizing: border-box;
  text-align: left;
  font-family: system-ui, -apple-system, sans-serif;

  /* Шапка страницы */
  & .projects-header {
    margin-bottom: 35px;
    
    & h1 {
      margin: 0 0 8px 0;
      font-size: 32px;
      font-weight: 700;
      color: #1d3557;
    }
  }

  & .projects-subtitle {
    color: #6c757d;
    font-size: 16px;
    margin: 0;
  }

  /* Красная плашка системных ошибок */
  & .error-message {
    background-color: rgba(239, 68, 68, 0.1);
    color: #ef4444;
    padding: 14px 18px;
    border-radius: 8px;
    margin-bottom: 25px;
    border: 1px solid rgba(239, 68, 68, 0.2);
    font-size: 15px;
    font-weight: 500;
  }

  /* Состояние загрузки списка проектов */
  & .loading {
    text-align: center;
    padding: 60px 40px;
    color: #6c757d;
    border: 1px solid #e1e4e8;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 500;
    background: #fafbfc;
  }
`;