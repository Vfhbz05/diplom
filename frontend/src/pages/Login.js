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

const loginFormSchema = yup.object().shape({
    email: yup  
        .string()
        .required('Заполните электронную почту')
        .email('Неверный формат почты'),
    password: yup
        .string()
        .required('Заполните пароль')
        .min(6, 'Минимум 6 символов в пароле')
});

const LoginContainer = ({ className }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            email: '',
            password: '',
        },
        resolver: yupResolver(loginFormSchema),
    });

    const [serverError, setServerError] = useState(null);
    const dispatch = useDispatch();
    const userId = useSelector(selectCurrentUserId);

    const onSubmit = ({ email, password }) => {
        setServerError(null);
        request('/auth/login', 'POST', { email, password })
            .then(({ error, user }) => {
                if(error){
                    setServerError(`Ошибка авторизации: ${error}`);
                    return;
                }

                dispatch(loginUser(user));
                sessionStorage.setItem('userData', JSON.stringify(user));
            }).catch((err) => {

                setServerError(`Системная ошибка сети: ${err.message}`);
            });
    };
    

    const formError = errors?.email?.message || errors?.password?.message;
    const errorMessage = formError || serverError;

    if(userId){
        return <Navigate to='/'/>;
    }

    return (
        <div className={className}>
            <div className="auth-page-wrapper">
                <div className="auth-logo-container">
                    <Logo />
                </div>
                <div className = 'login-card'>
                    <h1 className = 'login-title'>Вход в систему</h1>
                    <p className="login-subtitle">Управляйте проектами и фиксируйте рабочее время</p>

                    <form onSubmit = {handleSubmit(onSubmit)}>
                        <InputGroup
                            id = 'email'
                            label = 'Электронная почта'
                            type = 'email'
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

                        <button className="submit-button" type = 'submit' disabled = {!!formError}>
                            Войти в аккаунт
                        </button>

                        {errorMessage && <div className="auth-form-error">{errorMessage}</div>}
                    </form>
                    <p className = 'login-footer'>
                        Ещё нет аккаунта? <Link to='/register'>Зарегистрироваться</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

LoginContainer.propTypes = {
  className: PropTypes.string,
};

export const Login = styled(LoginContainer)`
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

     & .login-card {
    background: #ffffff;
    padding: 40px;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
    max-width: 420px;
    width: 100%;
    }

    & .login-title {
    font-size: 26px;
    font-weight: 700;
    color: #1d3557;
    margin: 0 0 8px 0;
    text-align: center;
    }

  & .login-subtitle {
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
    transition: background-color 0.2s;

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

  & .login-footer {
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