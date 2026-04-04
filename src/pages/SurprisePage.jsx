import { useEffect, useMemo, useRef, useState } from 'react';
import Confetti from 'react-confetti';
import { motion } from 'framer-motion';
import { FiArrowUpRight, FiRefreshCw } from 'react-icons/fi';
import { useSearchParams } from 'react-router-dom';
import AnimatedBackground from '../components/AnimatedBackground';
import DownloadCardButton from '../components/DownloadCardButton';
import FloatingNav from '../components/FloatingNav';
import GalleryGrid from '../components/GalleryGrid';
import ImageModal from '../components/ImageModal';
import MusicToggle from '../components/MusicToggle';
import SectionHeading from '../components/SectionHeading';
import ShareActions from '../components/ShareActions';
import TypingText from '../components/TypingText';
import { birthdayVideos, featuredPhotos, highlights, memories, specialMessage, youtubeMusicId } from '../data/content';
import { useTheme } from '../hooks/useTheme';
import styles from './SurprisePage.module.css';

const navItems = [
  { id: 'story', label: 'Story' },
  { id: 'memories', label: 'Memories' },
  { id: 'message', label: 'Message' },
  { id: 'video', label: 'Video' },
];

function SurprisePage() {
  const [searchParams] = useSearchParams();
  const name = searchParams.get('name') || 'Bestie';
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
  const [activeSection, setActiveSection] = useState(navItems[0].id);
  const [confettiActive, setConfettiActive] = useState(true);
  const [viewport, setViewport] = useState({ width: window.innerWidth, height: window.innerHeight });
  const { theme, toggleTheme } = useTheme();

  const highlightedMessage = useMemo(() => specialMessage.split(new RegExp(`(${highlights.join('|')})`, 'gi')), []);

  useEffect(() => {
    const onResize = () => setViewport({ width: window.innerWidth, height: window.innerHeight });
    const onScroll = () => {
      const sections = navItems.map((item) => document.getElementById(item.id)).filter(Boolean);
      const current = sections.find((section) => {
        const bounds = section.getBoundingClientRect();
        return bounds.top <= 120 && bounds.bottom >= 140;
      });
      if (current) setActiveSection(current.id);
    };

    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => setConfettiActive(false), 6000);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    setIsPlaying(true);
  }, []);

  useEffect(() => {
    if (!autoScrollEnabled || selectedMemory) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      const reachedBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;

      if (reachedBottom) {
        window.clearInterval(interval);
        setAutoScrollEnabled(false);
        return;
      }

      window.scrollBy({ top: 1, behavior: 'auto' });
    }, 28);

    return () => window.clearInterval(interval);
  }, [autoScrollEnabled, selectedMemory]);

  useEffect(() => {
    const stopAutoScroll = () => setAutoScrollEnabled(false);

    window.addEventListener('wheel', stopAutoScroll, { passive: true });
    window.addEventListener('touchstart', stopAutoScroll, { passive: true });
    window.addEventListener('mousedown', stopAutoScroll);
    window.addEventListener('keydown', stopAutoScroll);

    return () => {
      window.removeEventListener('wheel', stopAutoScroll);
      window.removeEventListener('touchstart', stopAutoScroll);
      window.removeEventListener('mousedown', stopAutoScroll);
      window.removeEventListener('keydown', stopAutoScroll);
    };
  }, []);

  const toggleAudio = () => {
    setIsPlaying((current) => !current);
  };

  const replayExperience = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setAutoScrollEnabled(true);
    setConfettiActive(true);
    window.setTimeout(() => setConfettiActive(false), 5000);
  };

  return (
    <motion.main className={styles.page} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.45 }}>
      <AnimatedBackground />
      {confettiActive ? <Confetti width={viewport.width} height={viewport.height} recycle={false} numberOfPieces={260} /> : null}
      {isPlaying ? (
        <div className={styles.youtubePlayer} aria-hidden="true">
          <iframe
            src={`https://www.youtube.com/embed/${youtubeMusicId}?autoplay=1&loop=1&playlist=${youtubeMusicId}&controls=0&disablekb=1&fs=0&modestbranding=1&rel=0`}
            title="Background music player"
            allow="autoplay; encrypted-media"
          />
        </div>
      ) : null}

      <section className={styles.hero}>
        <FloatingNav items={navItems} activeSection={activeSection} onThemeToggle={toggleTheme} theme={theme} />
        <div className={styles.heroGrid}>
          <motion.div className={styles.heroCard} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.65 }}>
            <span className={styles.heroChip}>A celebration in pixels and feelings</span>
            <h1>Happy Birthday, {name}</h1>
            <TypingText text="May your day be wrapped in love, laughter, music, and the kind of joy that lingers long after the candles are out." speed={24} />
            <div className={styles.heroActions}>
              <MusicToggle isPlaying={isPlaying} onToggle={toggleAudio} />
              <a href="#memories" className={styles.secondaryAction}>Explore Memories<FiArrowUpRight /></a>
            </div>
          </motion.div>
          <motion.div className={styles.statCard} initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.65, delay: 0.1 }}>
            <div className={styles.photoStack}>
              {featuredPhotos.map((photo, index) => (
                <img
                  key={photo}
                  src={photo}
                  alt={`Portrait memory ${index + 1}`}
                  className={styles.heroPhoto}
                  loading="lazy"
                />
              ))}
            </div>
            <p>Birthday Mood</p>
            <strong>100% adored</strong>
            <span>Collected smiles, tiny sparks, soft songs, and favorite memories.</span>
            <div className={styles.badges}><span>Celebratory</span><span>Heartfelt</span><span>Replayable</span></div>
          </motion.div>
        </div>
      </section>

      <section id="story" className={styles.section}>
        <SectionHeading eyebrow="Surprise Reveal" title="A little digital celebration, just for you" text="The message unfolds slowly, just like the best moments do." />
        <div className={styles.panel}>
          <TypingText text={`Dear ${name}, today is all about celebrating your beautiful heart, your bright energy, and the way you make the world feel softer and brighter for everyone lucky enough to know you.`} speed={22} className={styles.storyText} />
        </div>
      </section>

      <section id="memories" className={styles.section}>
        <SectionHeading eyebrow="Memory Gallery" title="Snapshots of a beautiful journey" text="A gallery designed like a keepsake wall, ready to open and relive." />
        <GalleryGrid memories={memories} onSelect={setSelectedMemory} />
      </section>

      <section id="message" className={styles.section}>
        <SectionHeading eyebrow="Special Message" title="Words that belong to your day" text="A longer note filled with all the things worth remembering." />
        <div className={styles.messageCard}>
          {highlightedMessage.map((part, index) => {
            const matched = highlights.some((word) => word.toLowerCase() === part.toLowerCase());
            return matched ? <motion.span key={`${part}-${index}`} className={styles.highlight} animate={{ backgroundPositionX: ['0%', '100%'] }} transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: 'linear' }}>{part}</motion.span> : <span key={`${part}-${index}`}>{part}</span>;
          })}
        </div>
      </section>

      <section id="video" className={styles.section}>
        <SectionHeading eyebrow="Video Wish" title="Her special moments, right inside the page" text="All six videos are shown here as part of one memory wall." />
        <div className={styles.videoStack}>
          <div className={styles.videoGrid}>
            {birthdayVideos.map((video) => (
              <div key={video.id} className={styles.videoCard}>
                <video controls preload="metadata" loop autoPlay muted playsInline>
                  <source src={video.src} type="video/mp4" />
                </video>
                <span>Memory</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.finalSection}`}>
        <div className={styles.finalCard}>
          <p>Final Wish</p>
          <h2>
            Once again, Happy Birthday <span aria-hidden="true">&hearts;</span>
          </h2>
          <span>May this next chapter be filled with beautiful surprises, deep peace, and moments that make your heart feel full.</span>
          <div className={styles.finalActions}>
            <button type="button" className={styles.replayButton} onClick={replayExperience}><FiRefreshCw />Replay Memories</button>
            <DownloadCardButton name={name} />
          </div>
          <ShareActions name={name} />
        </div>
      </section>

      <ImageModal selected={selectedMemory} onClose={() => setSelectedMemory(null)} />
    </motion.main>
  );
}

export default SurprisePage;
