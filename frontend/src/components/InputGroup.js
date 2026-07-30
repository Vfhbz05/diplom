import styled from 'styled-components';
import PropTypes from 'prop-types';

const InputGroupContainer = ({ className, label, id, ...props }) => {
    return( 
        <div className={className}>
            {label && <label htmlFor={id}>{label}</label>}
            <input id={id} {...props} />
        </div>
    );
};

export const InputGroup = styled(InputGroupContainer)`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  /* Динамически меняем ширину, если её передали в пропсы */
  width: ${props => props.width || '100%'};

  & label {
    font-size: 13px;
    font-weight: 600;
    color: #495057;
    margin-bottom: 8px;
    text-align: left;
  }

  & input {
    font-size: 15px;
    padding: 12px 16px;
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
`;

InputGroupContainer.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  id: PropTypes.string.isRequired,
};