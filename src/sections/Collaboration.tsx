import { useEffect, useRef } from 'react';

export function Collaboration() {
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
        <h2 className="text-3xl md:text-3xl lg:text-4xl font-medium tracking-tight mb-8">
          เครือข่ายความร่วมมือ (Partners)
        </h2>

        <p className="text-base md:text-lg text-black/70 mb-12 max-w-2xl mx-auto leading-relaxed">
          เทศบาลนครตรัง • มหาวิทยาลัยสงขลานครินทร์ (PSU) • PLAN TOYS • โรงแรมพาริมา
          <br />
          กลุ่มเด็กตรังอาสา • ซน space • ครอบครัวยิ้ม • ห้องสรรพของเก่า RATCHATANEE
        </p>

        <a
          href="https://www.facebook.com/share/1C56T8ZFcm/?mibextid=wwXIfr"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-8 py-3 border-2 border-black rounded-full text-base md:text-lg font-medium hover:bg-black hover:text-white transition-all duration-300"
        >
          ติดต่อสอบถาม
        </a>
      </div>
    </section>
  );
}
