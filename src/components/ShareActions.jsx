import { FiInstagram, FiSend, FiShare2 } from 'react-icons/fi';
import styles from './ShareActions.module.css';

function ShareActions({ name }) {
  const shareText = `Come celebrate ${name}'s special day with this birthday surprise.`;

  const onShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: `Happy Birthday ${name}`, text: shareText, url: window.location.href });
      return;
    }
    await navigator.clipboard.writeText(window.location.href);
  };

  return (
    <div className={styles.actions}>
      <a href={`https://wa.me/?text=${encodeURIComponent(`${shareText} ${window.location.href}`)}`} target="_blank" rel="noreferrer"><FiSend />WhatsApp</a>
      <a href="https://www.instagram.com/" target="_blank" rel="noreferrer"><FiInstagram />Instagram</a>
      <button type="button" onClick={onShare}><FiShare2 />Share Link</button>
    </div>
  );
}

export default ShareActions;
