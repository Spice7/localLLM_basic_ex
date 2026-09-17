import { useState } from 'react';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import { sendChat } from '../api/chatApi';
import './ChatWindow.css';

function ChatWindow({ settings, onMenuClick }) {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSend(text) {
    const userMessage = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const data = await sendChat({
        message: text,
        model: settings.model,
        system_prompt: settings.system_prompt,
        temperature: settings.temperature,
        top_p: settings.top_p,
        num_predict: settings.num_predict,
      });

      const aiMessage = {
        role: 'assistant',
        content: data.message,
        elapsed_time: data.elapsed_time,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      setError(err.message || '응답을 받아오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }

  function handleReset() {
    setMessages([]);
    setError(null);
  }

  return (
    <div className="chat-window">
      <div className="chat-header">
        <button
          className="menu-button"
          onClick={onMenuClick}
          aria-label="설정 열기"
        >
          <svg viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 4.5h14M2 9h14M2 13.5h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none"/>
          </svg>
        </button>
        <div className="chat-header-info">
          <h1 className="chat-title">Local LLM Chat</h1>
          <p className="chat-subtitle">React → FastAPI → Ollama 기반 로컬 AI 챗 앱</p>
        </div>
        <button className="reset-button" onClick={handleReset}>
          대화 초기화
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <MessageList messages={messages} isLoading={isLoading} />
      <ChatInput onSend={handleSend} isLoading={isLoading} />
    </div>
  );
}

export default ChatWindow;
