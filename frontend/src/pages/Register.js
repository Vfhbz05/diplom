import { useForm } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import PropTypes from 'prop-types';
import { loginUser } from "../actions";
import { selectCurrentUserId } from "../selectors";
import { request } from "../utils/request";
import { InputGroup } from "../components";
import { Logo } from "../components";

const regFormSchema = yup.object().shape({
    name: yup
        .string()
        .required('Заполните имя и фамилию')
        .min(3, 'Имя должно быть не менее 3 символов')
        .matches(/^[a-zA-Zа-яА-ЯёЁ\s]+$/, 'Имя может содержать только буквы и пробелы'),
    email: yup
        .string()
        .required('Заполните электронную почту')
        .email('Неверный формат почты'),
    password: yup
        .string()
        .required('Заполните пароль')
        .min(6, 'Минимум 6 символов в пароле')
        .max(30, 'Максимум 30 символов в пароле'),
    passcheck: yup
        .string()
        .required('Повторите пароль')
        .oneOf([yup.ref('password'), null], 'Пароли не совпадают'),
});

const RegisterContainer = ({ className }) => {
    const { 
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: '',
            email: '',
            password: '',
            passcheck: ''
        },
        resolver: yupResolver(regFormSchema),
    });

    const [serverError, setServerError] = useState(null);
    const dispatch = useDispatch();
    const userId = useSelector(selectCurrentUserId);

    const onSubmit = ({ name, email, password }) => {
        request('/auth/register', 'POST', { name, email, password })
            .then(({ error, user}) => {
                if(error){
                    setServerError(`Ошибка запроса: ${error}`);
                    return;
                }
            dispatch(loginUser(user));
            sessionStorage.setItem('userData', JSON.stringify(user));
        });
    };

    const formError = errors?.name?.message 
        || errors?.email?.message 
        || errors?.password?.message 
        || errors?.passcheck?.message;
    const errorMessage = formError || serverError;

    if(userId){
        return <Navigate to='/'/>
    }

    return(
        <div className={className}>
            <div className="auth-page-wrapper">
                <div className="auth-logo-container">
                    <Logo />
                </div>
                <div className="register-card">
                    <h1 className="register-title">Регистрация</h1>
                    <p className="register-subtitle">Создайте аккаунт для совместной работы</p>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <InputGroup
                            id="name"
                            label="Имя и фамилия"
                            type="text"
                            placeholder="Мясникова Мария"
                            {...register("name", { onChange: () => setServerError(null) })}
                        />

                        <InputGroup
                            id="email"
                            label="Электронная почта"
                            type="email"
                            placeholder="example@company.com"
                            {...register("email", { onChange: () => setServerError(null) })}
                        />

                        <InputGroup
                            id="password"
                            label="Пароль"
                            type="password"
                            placeholder="*********"
                            {...register("password", { onChange: () => setServerError(null) })}
                        />

                        <InputGroup
                            id="passcheck"
                            label="Пароль"
                            type="password"
                            placeholder="*********"
                            {...register("passcheck", { onChange: () => setServerError(null) })}
                        />

                        <button className="submit-button" type='submit' disabled = {!!formError}>
                            Зарегистрироваться
                        </button>
                        {errorMessage && <div className="auth-form-error">{errorMessage}</div>}
                    </form>

                    <p className="register-footer">
                        Уже есть аккаунт? <Link to='/login'>Войти</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

RegisterContainer.propTypes = {
  className: PropTypes.string,
};


export const Register = styled(RegisterContainer)`
  display: flex;
  align-items: center;
  justify-content: center;
   flex: 1;
  width: 100%;
  height: 100%;
  font-family: system-ui, -apple-system, sans-serif;
  background-color: #f4f6f9;
  margin: 0;
  padding: 0;
  box-sizing: border-box;

  & .auth-page-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  & .auth-logo-container {
    margin-bottom: 24px;
    transform: scale(1.2);
  }

  & .register-card {
    background: #ffffff;
    padding: 40px;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
    max-width: 420px;
    width: 100%;
  }

  & .register-title {
    font-size: 26px;
    font-weight: 700;
    color: #1d3557;
    margin: 0 0 8px 0;
    text-align: center;
  }

  & .register-subtitle {
    font-size: 14px;
    color: #6c757d;
    margin: 0 0 30px 0;
    text-align: center;
  }

  & .submit-button {
    width: 100%;
    padding: 14px;
    background-color: #007bff;
    color: #ffffff;
    border: none;
    border-radius: 8px;
    font-size: 15px;
    font-weight: bold;
    cursor: pointer;
    margin-top: 10px;

    &:hover:not(:disabled) {
      background-color: #0056b3;
    }

    &:disabled {
      background-color: #ced4da;
      cursor: not-allowed;
    }
  }

  & .auth-form-error {
    background-color: #f8d7da;
    color: #721c24;
    padding: 12px;
    border-radius: 8px;
    margin-top: 20px;
    font-size: 14px;
    text-align: center;
    border: 1px solid #f5c6cb;
  }

  & .register-footer {
    font-size: 14px;
    color: #6c757d;
    text-align: center;
    margin: 25px 0 0 0;

    & a {
      color: #007bff;
      text-decoration: none;
      font-weight: 600;
      
      &:hover {
        text-decoration: underline;
      }
    }
  }
`;