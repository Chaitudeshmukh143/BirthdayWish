import { useEffect, useMemo, useState } from 'react';
import styles from './TypingText.module.css';

function TypingText({ text, speed = 30, className = '', once = true }) {
  const [visibleLength, setVisibleLength] = useState(0);
  const displayText = useMemo(() => text.slice(0, visibleLength), [text, visibleLength]);

  useEffect(() => {
    setVisibleLength(0);
    const interval = window.setInterval(() => {
      setVisibleLength((current) => {
        if (current >= text.length) {
          if (once) {
            window.clearInterval(interval);
            return current;
          }
          return 0;
        }
        return current + 1;
      });
    }, speed);

    return () => window.clearInterval(interval);
  }, [text, speed, once]);

  return <p className={`${styles.typing} ${className}`}>{displayText}<span className={styles.cursor}>|</span></p>;
}

export default TypingText;
