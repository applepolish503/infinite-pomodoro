import React from 'react';
import styles from './styles.module.css';

interface CountdownProps {
  time: number; // seconds remaining
}

const Countdown: React.FC<CountdownProps> = ({ time }) => {
  // 秒数を mm:ss フォーマットに変換
  const mmss = new Date(time * 1000).toISOString().substr(14, 5);
  return <div className={styles.countdown}>{mmss}</div>;
};

export default Countdown;