import React from 'react';

interface WelcomeMessageProps {
  message?: string;
}

const WelcomeMessage: React.FC<WelcomeMessageProps> = ({
  message = '環境構築が成功しました！'
}) => {
  return (
    <div className="welcome-message">
      <div className="icon">✓</div>
      <p>{message}</p>
    </div>
  );
};

export default WelcomeMessage;
