import { useState, useRef, useEffect, useCallback } from 'react';

interface UsePomodoroReturn {
  isRunning: boolean;
  isWork: boolean;
  remain: number;
  start: () => void;
  stop: () => void;
  reset: () => void;
}

/**
 * usePomodoro Hook
 * @param workSec - 作業フェーズの秒数 (デフォルト 25*60)
 * @param breakSec - 休憩フェーズの秒数 (デフォルト 5*60)
 */
export function usePomodoro(
  workSec: number = 25 * 60,
  breakSec: number = 5 * 60
): UsePomodoroReturn {
  const [isRunning, setIsRunning] = useState(false);
  const [isWork, setIsWork] = useState(true);
  const [remain, setRemain] = useState(workSec);

  // 終了予定時刻を保持する ref
  const targetRef = useRef<number | null>(null);

  // 通知権限をオンマウント時にリクエスト
  useEffect(() => {
    if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // タイマー本体の処理
  useEffect(() => {
    if (!isRunning) return;

    const id = window.setInterval(() => {
      if (targetRef.current === null) return;

      const diffSec = Math.round((targetRef.current - Date.now()) / 1000);
      if (diffSec >= 0) {
        setRemain(diffSec);
      } else {
        // フェーズ終了
        if (Notification.permission === 'granted') {
          new Notification(isWork ? '休憩タイム！' : '作業再開！');
        }

        const nextIsWork = !isWork;
        const nextDur = nextIsWork ? workSec : breakSec;

        setIsWork(nextIsWork);
        setRemain(nextDur);
        targetRef.current = Date.now() + nextDur * 1000;
      }
    }, 1000);

    return () => window.clearInterval(id);
  }, [isRunning, isWork, workSec, breakSec]);

  // タイマー開始
  const start = useCallback(() => {
    if (isRunning) return;
    setIsRunning(true);
    if (targetRef.current === null) {
      targetRef.current = Date.now() + remain * 1000;
    }
  }, [isRunning, remain]);

  // タイマー停止
  const stop = useCallback(() => {
    if (!isRunning) return;
    setIsRunning(false);
    if (targetRef.current !== null) {
      const diffSec = Math.max(
        0,
        Math.round((targetRef.current - Date.now()) / 1000)
      );
      setRemain(diffSec);
    }
    targetRef.current = null;
  }, [isRunning]);

  // リセット（作業フェーズに戻す）
  const reset = useCallback(() => {
    setIsRunning(false);
    setIsWork(true);
    setRemain(workSec);
    targetRef.current = null;
  }, [workSec]);

  return { isRunning, isWork, remain, start, stop, reset };
}
