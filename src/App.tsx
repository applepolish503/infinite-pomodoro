import React from 'react';
import styles from './App.module.css';
import { PomodoroTimer } from './components/PomodoroTimer';

/**
 * メイン App コンポーネント
 * PomodoroTimer をフルスクリーンで表示
 */
const App: React.FC = () => {
  return (
    <div className={styles.wrapper}>
      <PomodoroTimer />
    </div>
  );
};

export default App;
