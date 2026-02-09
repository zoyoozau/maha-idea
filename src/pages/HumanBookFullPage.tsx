import { useEffect, useState } from 'react';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

interface HumanBook {
    [key: string]: string;
}

export function HumanBookFullPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [books, setBooks] = useState<HumanBook[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedBook, setSelectedBook] = useState<HumanBook | null>(null);

    useEffect(() => {
        // Scroll to top when page loads
        window.scrollTo(0, 0);
        fetchBooks();
    }, []);

    useEffect(() => {
        if (books.length > 0 && id) {
            // Find book by ID (assuming ID is the Title for now, or use index)
            // Ideally we need a unique ID. Using Index if passed, or Title.
            // Let's assume we pass the INDEX or Title via URL.
            // If ID is a number, treat as index.
            const index = parseInt(id);
            if (!isNaN(index) && books[index]) {
                setSelectedBook(books[index]);
            } else {
                // Try finding by Title (decoded)
                const title = decodeURIComponent(id);
                const found = books.find(b => getValue(b, 'ชื่อหนังสือ', 'Title') === title);
                if (found) setSelectedBook(found);
            }
        }
    }, [books, id]);


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

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <Loader2 className="w-12 h-12 animate-spin text-[#5301bb]" />
                <p className="mt-4 text-gray-500 font-medium">กำลังโหลดข้อมูลหนังสือคน...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <p className="text-red-500 mb-4">{error}</p>
                <button
                    onClick={fetchBooks}
                    className="px-6 py-2 bg-[#5301bb] text-white rounded-full hover:bg-[#420195] transition-colors"
                >
                    ลองใหม่อีกครั้ง
                </button>
            </div>
        );
    }

    if (!selectedBook) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <p className="text-gray-500 mb-4">ไม่พบข้อมูลหนังสือคนที่ต้องการ</p>
                <button
                    onClick={() => navigate('/')}
                    className="px-6 py-2 bg-[#5301bb] text-white rounded-full hover:bg-[#420195] transition-colors"
                >
                    กลับไปหน้าหลัก
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 py-12 md:py-20 px-4 md:px-8">
            <div className="max-w-5xl mx-auto">
                <button
                    onClick={() => navigate('/', { state: { scrollTo: 'human-books' } })}
                    className="inline-flex items-center text-base font-medium text-gray-500 hover:text-[#5301bb] transition-colors group mb-8 bg-white px-4 py-2 rounded-full shadow-sm hover:shadow-md border border-gray-100"
                >
                    <ArrowLeft className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" />
                    กลับไปหน้าหลัก
                </button>

                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Header Card */}
                    <div className="bg-white rounded-[2rem] p-6 md:p-10 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8 items-start mb-8">
                        <div className="w-full md:w-1/3 aspect-[3/4] rounded-2xl overflow-hidden shadow-md bg-gray-100 shrink-0">
                            <img
                                src={getImageUrl(getValue(selectedBook, 'รูปภาพตัวเองรูปที่ 1', 'Image', 'image')) || getImageUrl(getValue(selectedBook, 'รูปภาพตัวเองรูปที่ 2'))}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex-1 space-y-6 md:pt-2 w-full">
                            <div>
                                <span className="inline-block px-3 py-1 bg-[#5301bb]/10 text-[#5301bb] text-sm font-semibold rounded-full mb-3">
                                    {getValue(selectedBook, 'หมวดหมู่', 'Category') || 'Human Book'}
                                </span>
                                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-2">
                                    หนังสือ{getValue(selectedBook, 'ชื่อหนังสือ', 'Title')}
                                </h1>
                                <p className="text-xl text-gray-600 font-medium">
                                    โดย {getValue(selectedBook, 'ชื่อ–นามสกุล (โปรดระบุคำนำหน้านาม)', 'ชื่อ-นามสกุล (โปรดระบุคำนำหน้านาม)', 'Name')}
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                {getValue(selectedBook, 'อายุ') && (
                                    <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                                        อายุ {getValue(selectedBook, 'อายุ')} ปี
                                    </span>
                                )}
                                {getValue(selectedBook, 'อาชีพ', 'ปัจจุบันกำลังทำอะไรอยู่') && (
                                    <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                                        {getValue(selectedBook, 'อาชีพ', 'ปัจจุบันกำลังทำอะไรอยู่')}
                                    </span>
                                )}
                            </div>

                            {getValue(selectedBook, 'คติประจำใจ/เป้าหมายของชีวิต') && (
                                <div className="bg-[#5301bb]/5 p-6 rounded-2xl border-l-4 border-[#5301bb] italic text-gray-700 text-lg">
                                    "{getValue(selectedBook, 'คติประจำใจ/เป้าหมายของชีวิต')}"
                                </div>
                            )}

                            <div className="bg-[#5301bb] text-white rounded-2xl p-6 shadow-lg w-full">
                                <div className="mb-4">
                                    <h3 className="text-xl font-bold mb-1">สนใจอ่านเล่มนี้?</h3>
                                    <p className="text-white/80 text-sm">ข้อมูลการติดต่อ</p>
                                </div>

                                <div className="space-y-3 bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                                    {getValue(selectedBook, 'ที่อยู่') && (
                                        <div className="flex flex-col md:flex-row md:gap-2">
                                            <span className="text-white/70 text-sm shrink-0 md:w-20">ที่อยู่:</span>
                                            <span className="font-medium">{getValue(selectedBook, 'ที่อยู่')}</span>
                                        </div>
                                    )}

                                    {getValue(selectedBook, 'เบอร์โทรศัพท์') && (
                                        <div className="flex flex-col md:flex-row md:gap-2">
                                            <span className="text-white/70 text-sm shrink-0 md:w-20">เบอร์โทร:</span>
                                            <span className="font-medium">{getValue(selectedBook, 'เบอร์โทรศัพท์')}</span>
                                        </div>
                                    )}

                                    <div className="flex flex-col md:flex-row md:gap-2">
                                        <span className="text-white/70 text-sm shrink-0 md:w-20">ช่องทางอื่น:</span>
                                        <span className="font-medium break-all">{getValue(selectedBook, 'ช่องทางการติดต่อ/ติดตาม') || '-'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 h-full">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                <span className="w-1.5 h-6 bg-[#5301bb] rounded-full mr-3"></span>
                                ประวัติโดยย่อ
                            </h3>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-line text-lg">
                                {getValue(selectedBook, 'ประวัติโดยย่อ', 'Description') || '-'}
                            </p>
                        </div>

                        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 h-full">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                <span className="w-1.5 h-6 bg-[#5301bb] rounded-full mr-3"></span>
                                ความหลงใหล
                            </h3>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-line text-lg">
                                {getValue(selectedBook, 'อะไรทำให้คุณหลงไหลในสิ่งที่อยากแบ่งปัน') || '-'}
                            </p>
                        </div>

                        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 h-full">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                <span className="w-1.5 h-6 bg-[#5301bb] rounded-full mr-3"></span>
                                สิ่งที่อยากแบ่งปัน
                            </h3>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-line text-lg">
                                {getValue(selectedBook, 'สิ่งที่อยากแบ่งปัน') || '-'}
                            </p>
                        </div>

                        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 h-full">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                <span className="w-1.5 h-6 bg-[#5301bb] rounded-full mr-3"></span>
                                ประสบการณ์และผลงาน
                            </h3>
                            <div className="space-y-6">
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-2">ความภูมิใจ</h4>
                                    <p className="text-gray-600">{getValue(selectedBook, 'ผลงาน/ประสบการณ์ที่ภูมิใจอยากเล่า') || '-'}</p>
                                </div>
                                <div className="pt-4 border-t border-gray-100">
                                    <h4 className="font-semibold text-gray-900 mb-2">เทคนิคเฉพาะตัว</h4>
                                    <p className="text-gray-600">{getValue(selectedBook, 'เทคนิคลับ/ประสบการณ์เฉพาะตัว') || '-'}</p>
                                </div>
                                <div className="pt-4 border-t border-gray-100">
                                    <h4 className="font-semibold text-gray-900 mb-2">ความสามารถพิเศษ</h4>
                                    <p className="text-gray-600">{getValue(selectedBook, 'ความสามารถ') || '-'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
