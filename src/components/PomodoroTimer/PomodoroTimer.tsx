import React from 'react';
import { usePomodoro } from './usePomodoro';
import Countdown from './Countdown';
import Controls from './Controls';

/**
 * PomodoroTimer Component
 * @param workSec - 作業フェーズの秒数 (デフォルト 25*60)
 * @param breakSec - 休憩フェーズの秒数 (デフォルト 5*60)
 */
export interface PomodoroTimerProps {
  workSec?: number;
  breakSec?: number;
}

const PomodoroTimer: React.FC<PomodoroTimerProps> = ({
  workSec  = 25 * 60,
  breakSec =  5 * 60,
}) => {
  // カスタム Hook でタイマー状態と操作を取得
  const {
    isWork,
    remain,
    isRunning,
    start,
    stop,
    reset,
  } = usePomodoro(workSec, breakSec);

  // フェーズに応じて背景色を切り替え
  const bgClass = isWork ? 'bg-red-700' : 'bg-green-700';

  return (
    <section
      role="timer"
      className={`${bgClass} flex flex-col items-center justify-center text-white h-screen p-4`}
    >
      {/* 大きなカウントダウン表示 */}
      <Countdown time={remain} />

      {/* Start/Stop/Reset ボタン */}
      <Controls
        running={isRunning}
        onStart={start}
        onStop={stop}
        onReset={reset}
      />
    </section>
  );
};

export default PomodoroTimer;
