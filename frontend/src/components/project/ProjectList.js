import { Link } from "react-router-dom";
import { request } from "../../utils/request";

export const ProjectList = ({ projects }) => {

    const handleDeleteProject = (projectId) => {
            if(!window.confirm("Вы уверены, что хотите полностью удалить этот проект и все его задачи?")){
                return;
            }
    
            request(`/projects/${projectId}`, 'DELETE')
                .then((data)=> {
                    if(data.error){
                        setProjectsError(`Не удалось удалить проект: ${data.error}`);
                        return;
                    }
                    setProjects(projects.filter((project) => project._id !== projectId));
                })
                    .catch((err) => setProjectsError(`Ошибка при удалении проекта: ${err.message}`));
        };

    return(
        <div className="project-grid">
            {projects.length === 0 ? (
                <div className = 'empty-state'>У вас пока ни одного проекта. Заполните поля выше, чтобы создать первый!</div>
            ) : (
                projects.map((project) => {
                    const progressPercent = project.progress || 0;

                    const formattedDeadline = project.deadline 
                        ? new Date(project.deadline).toLocaleDateString('ru-RU')
                        : 'Не указана';
                    return (
                        <div key = {project._id} className = 'project-card-wrapper'>
                            <Link to = {`/project/${project._id}`} className = 'project-card'>
                                <div className="card-top">
                                    <h2>{project.name}</h2>
                                    <span>👤{project?.owner?.name || 'Вы'}</span>
                                </div>
                                {project.description && 
                                <p className="project-desc">{project.description}</p>}
                                <div className = 'card-footer'>
                                    <div className="project-deadline">
                                        <span>Сдать проект до</span>
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
                            </Link>
                            <div className="card-actions-panel">
                                <button className="action-btn edit-btn" onClick={() => handleEditProject(project)}>✏️</button>
                                <button className="action-btn owner-btn" onClick={() => handleChangeOwner(project)}>👑</button>
                                <button className="action-btn delete-btn" onClick={() => handleDeleteProject(project._id)}>🗑️</button>
                            </div>
                        </div>
                    )
                })
            )}
        </div>
    );
}