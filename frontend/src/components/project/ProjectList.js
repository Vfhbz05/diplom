import { useDispatch, useSelector } from "react-redux";
import { removeProjectFromServer } from "../../actions";
import {
  selectProjectItems,
  selectCurrentUserRole,
  selectCurrentUserId,
} from "../../selectors";
import { useState } from "react";
import { EditOwner, EditProjectForm, StandartProjectCard } from "../projectList";
import styled from "styled-components";

export const ProjectList = () => {
  const dispatch = useDispatch();

  const projects = useSelector(selectProjectItems);
  const currentUserId = useSelector(selectCurrentUserId);
  const currentUserRole = useSelector(selectCurrentUserRole);

  const [editingProjectId, setEditingProjectId] = useState(null);
  const [changingOwnerProjectId, setChangingOwnerProjectId] = useState(null);

  const handleStartEdit = (project) => {
    setChangingOwnerProjectId(null);
    setEditingProjectId(project._id);
  };

  const handleStartChangeOwner = (project) => {
    setEditingProjectId(null);
    setChangingOwnerProjectId(project._id);
  };

  const handleCancelAll = () => {
    setEditingProjectId(null);
    setChangingOwnerProjectId(null);
  };

  const handleDeleteProject = (projectId) => {
    if (
      !window.confirm(
        "Вы уверены, что хотите полностью удалить этот проект и все его задачи?",
      )
    ) {
      return;
    }
    dispatch(removeProjectFromServer(projectId));
  };

  return (
    <ListGridContainer>
      {projects.length === 0 ? (
        <div className="empty-state">
          У вас пока ни одного проекта. Заполните поля выше, чтобы создать
          первый!
        </div>
      ) : (
        projects.map((project) => {
          const isEditing = editingProjectId === project._id;
          const isChangingOwner = changingOwnerProjectId === project._id;

          const projectOwnerId =
            typeof project.owner === "object"
              ? project.owner._id
              : project.owner;
          const isOwnerOrAdmin =
            currentUserRole === "ADMIN" || projectOwnerId === currentUserId;

          return (
            <div
              key={project._id}
              className={`project-card-wrapper ${isEditing || isChangingOwner ? "inline-editing" : ""}`}
            >
              {isEditing && (
                <EditProjectForm
                  project={project}
                  onCancel={handleCancelAll}
                  onSuccess={handleCancelAll}
                />
              )}
              {isChangingOwner && (
                <EditOwner
                  project={project}
                  onCancel={handleCancelAll}
                  onSuccess={handleCancelAll}
                />
              )}

              {!isEditing && !isChangingOwner && (
                <StandartProjectCard project={project} />
              )}
              {isOwnerOrAdmin && (
                <div className="card-actions-panel">
                  <button
                    className="action-btn edit-btn"
                    title="Редактировать поля"
                    onClick={() => handleStartEdit(project)}
                  >
                    ✏️
                  </button>
                  <button
                    className="action-btn owner-btn"
                    title="Сменить владельца по Email"
                    onClick={() => handleStartChangeOwner(project)}
                  >
                    👑
                  </button>
                  <button
                    className="action-btn delete-btn"
                    title="Полностью удалить проект"
                    onClick={() => handleDeleteProject(project._id)}
                  >
                    🗑️
                  </button>
                </div>
              )}
            </div>
          );
        })
      )}
    </ListGridContainer>
  );
};

const ListGridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(420px, 1fr));
  gap: 24px;
  width: 100%;
  margin-top: 15px;

  & .project-card-wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    background: #ffffff;
    border: 1px solid #e1e4e8;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02);
    transition:
      transform 0.2s,
      box-shadow 0.2s,
      border-color 0.2s;

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.06);
    }

    &.inline-editing {
      border-color: #007bff;
      box-shadow: 0 4px 15px rgba(0, 123, 255, 0.15);
    }
  }

  & .card-actions-panel {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    padding: 10px 16px;
    background: #f8f9fa;
    border-top: 1px solid #e1e4e8;
    margin-top: auto; /* Прижимает панель строго к нижнему краю карточки */

    & .action-btn {
      background: none;
      border: none;
      font-size: 15px;
      cursor: pointer;
      padding: 6px 10px;
      border-radius: 6px;
      transition: background-color 0.2s;

      &:hover {
        background-color: #e9ecef;
      }
    }
  }

  & .empty-state {
    grid-column: 1 / -1;
    text-align: center;
    padding: 60px 40px;
    color: #6c757d;
    border: 2px dashed #dee2e6;
    border-radius: 12px;
    font-size: 15px;
    background: #fafbfc;
  }
`;
