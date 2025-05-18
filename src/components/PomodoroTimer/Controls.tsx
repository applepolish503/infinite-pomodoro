import React from 'react';
import styles from './styles.module.css';

interface ControlsProps {
  running: boolean;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
}

const Controls: React.FC<ControlsProps> = ({
  running,
  onStart,
  onStop,
  onReset,
}) => {
  return (
    <div className={styles.controls}>
      {running ? (
        <button onClick={onStop} className={`${styles.button} ${styles.stop}`}>
          Stop
        </button>
      ) : (
        <button onClick={onStart} className={`${styles.button} ${styles.start}`}>
          Start
        </button>
      )}
      <button onClick={onReset} className={`${styles.button} ${styles.reset}`}>
        Reset
      </button>
    </div>
  );
};

export default Controls;
