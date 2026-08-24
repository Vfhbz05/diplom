import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { InputGroup } from "../InputGroup";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState } from "react";
import styled from "styled-components";
import { createNewProject, closeCreateModal } from "../../actions";

const projectFormSchema = yup.object().shape({
    name: yup
        .string()
        .required('Название проекта обязательно для заполнения')
        .min(3, 'Название должно быть не менее 3 символов')
        .max(100, 'Максимум 100 символов для названия'),
    description: yup
        .string()
        .max(500, 'Описание слишком длинное (максимум 500 символов)'),
     deadline: yup
        .string()
        .required("Укажите дату сдачи проекта"),
});

export const CreateProjectForm = () => {
    const [serverError, setServerError] = useState(null); 
    const [isSubmitting, setIsSubmitting] = useState(false);

    const dispatch = useDispatch();

    const {
        register,
        handleSubmit,
        reset,
        formState: {errors, isValid},
    } = useForm({
            defaultValues: {
                name: '',
                description: '',
                deadline: '',
            },
            resolver: yupResolver(projectFormSchema),
        });


    const onSubmit = ({ name, description, deadline }) => {
        setServerError(null); 
        setIsSubmitting(true);
        dispatch(createNewProject({ name, description, deadline }))
            .then((data) => {
                if(data && data.error){
                    setServerError(`Не удалось создать проект: ${data.error}`);
                    setIsSubmitting(false);
                    return;
                }
                reset();
                setServerError(null);
                dispatch(closeCreateModal());
            }).catch((err)=> setServerError(`Ошибка при создании: ${err.message}`))
            .finally(() => {
                setIsSubmitting(false);
            });
    }; 

    const handleClose = () => {
        reset();
        setServerError(null);
        dispatch(closeCreateModal());
    };

    const formError = errors?.name?.message || errors?.description?.message || errors?.deadline?.message;
    const errorMessage = formError || serverError;

    return (
        <ModalOverlay onClick={handleClose}>
             <ModalContent onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Новый проект</h2>
                    <button className="close-x-btn" onClick={handleClose}>&times;</button>
                </div>
                <form className='create-project-form' onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-inputs">
                        <InputGroup
                            id='name'
                            label='Название проекта'
                            type='text'
                            placeholder='Например: Построение 3D модели машины для картинга'
                            register={register('name', { onChange: () => setServerError(null) })}
                        />
                        <InputGroup
                            id='description'
                            label='Описание проекта'
                            type='textarea'
                            placeholder='Кратко опишите цели или технологии...'
                            register={register('description', { onChange: () => setServerError(null) })}
                        />
                        <InputGroup
                            id='deadline'
                            label='Дата сдачи проекта'
                            type='date'
                            register={register('deadline', { onChange: () => setServerError(null) })}
                        />
                        </div>
                        
                        <div className="form-actions-row">
                        <button type='submit' className='submit-project-btn' disabled={!isValid || isSubmitting}>
                            {isSubmitting ? "Создание..." : "Создать проект"}
                        </button>
                        <button type='button' className='cancel-project-btn' onClick={handleClose}>
                            Отмена
                        </button>
                        </div>
                    </form>
                    {errorMessage && <div className="error-message">{errorMessage}</div>}
             </ModalContent>
        </ModalOverlay>
    );
};

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(29, 53, 87, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999; 
`;


const ModalContent = styled.div`
  background: #ffffff;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  max-width: 550px;
  width: 100%;
  box-sizing: border-box;
  animation: fadeIn 0.25s ease-out;

  & .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    border-bottom: 1px solid #e1e4e8;
    padding-bottom: 12px;

    & h2 { margin: 0; font-size: 24px; color: #1d3557; font-weight: 700; }
    
    & .close-x-btn {
      background: none;
      border: none;
      font-size: 28px;
      color: #868e96;
      cursor: pointer;
      line-height: 1;
      padding: 0;
      &:hover { color: #212529; }
    }
  }

  & .create-project-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
    
    & .form-inputs { display: flex; flex-direction: column; width: 100%; }
  }

  & .form-actions-row {
    display: flex;
    gap: 12px;
    margin-top: 10px;

    & button {
      flex: 1;
      padding: 14px;
      border: none;
      border-radius: 8px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    & .submit-project-btn {
      background-color: #007bff;
      color: #fff;
      &:hover:not(:disabled) { background-color: #0056b3; }
      &:disabled { background-color: #ced4da; cursor: not-allowed; }
    }

    & .cancel-project-btn {
      background-color: #e9ecef;
      color: #495057;
      &:hover { background-color: #dee2e6; }
    }
  }

  & .error-message {
    background-color: rgba(239, 68, 68, 0.1);
    color: #ef4444;
    padding: 12px 16px;
    border-radius: 8px;
    margin-top: 16px;
    border: 1px solid rgba(239, 68, 68, 0.2);
    font-size: 14px;
    text-align: left;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }
`;