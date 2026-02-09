
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { X, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

interface HumanBook {
    [key: string]: string;
}

interface HumanBookDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export function HumanBookDialog({ isOpen, onClose }: HumanBookDialogProps) {
    const [selectedBook, setSelectedBook] = useState<HumanBook | null>(null);
    const [books, setBooks] = useState<HumanBook[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            fetchBooks();
        } else {
            // Reset selection when dialog closes
            setTimeout(() => setSelectedBook(null), 300);
        }
    }, [isOpen]);

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
            // Check exact match
            if (book[key]) return book[key];

            // Check trimmed match (simulating trimmed keys from API)
            const trimmedKey = Object.keys(book).find(k => k.trim() === key.trim());
            if (trimmedKey && book[trimmedKey]) return book[trimmedKey];
        }
        return '';
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-6xl w-[95vw] h-[90vh] bg-[#f8f9fa] border-black/10 p-0 overflow-hidden flex flex-col rounded-3xl">
                <DialogHeader className="px-6 py-4 shrink-0 flex flex-row items-center justify-between bg-white border-b border-gray-100 shadow-sm z-10">
                    <DialogTitle className="text-xl md:text-2xl font-bold bg-gradient-to-r from-[#5301bb] to-[#8031d6] bg-clip-text text-transparent">
                        {selectedBook ? 'รายละเอียดหนังสือคน' : 'หนังสือคน (Human Books)'}
                    </DialogTitle>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-black/5 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6 text-gray-500" />
                    </button>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#f8f9fa]">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center min-h-[50vh]">
                            <Loader2 className="w-12 h-12 animate-spin text-[#5301bb]" />
                            <p className="mt-4 text-gray-500 font-medium">กำลังโหลดข้อมูล...</p>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
                            <p className="text-red-500 mb-4">{error}</p>
                            <button
                                onClick={fetchBooks}
                                className="px-6 py-2 bg-[#5301bb] text-white rounded-full hover:bg-[#420195] transition-colors"
                            >
                                ลองใหม่อีกครั้ง
                            </button>
                        </div>
                    ) : selectedBook ? (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                            {/* Detail View */}
                            <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8">
                                <button
                                    onClick={() => setSelectedBook(null)}
                                    className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-[#5301bb] transition-colors group mb-2"
                                >
                                    <svg className="w-4 h-4 mr-1 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    กลับไปหน้าไพ่
                                </button>

                                {/* Header Section */}
                                <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8 items-start">
                                    <div className="w-full md:w-1/3 aspect-[3/4] rounded-2xl overflow-hidden shadow-md bg-gray-100 shrink-0">
                                        <img
                                            src={getImageUrl(getValue(selectedBook, 'รูปภาพตัวเองรูปที่ 1', 'Image', 'image')) || getImageUrl(getValue(selectedBook, 'รูปภาพตัวเองรูปที่ 2'))}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 space-y-4 md:pt-4">
                                        <div>
                                            <span className="inline-block px-3 py-1 bg-[#5301bb]/10 text-[#5301bb] text-sm font-semibold rounded-full mb-3">
                                                {getValue(selectedBook, 'หมวดหมู่', 'Category') || 'Human Book'}
                                            </span>
                                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                                                {getValue(selectedBook, 'ชื่อหนังสือ', 'Title')}
                                            </h1>
                                            <p className="text-xl text-gray-600 mt-2 font-medium">
                                                โดย {getValue(selectedBook, 'ชื่อ-นามสกุล (โปรดระบุคำนำหน้านาม)', 'Name')}
                                            </p>
                                        </div>

                                        <div className="flex flex-wrap gap-4 py-4 border-t border-gray-100 mt-4">
                                            {getValue(selectedBook, 'อายุ') && (
                                                <div className="bg-gray-50 px-4 py-2 rounded-xl">
                                                    <span className="text-xs text-gray-500 block">อายุ</span>
                                                    <span className="font-medium text-gray-900">{getValue(selectedBook, 'อายุ')} ปี</span>
                                                </div>
                                            )}
                                            {getValue(selectedBook, 'อาชีพ', 'ปัจจุบันกำลังทำอะไรอยู่') && (
                                                <div className="bg-gray-50 px-4 py-2 rounded-xl">
                                                    <span className="text-xs text-gray-500 block">ปัจจุบันทำ</span>
                                                    <span className="font-medium text-gray-900">{getValue(selectedBook, 'อาชีพ', 'ปัจจุบันกำลังทำอะไรอยู่')}</span>
                                                </div>
                                            )}
                                            {getValue(selectedBook, 'บทบาทในสังคม') && (
                                                <div className="bg-gray-50 px-4 py-2 rounded-xl">
                                                    <span className="text-xs text-gray-500 block">บทบาท</span>
                                                    <span className="font-medium text-gray-900">{getValue(selectedBook, 'บทบาทในสังคม')}</span>
                                                </div>
                                            )}
                                        </div>

                                        {getValue(selectedBook, 'คติประจำใจ/เป้าหมายของชีวิต') && (
                                            <div className="bg-[#5301bb]/5 p-4 rounded-xl border-l-4 border-[#5301bb]">
                                                <p className="italic text-gray-700">"{getValue(selectedBook, 'คติประจำใจ/เป้าหมายของชีวิต')}"</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Content Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Left Column */}
                                    <div className="space-y-6">
                                        {/* Bio */}
                                        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
                                            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                                <span className="w-2 h-6 bg-[#5301bb] rounded-full mr-3"></span>
                                                ประวัติโดยย่อ
                                            </h3>
                                            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                                                {getValue(selectedBook, 'ประวัติโดยย่อ', 'Description') || '-'}
                                            </p>
                                        </div>

                                        {/* Passion */}
                                        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
                                            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                                <span className="w-2 h-6 bg-[#5301bb] rounded-full mr-3"></span>
                                                ความหลงใหล
                                            </h3>
                                            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                                                {getValue(selectedBook, 'อะไรทำให้คุณหลงไหลในสิ่งที่อยากแบ่งปัน') || '-'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Right Column */}
                                    <div className="space-y-6">
                                        {/* Sharing */}
                                        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
                                            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                                <span className="w-2 h-6 bg-[#5301bb] rounded-full mr-3"></span>
                                                สิ่งที่อยากแบ่งปัน
                                            </h3>
                                            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                                                {getValue(selectedBook, 'สิ่งที่อยากแบ่งปัน') || '-'}
                                            </p>
                                        </div>

                                        {/* Proud & Experience */}
                                        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
                                            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                                <span className="w-2 h-6 bg-[#5301bb] rounded-full mr-3"></span>
                                                ประสบการณ์และผลงาน
                                            </h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <h4 className="font-semibold text-gray-900 mb-1">ความภูมิใจ</h4>
                                                    <p className="text-gray-600 text-sm">{getValue(selectedBook, 'ผลงาน/ประสบการณ์ที่ภูมิใจอยากเล่า') || '-'}</p>
                                                </div>
                                                <div className="pt-4 border-t border-gray-100">
                                                    <h4 className="font-semibold text-gray-900 mb-1">เทคนิคเฉพาะตัว</h4>
                                                    <p className="text-gray-600 text-sm">{getValue(selectedBook, 'เทคนิคลับ/ประสบการณ์เฉพาะตัว') || '-'}</p>
                                                </div>
                                                <div className="pt-4 border-t border-gray-100">
                                                    <h4 className="font-semibold text-gray-900 mb-1">ความสามารถพิเศษ</h4>
                                                    <p className="text-gray-600 text-sm">{getValue(selectedBook, 'ความสามารถ') || '-'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Section */}
                                <div className="bg-[#5301bb] text-white rounded-3xl p-8 shadow-lg text-center">
                                    <h3 className="text-2xl font-bold mb-2">สนใจอ่านเล่มนี้?</h3>
                                    <p className="text-white/80 mb-6">สามารถติดต่อหรือติดตามได้ที่</p>
                                    <div className="inline-block bg-white/10 backdrop-blur-sm px-6 py-3 rounded-xl border border-white/20">
                                        <p className="text-lg font-medium">
                                            {getValue(selectedBook, 'ช่องทางการติดต่อ/ติดตาม') || '-'}
                                        </p>
                                    </div>
                                </div>
                                <div className="h-4"></div>
                            </div>
                        </div>
                    ) : (
                        // List View
                        <div className="p-6 md:p-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {books.map((book, index) => {
                                    const title = getValue(book, 'ชื่อหนังสือ', 'Title', 'ชื่อเรื่อง');
                                    const description = getValue(book, 'ประวัติโดยย่อ', 'Description', 'สิ่งที่อยากแบ่งปัน');
                                    const _category = getValue(book, 'หมวดหมู่', 'Category');
                                    const image1 = getImageUrl(getValue(book, 'รูปภาพตัวเองรูปที่ 1', 'Image', 'image', 'รูปภาพ'));

                                    return (
                                        <div
                                            key={index}
                                            onClick={() => setSelectedBook(book)}
                                            className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col cursor-pointer h-full hover:-translate-y-1"
                                        >
                                            <div className="aspect-[3/4] w-full overflow-hidden bg-gray-100 relative">
                                                {image1 ? (
                                                    <img
                                                        src={image1}
                                                        alt={title}
                                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">
                                                        <span className="text-4xl opacity-20">📚</span>
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            </div>

                                            <div className="p-5 flex-1 flex flex-col relative">
                                                <div className="mb-2">
                                                    {_category && (
                                                        <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-medium rounded-full mb-2">
                                                            {_category}
                                                        </span>
                                                    )}
                                                    <h3 className="text-lg font-bold text-gray-900 leading-snug group-hover:text-[#5301bb] transition-colors line-clamp-2">
                                                        {title || 'ไม่มีชื่อเรื่อง'}
                                                    </h3>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        {getValue(book, 'ชื่อ-นามสกุล (โปรดระบุคำนำหน้านาม)', 'Name')}
                                                    </p>
                                                </div>
                                                <p className="text-sm text-gray-600 line-clamp-3 mb-4 flex-1">
                                                    {description || '-'}
                                                </p>
                                                <div className="mt-auto px-4 py-2 bg-[#5301bb]/5 text-[#5301bb] text-xs font-semibold rounded-lg text-center group-hover:bg-[#5301bb] group-hover:text-white transition-all">
                                                    อ่านเพิ่มเติม
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}

                                {books.length === 0 && (
                                    <div className="col-span-full text-center py-20">
                                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">📚</div>
                                        <h3 className="text-lg font-medium text-gray-900">ยังไม่มีหนังสือคน</h3>
                                        <p className="text-gray-500">ติดตามเร็วๆ นี้</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
