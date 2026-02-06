import { useEffect, useRef, useState } from 'react';

interface Work {
  title: string;
  studio: string;
  image: string;
}

const works: Work[] = [
  {
    title: 'ทักษะใหม่',
    studio: 'Digital Skills (พี่หมู)',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80'
  },
  {
    title: 'แม่ปลูกผัก',
    studio: 'Health & Learning',
    image: 'https://images.unsplash.com/photo-1592419044706-39796d40f98c?w=800&q=80'
  },
  {
    title: 'Graphic Design',
    studio: 'Canva Course (น้องเจน)',
    image: 'https://images.unsplash.com/photo-1626785774573-4b799314346d?w=800&q=80'
  },
  {
    title: 'Community Events',
    studio: 'คนคอเดียวกัน',
    image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80'
  }
];

export function Works() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-index'));
            setVisibleItems((prev) => new Set([...prev, index]));
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -100px 0px' }
    );

    const items = sectionRef.current?.querySelectorAll('.work-item');
    items?.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-24 px-6 md:px-12"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {works.map((work, index) => (
            <div
              key={work.title}
              data-index={index}
              className={`work-item group cursor-pointer transition-all duration-700 ${visibleItems.has(index)
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-12'
                }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="relative overflow-hidden rounded-lg aspect-[4/3] mb-4">
                <img
                  src={work.image}
                  alt={work.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg md:text-xl font-medium group-hover:opacity-70 transition-opacity">
                  {work.title}
                </h3>
                <p className="text-sm text-black/60">
                  by {work.studio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
