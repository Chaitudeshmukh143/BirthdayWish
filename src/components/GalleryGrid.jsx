import { motion } from 'framer-motion';
import styles from './GalleryGrid.module.css';

function GalleryGrid({ memories, onSelect }) {
  return (
    <div className={styles.grid}>
      {memories.map((memory, index) => (
        <motion.button
          type="button"
          key={memory.id}
          className={styles.card}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45, delay: index * 0.05 }}
          onClick={() => onSelect(memory)}
        >
          <img src={memory.image} alt={memory.title} loading="lazy" />
          <div className={styles.overlay}>
            <h3>{memory.title}</h3>
            <p>{memory.caption}</p>
          </div>
        </motion.button>
      ))}
    </div>
  );
}

export default GalleryGrid;
