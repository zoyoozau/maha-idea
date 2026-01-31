import { useEffect, useRef } from 'react';

const studios = [
  { name: 'Nic Hamilton', url: 'https://nichamilton.com' },
  { name: 'Traum Inc', url: 'https://trauminc.com' },
  { name: 'Valtteri Laihanen', url: 'https://valtterilaihanen.com' },
  { name: 'International Magic', url: 'https://internationalmagic.com' },
  { name: 'The Experience Machine', url: 'https://theexperiencemachine.com' },
  { name: 'Novembre Global', url: 'https://novembreglobal.com' },
];

export function Studios() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const buttons = entry.target.querySelectorAll('.studio-item');
            buttons.forEach((btn, index) => {
              setTimeout(() => {
                btn.classList.add('animate-fade-in-up');
              }, index * 100);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="py-16 md:py-24 px-6 md:px-12"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap gap-4 md:gap-6">
          {studios.map((studio) => (
            <a
              key={studio.name}
              href={studio.url}
              target="_blank"
              rel="noopener noreferrer"
              className="studio-item studio-btn opacity-0 inline-flex items-center px-5 py-2.5 border border-black rounded-full text-sm md:text-base font-medium hover:bg-black hover:text-white transition-all duration-300"
            >
              {studio.name}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
