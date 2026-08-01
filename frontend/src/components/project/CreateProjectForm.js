import { useForm } from "react-hook-form";
import { InputGroup } from "../InputGroup";
import { yupResolver } from "@hookform/resolvers/yup";
import { request } from "../../utils/request";
import * as yup from "yup";
import { useState } from "react";
import styled from "styled-components";

const projectFormSchema = yup.object().shape({
    name: yup
        .string()
        .required('Название проекта обязательно для заполнения')
        .min(3, 'Название должно быть не менее 3 символов')
        .max(100, 'Максимум 100 символов для названия'),
    description: yup
        .string()
        .max(150, 'Описание слишком длинное (максимум 150 символов)'),
     deadline: yup
        .string()
        .required("Укажите дату сдачи проекта"),
});

export const CreateProjectForm = ({ projects, setProjects }) => {
    const [serverError, setServerError] = useState(null); 
    const {
        register,
        handleSubmit,
        reset,
        formState: {errors},
    } = useForm({
            defaultValues: {
                name: '',
                description: '',
                deadline: '',
            },
            resolver: yupResolver(projectFormSchema),
        });

    const onSubmit = ({ name, description, deadline }) => {
            request('/projects', 'POST', {name, description, deadline})
                .then((data) => {
                    if(data.error){
                        setServerError(`Не удалось создать проект: ${data.error}`);
                        return;
                    }
    
                    const createdProject = data.project;
                    setProjects([...projects, createdProject]);
                    reset();
                }).catch((err)=> setServerError(`Ошибка при создании: ${err.message}`));
        }; 

    const formError = errors?.name?.message || errors?.description?.message || errors?.deadline?.message;
    const errorMessage = formError || serverError;

    return (
        <Container>
            <form className = 'create-project-form' onSubmit={handleSubmit(onSubmit)}>
                <div className="form-inputs">
                    <InputGroup
                        id = 'name'
                        label = 'Название проекта'
                        type = 'text'
                        placeholder = 'Например: Построение 3D модели машины для картинга'
                        register = {register('name', {onChange: () => setServerError(null)})}
                    />

                    <InputGroup 
                        id = 'description'
                        label = 'Описание проекта'
                        type = 'textarea'
                        placeholder = 'Кратко опишите цели или технологии...'
                        register = {register('description', {onChange: () => setServerError(null)})}
                    />

                    <InputGroup 
                        id = 'deadline'
                        label = 'Дата сдачи проекта'
                        type = 'date'
                        register = {register('deadline', {onChange: () => setServerError(null)})}
                    />
                </div>
                <button type = 'submit' className = 'submit-project-btn' disabled = {!!formError}>
                    Создать проект
                </button>
            </form>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
        </Container>
    );
};

const Container = styled.div`
  width: 100%;
  margin-bottom: 40px;

  & .create-project-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
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
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.2s;

    &:hover:not(:disabled) {
      opacity: 0.9;
    }
    
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
    margin-top: 16px;
    border: 1px solid rgba(239, 68, 68, 0.2);
    max-width: 600px;
    text-align: left;
    font-size: 14px;
  }
`;