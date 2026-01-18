import React, { useState } from 'react';
import { useTelegramWebApp } from '../../hooks/useTelegramWebApp';

interface SettingsPanelProps {
  onClose: () => void;
}

export function SettingsPanel({ onClose }: SettingsPanelProps) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [hapticEnabled, setHapticEnabled] = useState(true);
  const [graphicsQuality, setGraphicsQuality] = useState<'low' | 'medium' | 'high'>('medium');
  const telegramWebApp = useTelegramWebApp();

  const handleToggle = (setter: (value: boolean) => void, currentValue: boolean) => {
    setter(!currentValue);
    if (telegramWebApp) {
      telegramWebApp.HapticFeedback.selectionChanged();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-b from-gray-900 to-black rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 p-4 flex items-center justify-between border-b border-gray-700">
          <h2 className="text-2xl font-bold">⚙️ Settings</h2>
          <button
            onClick={onClose}
            className="text-3xl w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-800 active:scale-90 transition-all"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Audio Settings */}
          <section>
            <h3 className="text-lg font-semibold mb-4 text-cyan-400">🔊 Audio</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-gray-800 rounded-lg p-4">
                <div>
                  <div className="font-semibold">Sound Effects</div>
                  <div className="text-sm text-gray-400">Gunshots, explosions, etc.</div>
                </div>
                <button
                  onClick={() => handleToggle(setSoundEnabled, soundEnabled)}
                  className={`w-14 h-8 rounded-full transition-colors ${
                    soundEnabled ? 'bg-cyan-600' : 'bg-gray-600'
                  }`}
                >
                  <div
                    className={`w-6 h-6 bg-white rounded-full transition-transform ${
                      soundEnabled ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between bg-gray-800 rounded-lg p-4">
                <div>
                  <div className="font-semibold">Background Music</div>
                  <div className="text-sm text-gray-400">Game soundtrack</div>
                </div>
                <button
                  onClick={() => handleToggle(setMusicEnabled, musicEnabled)}
                  className={`w-14 h-8 rounded-full transition-colors ${
                    musicEnabled ? 'bg-cyan-600' : 'bg-gray-600'
                  }`}
                >
                  <div
                    className={`w-6 h-6 bg-white rounded-full transition-transform ${
                      musicEnabled ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </section>

          {/* Haptic Feedback */}
          <section>
            <h3 className="text-lg font-semibold mb-4 text-purple-400">📳 Haptic Feedback</h3>
            <div className="flex items-center justify-between bg-gray-800 rounded-lg p-4">
              <div>
                <div className="font-semibold">Vibration</div>
                <div className="text-sm text-gray-400">Vibrate on actions</div>
              </div>
              <button
                onClick={() => handleToggle(setHapticEnabled, hapticEnabled)}
                className={`w-14 h-8 rounded-full transition-colors ${
                  hapticEnabled ? 'bg-purple-600' : 'bg-gray-600'
                }`}
              >
                <div
                  className={`w-6 h-6 bg-white rounded-full transition-transform ${
                    hapticEnabled ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </section>

          {/* Graphics */}
          <section>
            <h3 className="text-lg font-semibold mb-4 text-yellow-400">🎨 Graphics</h3>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="font-semibold mb-3">Quality</div>
              <div className="grid grid-cols-3 gap-2">
                {(['low', 'medium', 'high'] as const).map((quality) => (
                  <button
                    key={quality}
                    onClick={() => {
                      setGraphicsQuality(quality);
                      telegramWebApp?.HapticFeedback.selectionChanged();
                    }}
                    className={`py-3 rounded-lg font-semibold transition-all ${
                      graphicsQuality === quality
                        ? 'bg-yellow-600 text-white'
                        : 'bg-gray-700 text-gray-300'
                    }`}
                  >
                    {quality.charAt(0).toUpperCase() + quality.slice(1)}
                  </button>
                ))}
              </div>
              <div className="mt-3 text-sm text-gray-400">
                {graphicsQuality === 'low' && '⚡ Best performance, basic visuals'}
                {graphicsQuality === 'medium' && '⚖️ Balanced quality and performance'}
                {graphicsQuality === 'high' && '✨ Best visuals, may affect battery'}
              </div>
            </div>
          </section>

          {/* Game Info */}
          <section>
            <h3 className="text-lg font-semibold mb-4 text-green-400">ℹ️ About</h3>
            <div className="bg-gray-800 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Version</span>
                <span className="font-semibold">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Developer</span>
                <span className="font-semibold">TonPanda</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Network</span>
                <span className="font-semibold">TON Testnet</span>
              </div>
            </div>
          </section>

          {/* Actions */}
          <section className="space-y-3">
            <button className="w-full bg-gray-800 py-4 rounded-lg font-semibold text-left px-4 flex items-center justify-between active:scale-95 transition-transform">
              <span>📚 How to Play</span>
              <span className="text-gray-400">→</span>
            </button>
            <button className="w-full bg-gray-800 py-4 rounded-lg font-semibold text-left px-4 flex items-center justify-between active:scale-95 transition-transform">
              <span>💬 Join Community</span>
              <span className="text-gray-400">→</span>
            </button>
            <button className="w-full bg-red-900 bg-opacity-50 py-4 rounded-lg font-semibold text-left px-4 flex items-center justify-between active:scale-95 transition-transform">
              <span>🗑️ Clear Cache</span>
              <span className="text-gray-400">→</span>
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
