import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { selectCurrentUserId } from "../../selectors";

const LogoWrapper = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
  font-weight: 700;
  color: var(--text-h);
  text-decoration: none;
  
  & span {
    background: linear-gradient(45deg, var(--accent), #007bff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

export const Logo = () => {
    const userId = useSelector(selectCurrentUserId);

    const targetPath = userId ? "/" : "/login";

    return (
        <LogoWrapper to={targetPath} className = 'logo-link'>
            ⏱️<span>TimeTracker</span>
        </LogoWrapper>
    );
};