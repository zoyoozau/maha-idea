import { useEffect, useRef, useMemo } from 'react';

interface WordCloudProps {
  scrollY: number;
}

const words = [
  'fluid', 'terrain', 'listening', 'a platform', 'protein', 'universal',
  'branching', 'generative', 'rendering', 'animation', 'structure', 'building',
  'R&D', 'applications', 'here today gone tomorrow', 'decentralised', 'yes and no',
  'BIPP', 'a moment', 'doing better', 'capturing', 'a window', 'bits',
  'narrative spaces', 'coming together', 'not there', 'art', 'famous', 'global',
  'virtual', 'generalist', 'engaged', 'exhibitions', 'unexpected', 'yottabytes',
  'an edge', 'form', 'not an angel', 'points', 'meshed reality', 'platforms',
  'iterating', 'what you don\'t need yet', 'learning', 'speculative', 'at home anywhere',
  'in fashion', 'in sync', 'learning by making', 'culture', 'open', 'realtime',
  'physical', 'cells', 'high resolution', 'dots', 'future audiences', 'all of the above', 'light'
];

export function WordCloud({ scrollY }: WordCloudProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const wordStyles = useMemo(() => {
    return words.map((_, index) => {
      const sizes = ['text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl'];
      const weights = ['font-light', 'font-normal', 'font-medium'];
      const sizeIndex = (index * 7 + Math.floor(Math.random() * 3)) % sizes.length;
      const weightIndex = (index * 3 + Math.floor(Math.random() * 2)) % weights.length;
      
      return {
        size: sizes[sizeIndex],
        weight: weights[weightIndex],
      };
    });
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const containerTop = containerRect.top + scrollY;
    const containerHeight = containerRect.height;
    const windowHeight = window.innerHeight;

    const scrollProgress = Math.max(0, Math.min(1, 
      (scrollY - containerTop + windowHeight) / (containerHeight + windowHeight)
    ));

    wordRefs.current.forEach((wordEl, index) => {
      if (!wordEl) return;
      
      const wordProgress = (index / words.length);
      const offset = (scrollProgress - wordProgress) * 100;
      const opacity = Math.max(0.3, Math.min(1, 1 - Math.abs(offset) / 50));
      const translateY = offset * 0.3;
      
      wordEl.style.opacity = String(opacity);
      wordEl.style.transform = `translateY(${translateY}px)`;
    });
  }, [scrollY]);

  return (
    <section 
      ref={containerRef}
      className="py-16 md:py-24 px-6 md:px-12 min-h-[80vh] flex items-center"
    >
      <div className="max-w-6xl mx-auto w-full">
        <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-3 md:gap-x-6 md:gap-y-4">
          {words.map((word, index) => (
            <span
              key={word}
              ref={(el) => { wordRefs.current[index] = el; }}
              className={`word-cloud-item ${wordStyles[index].size} ${wordStyles[index].weight} text-black/80 cursor-default whitespace-nowrap transition-all duration-300`}
              style={{ opacity: 0.6 }}
            >
              {word}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
