import { useEffect, useRef } from 'react';

export function Footer() {
  const footerRef = useRef<HTMLDivElement>(null);

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

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <footer className="py-24 md:py-32 px-6 md:px-12 border-t border-black/10">
      <div
        ref={footerRef}
        className="max-w-4xl mx-auto text-center opacity-0"
      >
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight mb-6">
          ติดตามข่าวสาร มหาiDea
        </h2>

        <p className="text-black/60 mb-10 max-w-2xl mx-auto">
          ย่านชุมชนในตลาด และพื้นที่ตำบลห้วยยอด จังหวัดตรัง
        </p>

        <a
          href="https://www.facebook.com/share/1C56T8ZFcm/?mibextid=wwXIfr"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-8 py-3 border-2 border-black rounded-full text-base md:text-lg font-medium hover:bg-black hover:text-white transition-all duration-300"
        >
          ติดตาม
        </a>

        <div className="mt-16 pt-8 border-t border-black/10">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-sm text-black/60">
            <span>&copy; {new Date().getFullYear()} มหาiDea</span>
            <span className="hidden md:inline">|</span>
            <a
              href="#"
              className="hover:text-black transition-colors"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              Back to top
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
