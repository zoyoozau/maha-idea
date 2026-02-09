import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import { Header } from '../sections/Header';
import { Hero } from '../sections/Hero';

import { Collaboration } from '../sections/Collaboration';
import { WordCloud } from '../sections/WordCloud';
import { Works } from '../sections/Works';
import { Footer } from '../sections/Footer';
import { FloatingDecorations } from '../components/FloatingDecorations';

// Props passed from App.tsx
interface LandingPageProps {
    scrollY: number;
}

export function LandingPage({ scrollY }: LandingPageProps) {
    const location = useLocation();
    const [isMapOpen, setIsMapOpen] = useState(false);

    // Check if we need to scroll to human-books section
    useEffect(() => {
        if (location.state && location.state.scrollTo === 'human-books') {
            const element = document.getElementById('human-books');
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth' });
                }, 100); // Small delay to ensure render
            }
        }
    }, [location]);

    const scrollToHumanBooks = () => {
        const element = document.getElementById('human-books');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <>
            <Header onContactClick={scrollToHumanBooks} />

            <main>
                <Hero scrollY={scrollY} />
                <div className="relative z-10 bg-white overflow-hidden">
                    <FloatingDecorations scrollY={scrollY} />
                    <div
                        className="relative w-full h-[300px] md:h-[500px] overflow-hidden group cursor-pointer"
                        onClick={() => setIsMapOpen(true)}
                    >
                        <img
                            src="/แผนที่งานมหาไอเดีย.webp"
                            alt="แผนที่งานมหาไอเดีย"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        {/* Floating Info Card - Bottom Left */}
                        <div className="absolute left-4 bottom-4 md:left-8 md:bottom-8 max-w-[90%] md:max-w-md bg-white/95 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/50 animate-in fade-in slide-in-from-bottom-4 duration-700 hover:scale-105 transition-transform">
                            <div className="flex flex-col items-start space-y-2">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#5301bb]/10 text-[#5301bb] mb-1">
                                    <span className="w-2 h-2 rounded-full bg-[#5301bb] mr-2 animate-pulse"></span>
                                    UPCOMING EVENT
                                </span>
                                <h2 className="text-2xl font-bold text-[#5301bb]">
                                    งานมหาไอเดีย
                                </h2>
                                <div className="space-y-1">
                                    <p className="text-lg font-medium text-gray-800 flex items-center gap-2">
                                        🗓️ 12-14 กุมภาพันธ์ นี้
                                    </p>
                                    <p className="text-base text-gray-600 flex items-center gap-2">
                                        📍 สวนสาธารณะกะพังสุรินทร์ จ.ตรัง
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Collaboration />
                    <WordCloud scrollY={scrollY} />
                    <Works />
                </div>
            </main>

            <Footer />


            {/* Map Modal */}
            {isMapOpen && (
                <div
                    className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
                    onClick={() => setIsMapOpen(false)}
                >
                    <button
                        onClick={() => setIsMapOpen(false)}
                        className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
                    >
                        <X className="w-8 h-8 md:w-12 md:h-12" />
                    </button>
                    <img
                        src="/แผนที่งานมหาไอเดีย.webp"
                        alt="แผนที่งานมหาไอเดีย Full Size"
                        className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-300"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </>
    );
}
