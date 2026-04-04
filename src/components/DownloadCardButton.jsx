import { FiDownload } from 'react-icons/fi';
import styles from './DownloadCardButton.module.css';

function DownloadCardButton({ name }) {
  const onDownload = () => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="628" viewBox="0 0 1200 628"><defs><linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#7b2cbf"/><stop offset="50%" stop-color="#ff5fa2"/><stop offset="100%" stop-color="#ffd166"/></linearGradient></defs><rect width="1200" height="628" rx="40" fill="url(#bg)"/><circle cx="1050" cy="120" r="80" fill="rgba(255,255,255,0.18)"/><circle cx="180" cy="510" r="120" fill="rgba(255,255,255,0.12)"/><text x="90" y="210" fill="white" font-size="44" font-family="Segoe UI">A little keepsake for</text><text x="90" y="320" fill="white" font-size="84" font-weight="700" font-family="Segoe UI">Happy Birthday, ${name}</text><text x="90" y="405" fill="white" font-size="34" font-family="Segoe UI">May this year bring love, laughter, and unforgettable moments.</text><text x="90" y="520" fill="white" font-size="28" font-family="Segoe UI">Made with love on your special day.</text></svg>`;
    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${name.toLowerCase().replace(/\s+/g, '-')}-birthday-card.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return <button type="button" className={styles.button} onClick={onDownload}><FiDownload />Download Card</button>;
}

export default DownloadCardButton;
