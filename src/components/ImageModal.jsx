import { AnimatePresence, motion } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import styles from './ImageModal.module.css';

function ImageModal({ selected, onClose }) {
  return (
    <AnimatePresence>
      {selected ? (
        <motion.div className={styles.backdrop} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div className={styles.modal} initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.96, opacity: 0 }} onClick={(event) => event.stopPropagation()}>
            <button type="button" className={styles.close} onClick={onClose} aria-label="Close modal"><FiX /></button>
            <img src={selected.image} alt={selected.title} />
            <div className={styles.content}>
              <h3>{selected.title}</h3>
              <p>{selected.caption}</p>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default ImageModal;
