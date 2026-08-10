import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { fetchProjects } from "../actions";
import { selectProjectsIsLoading, selectProjectsError, selectProjectItems } from "../selectors";
import { InputGroup, ProjectList } from "../components"; 

export const Projects = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const allProjects = useSelector(selectProjectItems);
    const isLoading = useSelector(selectProjectsIsLoading);
    const projectsError = useSelector(selectProjectsError);

    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const LIMIT = 6;

    
    useEffect(()=> {
         dispatch(fetchProjects());
    }, [dispatch]);

    const searchedProjects = allProjects.filter((project) => {
        return project.name.toLowerCase().includes(searchQuery.toLowerCase());
    });

     const sortedProjects = [...searchedProjects].sort((a, b) => {
        if (!a.deadline && !b.deadline) return 0;
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;

        return new Date(a.deadline) - new Date(b.deadline);
    });

    const totalPages = Math.ceil(sortedProjects.length / LIMIT);

    if(currentPage > totalPages && totalPages > 0){
        setCurrentPage(1);
    }

    const startIndex = (currentPage - 1) * LIMIT;
    const endIndex = startIndex + LIMIT;

    const projectsToDisplay = sortedProjects.slice(startIndex, endIndex);

    return(
        <Container>
            <header className = 'projects-header'>
                <h1>Мои проекты</h1>
                <p className="projects-subtitle">Управляйте рабочими пространствами и задачами вашей команды</p>
            </header>
            <InputGroup
                id="project-search"
                type="text"
                placeholder="Поиск проекта по названию..."
                value={searchQuery}
                onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); 
                }}
                width="100%" 
                style={{ maxWidth: "600px", marginBottom: "30px" }}
            />
            {projectsError ? (
				<div className="error-message">
					<span>Не удалось загрузить проекты: {projectsError}</span>
					<button className="login-redirect-btn" onClick={() => navigate("/login")}>
						🔑 Войти в аккаунт
					</button>
                </div>) : (
                <>
					{isLoading ? (
						<div className="loading">Синхронизация с базой данных...</div>
					) : (
						<>
							<ProjectList filteredProjects={projectsToDisplay} />
							{totalPages > 1 && (
								<div className="pagination-panel">
									<button
										disabled={currentPage === 1}
										onClick={() => setCurrentPage(currentPage - 1)}
										className="page-nav-btn"
									>
										← Назад
									</button>
									<span className="page-info">Страница {currentPage} из {totalPages}</span>
									<button
										disabled={currentPage === totalPages}
										onClick={() => setCurrentPage(currentPage + 1)}
										className="page-nav-btn"
									>
										Вперед →
									</button>
								</div>
							)}
						</>
					)}
				</>
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

	& .projects-header {
		margin-bottom: 25px;
		& h1 { margin: 0 0 8px 0; font-size: 32px; font-weight: 700; color: #1d3557; }
	}

	& .projects-subtitle { color: #6c757d; font-size: 16px; margin: 0; }

	/* 5. Обновили стили блока ошибки для красивого выравнивания кнопки флексом */
	& .error-message {
		background-color: #fef2f2;
		color: #dc2626;
		padding: 16px 20px;
		border-radius: 8px;
		margin-bottom: 25px;
		border: 1px solid #fee2e2;
		font-size: 15px;
		font-weight: 500;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 16px;

		& .login-redirect-btn {
			background-color: #dc2626;
			color: white;
			border: none;
			padding: 8px 16px;
			border-radius: 6px;
			font-size: 13px;
			font-weight: 600;
			cursor: pointer;
			transition: background-color 0.2s;
			white-space: nowrap;

			&:hover {
				background-color: #b91c1c;
			}
		}
	}

	& .loading {
		text-align: center;
		padding: 60px 40px;
		color: #6c757d;
		border: 1px solid #e1e4e8;
		border-radius: 12px;
		font-size: 15px;
		background: #fafbfc;
	}

	& .pagination-panel {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 20px;
		margin-top: 40px;
		width: 100%;
		& .page-nav-btn {
			padding: 10px 18px;
			background: #ffffff;
			border: 1px solid #ced4da;
			border-radius: 8px;
			font-weight: 600;
			font-size: 14px;
			cursor: pointer;
			color: #495057;
			transition: all 0.2s;
			&:hover:not(:disabled) { background: #f8f9fa; border-color: #adb5bd; }
			&:disabled { opacity: 0.5; cursor: not-allowed; background: #e9ecef; }
		}
		& .page-info { font-size: 14px; font-weight: 600; color: #495057; }
	}
`;