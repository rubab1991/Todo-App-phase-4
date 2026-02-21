import React, { useState } from 'react';
import styles from './ChatbotIcon.module.css';

interface ChatbotIconProps {
  onClick: () => void;
}

const ChatbotIcon: React.FC<ChatbotIconProps> = ({ onClick }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`${styles.chatbotIcon} ${hovered ? styles.hovered : ''}`}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={styles.iconContainer}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={styles.icon}
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      </div>
    </div>
  );
};

export default ChatbotIcon;