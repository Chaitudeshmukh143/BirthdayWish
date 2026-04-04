import { motion } from 'framer-motion';
import styles from './TimelineSection.module.css';

function TimelineSection({ items }) {
  return (
    <div className={styles.timeline}>
      {items.map((item, index) => (
        <motion.article
          key={`${item.year}-${item.title}`}
          className={styles.item}
          initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
        >
          <div className={styles.dot} />
          <div className={styles.card}>
            <span>{item.year}</span>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </div>
        </motion.article>
      ))}
    </div>
  );
}

export default TimelineSection;
