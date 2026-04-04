import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { Link, useSearchParams } from 'react-router-dom';
import AnimatedBackground from '../components/AnimatedBackground';
import styles from './LandingPage.module.css';

function LandingPage() {
  const [searchParams] = useSearchParams();
  const name = searchParams.get('name') || 'Bestie';

  return (
    <motion.main className={styles.page} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.45 }}>
      <AnimatedBackground />
      <section className={styles.hero}>
        <motion.div className={styles.card} initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.75, ease: 'easeOut' }}>
          <span className={styles.eyebrow}>Made just for you</span>
          <h1>Happy Birthday {name} 🎉</h1>
          <p>A small digital universe filled with warm memories, kind words, music, and a little sparkle to celebrate someone truly special.</p>
          <Link to={`/surprise?name=${encodeURIComponent(name)}`} className={styles.cta}>
            Open Your Surprise 🎁
            <FiArrowRight />
          </Link>
        </motion.div>
      </section>
    </motion.main>
  );
}

export default LandingPage;
