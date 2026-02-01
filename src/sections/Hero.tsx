import { useEffect, useRef, useState } from 'react';
import { Play } from 'lucide-react';

interface HeroProps {
  scrollY: number;
}

export function Hero({ scrollY }: HeroProps) {
  const textRef = useRef<HTMLDivElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    if (textRef.current) {
      observer.observe(textRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  /* 
    Calculate video width based on scroll position 
    Target is to match the text container width at the end of scroll
    Text container: max-w-4xl (896px) with responsive padding
    px-4 (16px) -> sm:px-6 (24px) -> md:px-8 (32px) -> lg:px-12 (48px)
  */

  const getTextWidth = (width: number) => {
    let padding = 200; // Mobile: 200px total (100px each side)
    if (width >= 1024) padding = 96; // lg:px-12 * 2
    else if (width >= 768) padding = 64; // md:px-8 * 2
    else if (width >= 640) padding = 48; // sm:px-6 * 2

    return Math.min(width - padding, 766);
  };

  const startWidth = windowSize.width < 640
    ? Math.max(0, windowSize.width - 20) // Mobile: 20px total margin
    : Math.max(0, windowSize.width - 32); // Desktop: 32px total margin
  const targetWidth = getTextWidth(windowSize.width);
  const scrollProgress = Math.min(scrollY / (windowSize.height * 0.5), 1);

  // smooth interpolation
  const currentWidth = startWidth - ((startWidth - targetWidth) * scrollProgress);

  return (
    <section className="relative w-full bg-white flex flex-col items-center">
      {/* Video Container */}
      <div
        ref={videoContainerRef}
        className="relative overflow-hidden rounded-xl sm:rounded-2xl shadow-sm will-change-transform"
        style={{
          width: windowSize.width ? `${currentWidth}px` : 'calc(100% - 32px)',
          height: 'auto',
          aspectRatio: '16/9',
          maxHeight: '70vh',
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>

        {/* Play button overlay */}
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/10 hover:bg-black/20 transition-colors group"
        >
          <div className={`w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-white/90 flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
            <Play className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-black ml-0.5 sm:ml-1" fill="currentColor" />
          </div>
        </button>
      </div>

      {/* Content below video */}
      <div
        ref={textRef}
        className="relative z-10 px-[100px] sm:px-6 md:px-8 lg:px-12 py-12 sm:py-16 md:py-20 lg:py-24"
        style={{ animationDelay: '0.3s' }}
      >
        <div className="mx-auto" style={{ maxWidth: '766px' }}>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl leading-relaxed md:leading-relaxed lg:leading-relaxed font-normal text-black">
            <span className="font-medium">ONE</span> is a close circle of established studios making unconventional work at scale.
          </p>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl leading-relaxed md:leading-relaxed lg:leading-relaxed font-normal mt-4 sm:mt-5 md:mt-6 text-black">
            Our holistic approach brings together strategy, creative and production, combining focused research and bespoke tools to build hybrid worlds in physical and digital space.
          </p>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl leading-relaxed md:leading-relaxed lg:leading-relaxed font-normal mt-4 sm:mt-5 md:mt-6 text-black">
            <span className="font-medium">ONE</span> is mutually owned and horizontally structured: a working model intended for range and transparency.
          </p>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl leading-relaxed md:leading-relaxed lg:leading-relaxed font-normal mt-4 sm:mt-5 md:mt-6 text-black">
            We think in multiple languages and time zones, harnessing an evolving roster of disciplines to conceive and generate immersive experiences beyond what is possible alone.
          </p>
        </div>
      </div>
    </section>
  );
}
