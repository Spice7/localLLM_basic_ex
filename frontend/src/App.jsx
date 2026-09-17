import { useState, useEffect } from 'react';
import SettingsPanel from './components/SettingsPanel';
import ChatWindow from './components/ChatWindow';
import { fetchModels } from './api/chatApi';
import { promptModes } from './api/promptModes';
import './App.css';

const DEFAULT_SETTINGS = {
  model: '',
  system_prompt: promptModes.basic.prompt,
  temperature: 0.4,
  top_p: 0.9,
  num_predict: 2000,
};

function App() {
  const [models, setModels] = useState([]);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    fetchModels()
      .then((list) => {
        setModels(list);
        if (list.length > 0) {
          setSettings((prev) => ({ ...prev, model: list[0] }));
        }
      })
      .catch(() => {
        setModels([]);
      });
  }, []);

  // 드로어가 열린 동안에는 뒤쪽 본문 스크롤을 막고, Esc로 닫을 수 있게 한다 (모바일)
  useEffect(() => {
    if (!isSidebarOpen) return;

    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsSidebarOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSidebarOpen]);

  // 데스크톱 폭으로 돌아가면 드로어 상태를 초기화한다
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 861px)');
    const handleChange = (e) => {
      if (e.matches) setIsSidebarOpen(false);
    };
    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  }, []);

  return (
    <div className="app-layout">
      <SettingsPanel
        models={models}
        settings={settings}
        onSettingsChange={setSettings}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      {isSidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
      <ChatWindow
        settings={settings}
        onMenuClick={() => setIsSidebarOpen(true)}
      />
    </div>
  );
}

export default App;
