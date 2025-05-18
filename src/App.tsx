import { useEffect, useRef, useState } from 'react';

const WORK_SEC  = 25 * 60;
const BREAK_SEC = 5  * 60;

export default function InfinitePomodoro() {
  // --- 状態 ---
  const [isRunning,  setIsRunning]  = useState(false);
  const [isWork,     setIsWork]     = useState(true);
  const [remainSec,  setRemainSec]  = useState(WORK_SEC);

  // 「終了予定時刻」を ref に保持（再レンダリング不要なので useRef）
  const targetMsRef = useRef<number | null>(null);

  // --- ボタン処理 ---
  const start = () => {
    if (isRunning) return; // 連打防止
    setIsRunning(true);

    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // 初回 or Pause 解除時：target が null なら新しく設定
    if (targetMsRef.current === null) {
      targetMsRef.current = Date.now() + remainSec * 1000;
    }
  };

  const stop = () => {
    if (!isRunning) return;
    setIsRunning(false);
    // pause 時は今の残り秒だけ計算して保持
    setRemainSec(Math.max(0, Math.round((targetMsRef.current! - Date.now()) / 1000)));
    targetMsRef.current = null;
  };

  const reset = () => {
    setIsRunning(false);
    setIsWork(true);
    setRemainSec(WORK_SEC);
    targetMsRef.current = null;
  };

  // --- タイマー 1 秒刻み ---
  useEffect(() => {
    if (!isRunning) return;

    const id = setInterval(() => {
      const remain = Math.round((targetMsRef.current! - Date.now()) / 1000);

      if (remain >= 0) {
        setRemainSec(remain);
      } else {
        // フェーズ終了！
        notify();                       // ブラウザ通知
        const nextIsWork = !isWork;
        const nextDur    = nextIsWork ? WORK_SEC : BREAK_SEC;

        setIsWork(nextIsWork);
        setRemainSec(nextDur);
        targetMsRef.current = Date.now() + nextDur * 1000; // 自動で次フェーズへ
      }
    }, 1000);

    return () => clearInterval(id); // クリーンアップ
  }, [isRunning, isWork]);

  // --- 通知（Permission は初回 start で要求してもよい） ---
  const notify = () => {
    if (Notification.permission === 'granted') {
      new Notification(isWork ? '休憩しましょう！' : '作業に戻りましょう！');
    }
  };

  // --- 秒を mm:ss へ ---
  const mmss = new Date(remainSec * 1000).toISOString().substr(14, 5);

  // --- 背景色切替用スタイル ---
  const bgStyle = { backgroundColor: isWork ? '#aa2222' : '#228822', height: '100vh' };

  return (
    <div style={bgStyle} className="flex flex-col items-center justify-center text-white">
      <h1 className="text-8xl font-mono mb-8">{mmss}</h1>

      <div className="space-x-4">
        <button onClick={start} className="px-6 py-2 bg-blue-600 rounded">Start</button>
        <button onClick={stop}  className="px-6 py-2 bg-yellow-600 rounded">Stop</button>
        <button onClick={reset} className="px-6 py-2 bg-gray-600  rounded">Reset</button>
      </div>
    </div>
  );
}
