import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useState } from 'react';

const InputGroupContainer = ({ className, label, id, type, register, ...props }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const isPasswordType = type === 'password';
  const currentType = isPasswordType && isPasswordVisible ? 'text' : type;

  const isTextArea = type === 'textarea';

  const togglePasswordVisibility = (e) => {
    e.preventDefault();
    setIsPasswordVisible(!isPasswordVisible);
  };

  const registerProps = register || {};

    return( 
      <div className={className}>
        {label && <label htmlFor={id}>{label}</label>}
          <div className='input-container'>
            {isTextArea ? (
              <textarea
                id={id}
                rows = '3'
                {...register}
                {...props}
                {...registerProps}
              />
            ) : (
              <input 
                id={id} 
                type = {currentType}
                {...register}
                {...props} 
                {...registerProps}
              />
            )}

            {isPasswordType && (
              <button 
                type = 'button'
                className='toggle-password-btn'
                onClick = {togglePasswordVisibility}
                tabIndex='-1'
              >
                {isPasswordVisible ? '🙈' : '👁️'}
              </button>
            )}
          </div>
      </div>
    );
};

export const InputGroup = styled(InputGroupContainer)`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  width: ${props => props.width || '100%'};

  & label {
    font-size: 13px;
    font-weight: 600;
    color: #495057;
    margin-bottom: 8px;
    text-align: left;
  }

  & .input-container {
    position: relative; /* Делаем этот блок точкой отсчета для абсолютной позиции глазка */
    display: flex;
    align-items: center;
    width: 100%;
  }

  & input {
    font-size: 15px;
    padding: 12px 40px 12px 16px; 
    border: 1px solid #ced4da;
    border-radius: 8px;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    width: 100%;
    box-sizing: border-box;

    &:focus {
      border-color: #007bff;
      box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.15);
    }

    &::placeholder {
      color: #adb5bd;
    }
  }
  
   & textarea {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid #ced4da;
    border-radius: 8px;
    outline: none;
    font-size: 15px;
    font-family: inherit; /* Чтобы шрифт не менялся на стандартный моноширинный */
    background-color: var(--bg);
    color: var(--text-h);
    box-sizing: border-box;
    resize: vertical; /* Разрешаем растягивать поле только по вертикали, чтобы не ломать ширину карточки */
    transition: border-color 0.2s, box-shadow 0.2s;

    &:focus {
      border-color: #007bff;
      box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.15);
    }

    &::placeholder {
      color: #adb5bd;
    }
  }
    
  & .toggle-password-btn {
    position: absolute;
    right: 14px;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 16px;
    padding: 0;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
    
    &:hover {
      opacity: 0.7;
    }
  }
`;

InputGroupContainer.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  id: PropTypes.string.isRequired,
};