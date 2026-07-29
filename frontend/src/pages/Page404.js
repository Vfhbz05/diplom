import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import styled from "styled-components";

const Page404Container = ({className, errorMessage}) =>{
    return(
        <div className={className}> 
            <div className="error-card"> 
                <h1 className="error-title">404</h1> 
                <h2 className="error-subtitle">Страница не найдена</h2> 
                <p className="error-text"> 
                    {errorMessage || 'Возможно, она была удалена или вы ввели неверный адрес.'} 
                </p> 
                <Link className="back-link" to="/">Вернуться на главную</Link> 
            </div> 
        </div> 
    );
}

Page404Container.propTypes = {
  className: PropTypes.string,
  errorMessage: PropTypes.string,
};

export const Page404 = styled(Page404Container)`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    text-align: center;
    font-family: sans-serif;
    background-color: #f8f9fa;
    color: #333;

  & .error-card { 
    background: #ffffff; 
    padding: 40px; 
    border-radius: 12px; 
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05); 
    text-align: center; 
    max-width: 400px; 
    width: 100%; 
  } 

  & .error-title {
    font-size: 72px;
    font-weight: 800; 
    margin: 0 0 10px 0; 
    color: #dc3545;
    line-height: 1; 
  }

  & .error-subtitle {
    font-size: 24px; 
    margin: 0 0 15px 0; 
  }

  & .error-text {
    color: #6c757d; 
    margin-bottom: 20px;
  }

  & .back-link {
    display: inline-block;
    padding: 10px 20px; 
    background-color: #007bff; 
    color: #fff; 
    text-decoration: none; 
    border-radius: 4px; 
    font-weight: bold; 

    &:hover { 
      background-color: #0056b3; 
    } 
  }
`;

