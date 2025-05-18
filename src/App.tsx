import React from 'react';
import { PomodoroTimer } from './components/PomodoroTimer';

/**
 * メイン App コンポーネント
 * PomodoroTimer をフルスクリーンで表示
 */
const App: React.FC = () => {
  return (
    <div className="h-screen w-screen overflow-hidden">
      <PomodoroTimer />
    </div>
  );
};

export default App;
