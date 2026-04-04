import { FiPause, FiPlay, FiVolume2 } from 'react-icons/fi';
import styles from './MusicToggle.module.css';

function MusicToggle({ isPlaying, onToggle }) {
  return (
    <button type="button" className={styles.button} onClick={onToggle}>
      <span className={styles.icon}>{isPlaying ? <FiPause /> : <FiPlay />}</span>
      <span>{isPlaying ? 'Pause Music' : 'Play Music'}</span>
      <FiVolume2 className={styles.volume} />
    </button>
  );
}

export default MusicToggle;
