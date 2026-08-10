import styled from "styled-components";
import { Logo } from "./Logo";
import { UserControlPanel } from "./UserControlPanel";

export const Header = () => {
  return (
    <HeaderContainer>
      <Logo/>
      <div className="right-side-controls">
        <UserControlPanel />
      </div>
    </HeaderContainer>
  );
};
const HeaderContainer = styled.header`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px 24px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between; 
  align-items: center; 
  background-color: #ffffff;
  border-bottom: 1px solid #e1e4e8; 

  & .right-side-controls {
    display: flex;
    align-items: center;
    gap: 20px; 
  }
`;

