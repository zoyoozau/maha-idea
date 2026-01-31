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
  const [windowHeight, setWindowHeight] = useState(0);

  useEffect(() => {
    setWindowHeight(window.innerHeight);
    
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
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

  // Calculate scale based on scroll position
  const scrollProgress = Math.min(scrollY / (windowHeight * 0.5), 1);
  const marginHorizontal = 16 + (scrollProgress * 32); // Margin from 16px to 48px (mobile: 16px, desktop: 24px)

  return (
    <section className="relative w-full bg-white">
      {/* Video Container - Not full screen with rounded corners */}
      <div 
        ref={videoContainerRef}
        className="relative w-full overflow-hidden rounded-xl sm:rounded-2xl"
        style={{
          marginLeft: `${marginHorizontal}px`,
          marginRight: `${marginHorizontal}px`,
          width: `calc(100% - ${marginHorizontal * 2}px)`,
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
        className="relative z-10 px-4 sm:px-6 md:px-8 lg:px-12 py-12 sm:py-16 md:py-20 lg:py-24 opacity-0"
        style={{ animationDelay: '0.3s' }}
      >
        <div className="max-w-4xl mx-auto">
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
