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
    let lastWidth = window.innerWidth;

    const handleResize = () => {
      const currentWidth = window.innerWidth;
      // Only update if width changes (prevents mobile scroll jitter)
      if (currentWidth !== lastWidth) {
        lastWidth = currentWidth;
        setWindowSize({
          width: currentWidth,
          height: window.innerHeight,
        });
      }
    };

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

    // On tablet & desktop (>= 640px), use 60% of width
    // Mobile (< 640px) stays unchanged with natural behavior/padding
    const maxWidth = width >= 640 ? Math.floor(width * 0.60) : 766;

    return Math.min(width - padding, maxWidth);
  };

  const startWidth = windowSize.width < 640
    ? Math.max(0, windowSize.width - 20) // Mobile: 20px total margin
    : Math.max(0, windowSize.width - 32); // Desktop: 32px total margin
  const targetWidth = getTextWidth(windowSize.width);
  const scrollProgress = Math.min(scrollY / (windowSize.height * 0.8), 1);

  // smooth interpolation
  const currentWidth = startWidth - ((startWidth - targetWidth) * scrollProgress);

  return (
    <section className="relative w-full bg-white">
      {/* Sticky Scroll Track - Controls duration of the sticky effect */}
      <div className="w-full h-[200vh] pt-0 sm:pt-0">
        <div className="sticky top-0 h-screen w-full flex items-start justify-center pt-1 sm:pt-2 mt-0">
          {/* Resizable Video Container */}
          <div
            ref={videoContainerRef}
            className="relative overflow-hidden rounded-xl sm:rounded-2xl shadow-sm will-change-transform"
            style={{
              width: windowSize.width ? `${currentWidth}px` : 'calc(100% - 32px)',
              height: 'auto',
              aspectRatio: windowSize.width < 640 ? '9/16' : '16/9',
              maxHeight: windowSize.width < 640 ? 'calc(100dvh - 48px)' : '76vh',
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
              <source src="/VideoIntroมหาไอเดีย.mp4" type="video/mp4" />
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
        </div>
      </div>

      {/* Content below video */}
      <div
        ref={textRef}
        className="relative z-10 px-10 sm:px-6 md:px-8 lg:px-12 pb-24 lg:pb-32"
        style={{ animationDelay: '0.3s' }}
      >
        <div className="mx-auto" style={{ maxWidth: '766px' }}>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium mb-6 sm:mb-8 text-black tracking-tight">
            ตรัง - TRANG
            <br />
            <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl opacity-80 mt-2 block">CREATIVE LEARNING HUB</span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl leading-relaxed md:leading-relaxed lg:leading-relaxed font-normal text-black">
            <span className="font-medium">มหาiDea TRANG</span> คือการรวมพลังของเมือง เพื่อทำให้ตรังดีขึ้น จากความคิดของคนตรังเอง
          </p>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl leading-relaxed md:leading-relaxed lg:leading-relaxed font-normal mt-4 sm:mt-5 md:mt-6 text-black">
            เปลี่ยนห้องสมุดแบบเดิม ให้กลายเป็น "พื้นที่พัฒนาไอเดียของเมือง" ที่ซึ่งความคิดหลากหลายจากคนต่างวัย ต่างอาชีพ จะถูกดึงเข้ามาแลกเปลี่ยนเรียนรู้
          </p>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl leading-relaxed md:leading-relaxed lg:leading-relaxed font-normal mt-4 sm:mt-5 md:mt-6 text-black">
            ห้องสมุดไม่ใช่แค่ที่เก็บความรู้ แต่คือที่ "ปล่อยพลังจากคน" เพราะทุกคนคือต้นทางของไอเดีย
          </p>
        </div>
      </div>
    </section>
  );
}
