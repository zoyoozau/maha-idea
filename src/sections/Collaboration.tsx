import { useEffect, useRef } from 'react';

interface CollaborationProps {
  onGetInTouch: () => void;
}

export function Collaboration({ onGetInTouch }: CollaborationProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

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
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-24 md:py-32 px-6 md:px-12">
      <div 
        ref={sectionRef}
        className="max-w-4xl mx-auto text-center opacity-0"
      >
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-12">
          ONE is collaboration
        </h2>
        
        <button
          onClick={onGetInTouch}
          className="inline-flex items-center px-8 py-3 border-2 border-black rounded-full text-base md:text-lg font-medium hover:bg-black hover:text-white transition-all duration-300"
        >
          Get in Touch
        </button>
      </div>
    </section>
  );
}
