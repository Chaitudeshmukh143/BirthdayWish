import { FiGift, FiHeart, FiImage, FiMoon, FiSun, FiVideo } from 'react-icons/fi';
import styles from './FloatingNav.module.css';

const icons = { story: <FiGift />, memories: <FiImage />, message: <FiHeart />, video: <FiVideo /> };

function FloatingNav({ items, activeSection, onThemeToggle, theme }) {
  return (
    <div className={styles.wrapper}>
      <nav className={styles.nav}>
        {items.map((item) => (
          <a key={item.id} href={`#${item.id}`} className={activeSection === item.id ? styles.active : ''}>
            {icons[item.id]}
            <span>{item.label}</span>
          </a>
        ))}
      </nav>
      <button type="button" className={styles.themeToggle} onClick={onThemeToggle}>
        {theme === 'dark' ? <FiSun /> : <FiMoon />}
      </button>
    </div>
  );
}

export default FloatingNav;
