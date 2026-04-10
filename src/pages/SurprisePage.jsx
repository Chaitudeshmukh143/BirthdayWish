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
import { birthdayVideos, featuredPhotos, highlights, memories, musicUrl, specialMessage } from '../data/content';
import { useTheme } from '../hooks/useTheme';
import styles from './SurprisePage.module.css';

const navItems = [
  { id: 'story', label: 'Story' },
  { id: 'memories', label: 'Memories' },
  { id: 'message', label: 'Message' },
  { id: 'video', label: 'Video' },
];

const burstPieces = Array.from({ length: 7 }, (_, index) => index);
const centerBurstPieces = Array.from({ length: 10 }, (_, index) => index);
const bottomBurstPieces = Array.from({ length: 22 }, (_, index) => index);
const topBurstPieces = Array.from({ length: 18 }, (_, index) => index);
const diagonalBurstPieces = Array.from({ length: 14 }, (_, index) => index);
const AUDIO_START_AT = 10;
const AUDIO_TIME_KEY = 'birthday-audio-time';

function SurprisePage() {
  const [searchParams] = useSearchParams();
  const name = searchParams.get('name') || 'Mayee';
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMobileAudioPending, setIsMobileAudioPending] = useState(false);
  const [introActive, setIntroActive] = useState(true);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(false);
  const [activeSection, setActiveSection] = useState(navItems[0].id);
  const [confettiActive, setConfettiActive] = useState(true);
  const [viewport, setViewport] = useState({ width: window.innerWidth, height: window.innerHeight });
  const { theme, toggleTheme } = useTheme();
  const audioRef = useRef(null);

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
    const introTimer = window.setTimeout(() => {
      setIntroActive(false);
      setAutoScrollEnabled(true);
    }, 10000);

    return () => window.clearTimeout(introTimer);
  }, []);

  useEffect(() => {
    const needsTapToPlay =
      window.matchMedia('(pointer: coarse)').matches || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (needsTapToPlay) {
      setIsMobileAudioPending(true);
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return undefined;
    }

    const savedTime = Number(localStorage.getItem(AUDIO_TIME_KEY) || AUDIO_START_AT);

    const syncStartTime = () => {
      const nextTime = Number.isFinite(savedTime) ? Math.max(savedTime, AUDIO_START_AT) : AUDIO_START_AT;
      try {
        audio.currentTime = nextTime;
      } catch {
        audio.currentTime = AUDIO_START_AT;
      }
    };

    const saveProgress = () => {
      localStorage.setItem(AUDIO_TIME_KEY, String(Math.max(audio.currentTime, AUDIO_START_AT)));
    };

    const restartFromOffset = () => {
      audio.currentTime = AUDIO_START_AT;
      if (isPlaying) {
        audio.play().catch(() => {
          setIsPlaying(false);
          setIsMobileAudioPending(true);
        });
      }
    };

    audio.addEventListener('loadedmetadata', syncStartTime);
    audio.addEventListener('timeupdate', saveProgress);
    audio.addEventListener('ended', restartFromOffset);

    if (audio.readyState >= 1) {
      syncStartTime();
    }

    return () => {
      audio.removeEventListener('loadedmetadata', syncStartTime);
      audio.removeEventListener('timeupdate', saveProgress);
      audio.removeEventListener('ended', restartFromOffset);
    };
  }, [isPlaying]);

  useEffect(() => {
    if (!isMobileAudioPending) {
      return undefined;
    }

    const unlockAudio = () => {
      setIsMobileAudioPending(false);
      setIsPlaying(true);
    };

    window.addEventListener('touchstart', unlockAudio, { passive: true, once: true });
    window.addEventListener('click', unlockAudio, { once: true });

    return () => {
      window.removeEventListener('touchstart', unlockAudio);
      window.removeEventListener('click', unlockAudio);
    };
  }, [isMobileAudioPending]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (isPlaying) {
      audio.play().catch(() => {
        setIsPlaying(false);
        setIsMobileAudioPending(true);
      });
      return;
    }

    audio.pause();
  }, [isPlaying]);

  useEffect(() => {
    if (!autoScrollEnabled || selectedMemory || introActive) {
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

      window.scrollBy({ top: 2, behavior: 'auto' });
    }, 24);

    return () => window.clearInterval(interval);
  }, [autoScrollEnabled, selectedMemory, introActive]);

  useEffect(() => {
    const stopAutoScroll = () => {
      setIntroActive(false);
      setAutoScrollEnabled(false);
    };

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
    if (isMobileAudioPending) {
      setIsMobileAudioPending(false);
      setIsPlaying(true);
      return;
    }

    setIsPlaying((current) => !current);
  };

  const startMobileAudio = () => {
    setIsMobileAudioPending(false);
    setIsPlaying(true);
  };

  const replayExperience = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIntroActive(true);
    setAutoScrollEnabled(false);
    setConfettiActive(true);
    window.setTimeout(() => setConfettiActive(false), 5000);
    window.setTimeout(() => {
      setIntroActive(false);
      setAutoScrollEnabled(true);
    }, 10000);
  };

  return (
    <motion.main className={styles.page} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.45 }}>
      <AnimatedBackground />
      {confettiActive ? <Confetti width={viewport.width} height={viewport.height} recycle={false} numberOfPieces={260} /> : null}
      <audio ref={audioRef} src={musicUrl} preload="auto" className={styles.hiddenAudio} />
      {isMobileAudioPending ? (
        <button type="button" className={styles.mobileMusicPrompt} onClick={startMobileAudio}>
          Tap To Start Music
        </button>
      ) : null}
      <div className={`${styles.sideBursts} ${introActive ? styles.sideBurstsActive : ''}`} aria-hidden="true">
        <div className={`${styles.burstSide} ${styles.leftBurst}`}>
          {burstPieces.map((piece) => (
            <motion.span
              key={`left-${piece}`}
              className={`${styles.burstPiece} ${piece % 3 === 0 ? styles.burstDot : piece % 3 === 1 ? styles.burstRibbon : styles.burstStar}`}
              initial={{ x: 0, y: 0, scale: 0.7, opacity: 0 }}
              animate={{
                x: 120 + piece * 18,
                y: [-36 + piece * 12, -16 + piece * 6, 12 + piece * 18],
                rotate: 24 + piece * 16,
                scale: [0.7, 1, 0.9],
                opacity: [0, 1, 0],
              }}
              transition={{ duration: 1.3, delay: piece * 0.06, ease: 'easeOut' }}
            />
          ))}
        </div>
        <div className={`${styles.burstSide} ${styles.rightBurst}`}>
          {burstPieces.map((piece) => (
            <motion.span
              key={`right-${piece}`}
              className={`${styles.burstPiece} ${piece % 3 === 0 ? styles.burstDot : piece % 3 === 1 ? styles.burstRibbon : styles.burstStar}`}
              initial={{ x: 0, y: 0, scale: 0.7, opacity: 0 }}
              animate={{
                x: -(120 + piece * 18),
                y: [-24 + piece * 10, -8 + piece * 7, 20 + piece * 16],
                rotate: -(24 + piece * 16),
                scale: [0.7, 1, 0.9],
                opacity: [0, 1, 0],
              }}
              transition={{ duration: 1.3, delay: piece * 0.06, ease: 'easeOut' }}
            />
          ))}
        </div>
        <div className={styles.bottomLeftFirework}>
          {diagonalBurstPieces.map((piece) => (
            <motion.span
              key={`diag-left-${piece}`}
              className={`${styles.burstPiece} ${piece % 2 === 0 ? styles.burstRibbon : styles.burstStar}`}
              initial={{ x: 0, y: 0, scale: 0.55, opacity: 0 }}
              animate={{
                x: 110 + piece * 18,
                y: -(120 + piece * 16),
                rotate: 28 + piece * 8,
                scale: [0.55, 1, 0.82],
                opacity: [0, 1, 0],
              }}
              transition={{ duration: 1.35, delay: piece * 0.035, ease: 'easeOut', repeat: 3, repeatDelay: 0.35 }}
            />
          ))}
        </div>
        <div className={styles.bottomRightFirework}>
          {diagonalBurstPieces.map((piece) => (
            <motion.span
              key={`diag-right-${piece}`}
              className={`${styles.burstPiece} ${piece % 2 === 0 ? styles.burstRibbon : styles.burstStar}`}
              initial={{ x: 0, y: 0, scale: 0.55, opacity: 0 }}
              animate={{
                x: -(110 + piece * 18),
                y: -(120 + piece * 16),
                rotate: -(28 + piece * 8),
                scale: [0.55, 1, 0.82],
                opacity: [0, 1, 0],
              }}
              transition={{ duration: 1.35, delay: piece * 0.035, ease: 'easeOut', repeat: 3, repeatDelay: 0.35 }}
            />
          ))}
        </div>
        <div className={styles.topBurst}>
          {topBurstPieces.map((piece) => (
            <motion.span
              key={`top-${piece}`}
              className={`${styles.burstPiece} ${piece % 3 === 0 ? styles.burstDot : piece % 3 === 1 ? styles.burstRibbon : styles.burstStar}`}
              initial={{ x: 0, y: 0, scale: 0.55, opacity: 0 }}
              animate={{
                x: -300 + piece * 34,
                y: 140 + (piece % 4) * 34,
                rotate: -120 + piece * 14,
                scale: [0.55, 1, 0.82],
                opacity: [0, 1, 0],
              }}
              transition={{ duration: 1.55, delay: piece * 0.03, ease: 'easeOut', repeat: 3, repeatDelay: 0.35 }}
            />
          ))}
        </div>
        <div className={styles.bottomBurst}>
          {bottomBurstPieces.map((piece) => (
            <motion.span
              key={`bottom-${piece}`}
              className={`${styles.burstPiece} ${piece % 3 === 0 ? styles.burstDot : piece % 3 === 1 ? styles.burstRibbon : styles.burstStar}`}
              initial={{ x: 0, y: 0, scale: 0.6, opacity: 0 }}
              animate={{
                x: -260 + piece * 24,
                y: -(190 + (piece % 5) * 40),
                rotate: -90 + piece * 10,
                scale: [0.6, 1, 0.85],
                opacity: [0, 1, 0],
              }}
              transition={{ duration: 1.55, delay: piece * 0.03, ease: 'easeOut', repeat: 3, repeatDelay: 0.35 }}
            />
          ))}
        </div>
      </div>

      <section className={`${styles.hero} ${introActive ? styles.heroFocus : ''}`}>
        {introActive ? (
          <div className={styles.centerCelebration} aria-hidden="true">
            <motion.span
              className={styles.winRing}
              initial={{ scale: 0.4, opacity: 0.8 }}
              animate={{ scale: 1.55, opacity: 0 }}
              transition={{ duration: 1.1, ease: 'easeOut', repeat: 2, repeatDelay: 0.15 }}
            />
            <motion.span
              className={styles.winRingAlt}
              initial={{ scale: 0.5, opacity: 0.7 }}
              animate={{ scale: 1.8, opacity: 0 }}
              transition={{ duration: 1.3, ease: 'easeOut', delay: 0.18, repeat: 2, repeatDelay: 0.15 }}
            />
            {centerBurstPieces.map((piece) => {
              const angle = (piece / centerBurstPieces.length) * Math.PI * 2;
              const distance = 120 + (piece % 3) * 32;
              return (
                <motion.span
                  key={`center-${piece}`}
                  className={`${styles.centerBurst} ${piece % 2 === 0 ? styles.centerBurstDot : styles.centerBurstSpark}`}
                  initial={{ x: 0, y: 0, scale: 0.4, opacity: 0 }}
                  animate={{
                    x: Math.cos(angle) * distance,
                    y: Math.sin(angle) * distance,
                    scale: [0.4, 1, 0.8],
                    opacity: [0, 1, 0],
                    rotate: [0, piece % 2 === 0 ? 80 : -80],
                  }}
                  transition={{ duration: 1.05, delay: piece * 0.05, ease: 'easeOut', repeat: 2, repeatDelay: 0.2 }}
                />
              );
            })}
          </div>
        ) : null}
        <FloatingNav items={navItems} activeSection={activeSection} onThemeToggle={toggleTheme} theme={theme} />
        <div className={styles.heroGrid}>
          <motion.div
            className={styles.heroCard}
            initial={{ y: 90, scale: 0.72, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            transition={{ duration: 0.85, type: 'spring', stiffness: 160, damping: 16 }}
          >
            <span className={styles.heroChip}>A celebration in pixels and feelings</span>
            <h1>Happy Birthday, {name}</h1>
            <TypingText text="May your day be wrapped in love, laughter, music, and the kind of joy that lingers long after the candles are out." speed={24} />
            <div className={styles.heroActions}>
              <MusicToggle isPlaying={isPlaying} onToggle={toggleAudio} />
              <a href="#memories" className={styles.secondaryAction}>Explore Memories<FiArrowUpRight /></a>
            </div>
          </motion.div>
          <motion.div
            className={styles.statCard}
            initial={{ scale: 0.8, opacity: 0, y: 70 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.8, type: 'spring', stiffness: 150, damping: 16, delay: 0.08 }}
          >
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

      <div className={introActive ? styles.blurredContent : ''}>
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
                <video preload="metadata" loop autoPlay muted playsInline>
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
      </div>

      <ImageModal selected={selectedMemory} onClose={() => setSelectedMemory(null)} />
    </motion.main>
  );
}

export default SurprisePage;
