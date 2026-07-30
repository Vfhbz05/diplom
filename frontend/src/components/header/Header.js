import styled from "styled-components";
import { Logo } from "./Logo";
import { NotificationBell } from "./NotificationBell";
import { UserControlPanel } from "./UserControlPanel";

const HeaderContainer = ({ className }) => {
  return (
    <div className={className}>
      <Logo/>
      <div className="right-side-controls">
        <NotificationBell />
        <UserControlPanel />
      </div>
    </div>
  );
};

export const Header = styled(HeaderContainer)`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between; 
  padding: 10px 24px;
  border-bottom: 1px solid var(--border);
  background: var(--bg);
  box-sizing: border-box;

  & .right-side-controls {
    display: flex;
    align-items: center;
    gap: 20px; 
  }

  & .user-name {
    font-size: 15px;
    color: var(--text);
    white-space: nowrap;
    
    & strong {
      color: var(--text-h);
      font-weight: 600;
    }
  }
`;
