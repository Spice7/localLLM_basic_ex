import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './MessageBubble.css';

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard API 미지원 환경 무시 */
    }
  }

  return (
    <button className={`copy-button ${copied ? 'copied' : ''}`} onClick={handleCopy} title="복사">
      {copied ? (
        <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 8l3.5 3.5L13 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ) : (
        <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="5" y="5" width="8" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M3 11V3.5A1.5 1.5 0 014.5 2H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      )}
    </button>
  );
}

function CodeBlock({ children, className }) {
  const code = String(children).replace(/\n$/, '');
  const language = className?.replace('language-', '') ?? '';

  return (
    <div className="md-code-block">
      <div className="md-code-header">
        <span className="md-code-lang">{language || 'code'}</span>
        <CopyButton text={code} />
      </div>
      <pre className="md-pre"><code className={className}>{code}</code></pre>
    </div>
  );
}

const MD_COMPONENTS = {
  code({ node, inline, className, children, ...props }) {
    if (inline) {
      return <code className="md-inline-code" {...props}>{children}</code>;
    }
    return <CodeBlock className={className}>{children}</CodeBlock>;
  },
};

function MessageBubble({ message }) {
  const isUser = message.role === 'user';

  return (
    <div className={`message-bubble-wrapper ${isUser ? 'user' : 'assistant'}`}>
      <div className={`message-bubble ${isUser ? 'user' : 'assistant'}`}>
        {!isUser && <CopyButton text={message.content} />}
        <div className="md-body">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={MD_COMPONENTS}>
            {message.content}
          </ReactMarkdown>
        </div>
        {message.elapsed_time !== undefined && (
          <span className="message-meta">{message.elapsed_time.toFixed(2)}s</span>
        )}
      </div>
    </div>
  );
}

export default MessageBubble;
