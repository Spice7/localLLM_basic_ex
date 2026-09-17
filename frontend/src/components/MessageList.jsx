import { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import './MessageList.css';

function MessageList({ messages, isLoading }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="message-list">
      {messages.map((msg, index) => (
        <MessageBubble key={index} message={msg} />
      ))}
      {isLoading && (
        <div className="loading-indicator">
          <span className="dot" />
          <span className="dot" />
          <span className="dot" />
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
}

export default MessageList;
