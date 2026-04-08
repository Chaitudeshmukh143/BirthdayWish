import { useLayoutEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { Link, useSearchParams } from 'react-router-dom';
import AnimatedBackground from '../components/AnimatedBackground';
import styles from './LandingPage.module.css';

function LandingPage() {
  const [searchParams] = useSearchParams();
  const name = searchParams.get('name') || 'Mayee';
  const playgroundRef = useRef(null);
  const noButtonRef = useRef(null);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });

  useLayoutEffect(() => {
    const resetPosition = () => setNoPosition({ x: 0, y: 0 });
    resetPosition();
    window.addEventListener('resize', resetPosition);
    return () => window.removeEventListener('resize', resetPosition);
  }, []);

  const moveNoButton = (event) => {
    const area = playgroundRef.current;
    const button = noButtonRef.current;

    if (!area || !button) {
      return;
    }

    const areaRect = area.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();
    const pointerX = event.clientX ?? areaRect.left + areaRect.width / 2;
    const pointerY = event.clientY ?? areaRect.top + areaRect.height / 2;
    const maxX = Math.max(0, areaRect.width - buttonRect.width);
    const maxY = Math.max(0, areaRect.height - buttonRect.height);
    const currentLeft = buttonRect.left - areaRect.left;
    const currentTop = buttonRect.top - areaRect.top;
    const horizontalDirection = pointerX < buttonRect.left + buttonRect.width / 2 ? 1 : -1;
    const verticalDirection = pointerY < buttonRect.top + buttonRect.height / 2 ? 1 : -1;
    const nextLeft = Math.min(maxX, Math.max(0, currentLeft + horizontalDirection * 150));
    const nextTop = Math.min(maxY, Math.max(0, currentTop + verticalDirection * 95));

    setNoPosition({ x: nextLeft, y: nextTop });
  };

  return (
    <motion.main
      className={styles.page}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45 }}
    >
      <AnimatedBackground />
      <section className={styles.hero}>
        <motion.div
          className={styles.card}
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.75, ease: 'easeOut' }}
        >
          <span className={styles.eyebrow}>Made just for you</span>
          <h1>Happy Birthday {name} &#127881;</h1>
          <p>
            A small digital universe filled with warm memories, kind words, music, and a little
            sparkle to celebrate someone truly special.
          </p>
          <div className={styles.actions} ref={playgroundRef}>
            <Link to={`/surprise?name=${encodeURIComponent(name)}`} className={styles.cta}>
              Open Your Surprise &#127873;
              <FiArrowRight />
            </Link>
            <motion.button
              ref={noButtonRef}
              type="button"
              className={styles.noButton}
              animate={{ x: noPosition.x, y: noPosition.y }}
              transition={{ type: 'spring', stiffness: 420, damping: 14 }}
              onMouseEnter={moveNoButton}
              onMouseMove={moveNoButton}
              onFocus={moveNoButton}
              onTouchStart={moveNoButton}
            >
              No
            </motion.button>
          </div>
        </motion.div>
      </section>
    </motion.main>
  );
}

export default LandingPage;
