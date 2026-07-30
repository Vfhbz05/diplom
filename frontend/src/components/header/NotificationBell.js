import { useState } from "react";
import styled from "styled-components";

const BellWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  & .notification-button {
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    padding: 4px;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s;
    position: relative;

    &:hover {
      transform: scale(1.1);
    }
  }

  & .notification-badge {
    position: absolute;
    top: 2px;
    right: 2px;
    width: 8px;
    height: 8px;
    background-color: #ef4444;
    border-radius: 50%;
    border: 1.5px solid var(--bg);
  }
`;

export const NotificationBell = () => {
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);

  const handleNotificationClick = () => {
    setHasUnreadNotifications(false);
    alert("Здесь будет открываться выпадающий список ваших уведомлений!");
  };

  return (
    <BellWrapper>
      <button className="notification-button" onClick={handleNotificationClick}>
        🔔
        {hasUnreadNotifications && <span className="notification-badge" />}
      </button>
    </BellWrapper>
  );
};