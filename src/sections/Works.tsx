import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HumanBook {
  [key: string]: string;
}

export function Works() {
  const sectionRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const [books, setBooks] = useState<HumanBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-index'));
            setVisibleItems((prev) => new Set([...prev, index]));
            // Don't unobserve immediately to allow re-animation if needed, or keep logic simple
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const items = sectionRef.current?.querySelectorAll('.work-item');
    items?.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, [books]); // Re-run observer when books load or view changes

  const fetchBooks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://script.google.com/macros/s/AKfycbz1woByK6eWQJcGU2hwv2rclcTl8pS57zUrwkwUzD6v-PRk3GZE-KiAF4vFwQhgo24cyw/exec');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      setBooks(data);
    } catch (err) {
      setError('ไม่สามารถโหลดข้อมูลได้ในขณะนี้');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (url: string) => {
    if (!url) return '';
    if (url.includes('drive.google.com')) {
      const idMatch = url.match(/id=([^&]+)/);
      if (idMatch) {
        return `https://lh3.googleusercontent.com/d/${idMatch[1]}`;
      }
    }
    return url;
  };

  const getValue = (book: HumanBook, ...keys: string[]) => {
    for (const key of keys) {
      if (book[key]) return book[key];
      const trimmedKey = Object.keys(book).find(k => k.trim() === key.trim());
      if (trimmedKey && book[trimmedKey]) return book[trimmedKey];
    }
    return '';
  };

  return (
    <section
      id="human-books"
      ref={sectionRef}
      className="py-16 md:py-24 px-6 md:px-12 bg-gray-50/50"
    >
      <div className="max-w-6xl mx-auto min-h-[500px]">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-12 text-[#5301bb] tracking-tight">
          หนังสือคน
        </h2>
        {loading ? (
          <div className="flex flex-col items-center justify-center h-96">
            <Loader2 className="w-12 h-12 animate-spin text-[#5301bb]" />
            <p className="mt-4 text-gray-500 font-medium">กำลังโหลดหนังสือคน...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-96 text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={fetchBooks}
              className="px-6 py-2 bg-[#5301bb] text-white rounded-full hover:bg-[#420195] transition-colors"
            >
              ลองใหม่อีกครั้ง
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {books.map((book, index) => {
              const title = getValue(book, 'ชื่อหนังสือ', 'Title', 'ชื่อเรื่อง');
              const description = getValue(book, 'สิ่งที่อยากแบ่งปัน', 'ประวัติโดยย่อ', 'Description');
              const _category = getValue(book, 'หมวดหมู่', 'Category');
              const image1 = getImageUrl(getValue(book, 'รูปภาพตัวเองรูปที่ 1', 'Image', 'image', 'รูปภาพ'));

              return (
                <div
                  key={index}
                  data-index={index}
                  onClick={() => navigate(`/human-book/${index}`)}
                  className={`work-item group cursor-pointer transition-all duration-700 ${visibleItems.has(index)
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-12'
                    }`}
                  style={{ transitionDelay: `${(index % 4) * 100}ms` }}
                >
                  <div className="relative overflow-hidden rounded-2xl aspect-[4/3] mb-6 shadow-sm border border-gray-100">
                    {image1 ? (
                      <img
                        src={image1}
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                        <span className="text-5xl">📚</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                    <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-xs font-semibold text-[#5301bb] shadow-sm opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      อ่านเพิ่มเติม
                    </div>
                  </div>
                  <div className="space-y-3 px-2">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-xl md:text-2xl font-bold group-hover:text-[#5301bb] transition-colors line-clamp-1">
                        หนังสือ{title}
                      </h3>
                      {_category && <span className="shrink-0 text-[10px] font-bold bg-gray-100 px-2 py-1 rounded text-gray-500 uppercase tracking-wider">{_category}</span>}
                    </div>

                    <p className="text-sm font-medium text-gray-900">
                      โดย {getValue(book, 'ชื่อ–นามสกุล (โปรดระบุคำนำหน้านาม)', 'ชื่อ-นามสกุล (โปรดระบุคำนำหน้านาม)', 'Name')}
                    </p>
                    <p className="text-base text-gray-600 line-clamp-2 leading-relaxed">
                      {description || '-'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
