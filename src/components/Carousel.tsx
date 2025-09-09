import { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import type { PanInfo } from 'framer-motion';
// replace icons with your own if needed
import { FiCircle, FiCode, FiFileText, FiLayers, FiLayout } from 'react-icons/fi';
import '../styles/Carousel.css';

export interface CarouselItem {
  title: string;
  description: string;
  id: number;
  icon: React.ReactElement;
}

export interface CarouselProps {
  items?: CarouselItem[];
  baseWidth?: number;
  autoplay?: boolean;
  autoplayDelay?: number;
  pauseOnHover?: boolean;
  loop?: boolean;
  round?: boolean;
}

const DEFAULT_ITEMS: CarouselItem[] = [
  {
    title: 'Text Animations',
    description: 'Cool text animations for your projects.',
    id: 1,
    icon: <FiFileText className="carousel-icon" />
  },
  {
    title: 'Animations',
    description: 'Smooth animations for your projects.',
    id: 2,
    icon: <FiCircle className="carousel-icon" />
  },
  {
    title: 'Components',
    description: 'Reusable components for your projects.',
    id: 3,
    icon: <FiLayers className="carousel-icon" />
  },
  {
    title: 'Backgrounds',
    description: 'Beautiful backgrounds and patterns for your projects.',
    id: 4,
    icon: <FiLayout className="carousel-icon" />
  },
  {
    title: 'Common UI',
    description: 'Common UI components are coming soon!',
    id: 5,
    icon: <FiCode className="carousel-icon" />
  }
];

// const DRAG_BUFFER = 0;
// const VELOCITY_THRESHOLD = 500;
// const GAP = 16;
// const SPRING_OPTIONS = { type: 'spring', stiffness: 300, damping: 30 };

export default function Carousel({
  items = DEFAULT_ITEMS,
  autoplay = false,
  autoplayDelay = 3000,
  pauseOnHover = false,
  loop = false,
  round = false
}: CarouselProps): React.JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const x = useMotionValue(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isResetting, setIsResetting] = useState<boolean>(false);

  const GAP = 16;
  const SPRING_OPTIONS = { type: 'spring', stiffness: 300, damping: 30 };

  // Measure container width for responsive item sizing
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const itemWidth = containerWidth ? containerWidth * 0.8 : 300; // 80% of container
  const trackItemOffset = itemWidth + GAP;

  const carouselItems = loop ? [...items, items[0]] : items;

  // Hover pause
  useEffect(() => {
    if (pauseOnHover && containerRef.current) {
      const container = containerRef.current;
      const handleMouseEnter = () => setIsHovered(true);
      const handleMouseLeave = () => setIsHovered(false);
      container.addEventListener('mouseenter', handleMouseEnter);
      container.addEventListener('mouseleave', handleMouseLeave);
      return () => {
        container.removeEventListener('mouseenter', handleMouseEnter);
        container.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, [pauseOnHover]);

  // Autoplay
  useEffect(() => {
    if (autoplay && (!pauseOnHover || !isHovered)) {
      const timer = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % carouselItems.length);
      }, autoplayDelay);
      return () => clearInterval(timer);
    }
  }, [autoplay, autoplayDelay, isHovered, loop, carouselItems.length, pauseOnHover]);

  const effectiveTransition = isResetting ? { duration: 0 } : SPRING_OPTIONS;

  const handleAnimationComplete = () => {
    if (loop && currentIndex === carouselItems.length - 1) {
      setIsResetting(true);
      x.set(0);
      setCurrentIndex(0);
      setTimeout(() => setIsResetting(false), 50);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`carousel-container ${round ? 'round' : ''}`}
      style={{ width: '100%', height: round ? itemWidth : '300px', overflow: 'hidden'}}
    >
      <motion.div
        className="carousel-track"
        drag="x"
        dragConstraints={{ left: -trackItemOffset * (carouselItems.length - 1), right: 0 }}
        style={{ x, gap: `${GAP}px`, perspective: 1000 }}
        animate={{ x: -(currentIndex * trackItemOffset) }}
        transition={effectiveTransition}
        onAnimationComplete={handleAnimationComplete}
      >
        {carouselItems.map((item, index) => (
          <motion.div
            key={index}
            className={`carousel-item ${round ? 'round' : ''}`}
            style={{
             width: itemWidth,
             height: round ? itemWidth : '100%',
              ...(round && { borderRadius: '50%' })
            }}
            transition={effectiveTransition}
          >
            <div className={`carousel-item-header ${round ? 'round' : ''}`}>
              <span className="carousel-icon-container">{item.icon}</span>
            </div>
            <div className="carousel-item-content">
              <div className="carousel-item-title">{item.title}</div>
              <p className="carousel-item-description">{item.description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Indicators */}
      <div className={`carousel-indicators-container ${round ? 'round' : ''}`}>
        <div className="carousel-indicators">
          {items.map((_, index) => (
            <motion.div
              key={index}
              className={`carousel-indicator ${currentIndex % items.length === index ? 'active' : 'inactive'}`}
              animate={{ scale: currentIndex % items.length === index ? 1.2 : 1 }}
              onClick={() => setCurrentIndex(index)}
              transition={{ duration: 0.15 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
