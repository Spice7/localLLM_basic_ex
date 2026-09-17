import { promptModes } from '../api/promptModes';
import './SettingsPanel.css';

const MODE_ENTRIES = Object.entries(promptModes);

function detectMode(systemPrompt) {
  const match = MODE_ENTRIES.find(([, v]) => v.prompt === systemPrompt);
  return match ? match[0] : 'custom';
}

function SettingsPanel({ models, settings, onSettingsChange, isOpen, onClose }) {
  const tempPct = `${(settings.temperature / 2) * 100}%`;
  const topPPct = `${settings.top_p * 100}%`;

  const currentMode = detectMode(settings.system_prompt);

  function handleModeChange(e) {
    const key = e.target.value;
    if (key === 'custom') return;
    onSettingsChange({ ...settings, system_prompt: promptModes[key].prompt });
  }

  return (
    <aside className={`settings-panel${isOpen ? ' open' : ''}`}>
      <div className="settings-title-row">
        <p className="settings-title">모델 설정</p>
        <button
          className="settings-close-button"
          onClick={onClose}
          aria-label="설정 닫기"
        >
          <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none"/>
          </svg>
        </button>
      </div>

      {/* 모델 선택 */}
      <div className="settings-group">
        <label className="settings-label">모델</label>
        <select
          className="settings-select"
          value={settings.model}
          onChange={(e) => onSettingsChange({ ...settings, model: e.target.value })}
        >
          {models.length === 0 ? (
            <option value="">불러오는 중…</option>
          ) : (
            models.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))
          )}
        </select>
      </div>

      {/* 프롬프트 모드 선택 */}
      <div className="settings-group">
        <label className="settings-label">프롬프트 모드</label>
        <select
          className="settings-select"
          value={currentMode}
          onChange={handleModeChange}
        >
          {MODE_ENTRIES.map(([key, { label }]) => (
            <option key={key} value={key}>{label}</option>
          ))}
          {currentMode === 'custom' && (
            <option value="custom">사용자 지정</option>
          )}
        </select>
      </div>

      {/* 시스템 프롬프트 */}
      <div className="settings-group">
        <label className="settings-label">시스템 프롬프트</label>
        <textarea
          className="settings-textarea"
          rows={6}
          value={settings.system_prompt}
          onChange={(e) => onSettingsChange({ ...settings, system_prompt: e.target.value })}
        />
      </div>

      {/* Temperature */}
      <div className="settings-group">
        <label className="settings-label">
          Temperature
          <span className="settings-value">{settings.temperature.toFixed(1)}</span>
        </label>
        <input
          type="range"
          className="settings-slider"
          style={{ '--pct': tempPct }}
          min={0}
          max={2}
          step={0.1}
          value={settings.temperature}
          onChange={(e) => {
            const val = Math.round(parseFloat(e.target.value) * 10) / 10;
            onSettingsChange({ ...settings, temperature: val });
          }}
        />
      </div>

      {/* Top P */}
      <div className="settings-group">
        <label className="settings-label">
          Top P
          <span className="settings-value">{settings.top_p.toFixed(1)}</span>
        </label>
        <input
          type="range"
          className="settings-slider"
          style={{ '--pct': topPPct }}
          min={0}
          max={1}
          step={0.1}
          value={settings.top_p}
          onChange={(e) => {
            const val = Math.round(parseFloat(e.target.value) * 10) / 10;
            onSettingsChange({ ...settings, top_p: Math.min(val, 1.0) });
          }}
        />
      </div>

      {/* Num Predict */}
      <div className="settings-group">
        <label className="settings-label">Num Predict</label>
        <input
          type="number"
          className="settings-number"
          min={1}
          max={2048}
          value={settings.num_predict}
          onChange={(e) => {
            const val = parseInt(e.target.value, 10);
            if (!Number.isNaN(val) && val >= 1 && val <= 2048) {
              onSettingsChange({ ...settings, num_predict: val });
            }
          }}
        />
      </div>
    </aside>
  );
}

export default SettingsPanel;
