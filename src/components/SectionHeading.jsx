import { motion } from 'framer-motion';
import styles from './SectionHeading.module.css';

function SectionHeading({ eyebrow, title, text }) {
  return (
    <motion.div className={styles.heading} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6 }}>
      <span>{eyebrow}</span>
      <h2>{title}</h2>
      <p>{text}</p>
    </motion.div>
  );
}

export default SectionHeading;
