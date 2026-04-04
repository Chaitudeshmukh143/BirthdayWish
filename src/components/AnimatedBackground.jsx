import { motion } from 'framer-motion';
import styles from './AnimatedBackground.module.css';

const orbs = [
  { className: styles.orbOne, duration: 12 },
  { className: styles.orbTwo, duration: 15 },
  { className: styles.orbThree, duration: 18 },
];

function AnimatedBackground() {
  return (
    <div className={styles.wrapper} aria-hidden="true">
      {orbs.map((orb, index) => (
        <motion.span
          key={orb.className}
          className={`${styles.orb} ${orb.className}`}
          animate={{ y: [0, -24, 0], x: [0, index % 2 === 0 ? 18 : -18, 0], scale: [1, 1.06, 1] }}
          transition={{ duration: orb.duration, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
        />
      ))}
      <div className={styles.sparkles} />
    </div>
  );
}

export default AnimatedBackground;
