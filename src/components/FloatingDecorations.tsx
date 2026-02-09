import { useMemo } from 'react';

interface FloatingDecorationsProps {
    scrollY: number;
}

interface DecorationItem {
    id: string;
    src: string;
    top: number; // Percentage from top (0-100)
    left?: number; // Percentage from left (0-100)
    right?: number; // Percentage from right (0-100)
    width: string; // Tailwind width class (e.g. w-32)
    speed: number; // Parallax speed multiplier (negative for up, positive for down)
    zIndex: number;
}

export function FloatingDecorations({ scrollY }: FloatingDecorationsProps) {
    // Define positions for scattered look
    const items: DecorationItem[] = useMemo(() => [
        // Top section (Introduction) - near "ONE is a close..."
        { id: '1', src: 'Artboard1.png', top: 5, right: 5, width: 'w-48 md:w-64', speed: 0.2, zIndex: 0 },
        { id: '2', src: 'Artboard2.png', top: 12, left: 5, width: 'w-32 md:w-48', speed: -0.1, zIndex: 0 },

        // Middle section (Studios)
        { id: '3', src: 'Artboard3.png', top: 25, right: 10, width: 'w-12 md:w-20', speed: 0.15, zIndex: 0 },
        { id: '4', src: 'Artboard4.png', top: 35, left: 8, width: 'w-48 md:w-64', speed: -0.15, zIndex: 0 },

        // Collaboration section
        { id: '5', src: 'Artboard5.png', top: 45, right: 2, width: 'w-36 md:w-52', speed: 0.1, zIndex: 0 },
        { id: '6', src: 'Artboard6.png', top: 55, left: 12, width: 'w-56 md:w-72', speed: -0.2, zIndex: 0 },

        // WordCloud section background elements
        { id: '7', src: 'Artboard7.png', top: 65, right: 15, width: 'w-32 md:w-48', speed: 0.25, zIndex: 0 },
        { id: '8', src: 'Artboard8.png', top: 72, left: 5, width: 'w-40 md:w-56', speed: -0.1, zIndex: 0 },

        // Bottom section (Works/Footer)
        { id: '9', src: 'Artboard9.png', top: 80, right: 8, width: 'w-44 md:w-60', speed: 0.15, zIndex: 0 },
        { id: '10', src: 'Artboard10.png', top: 88, left: 10, width: 'w-36 md:w-52', speed: -0.15, zIndex: 0 },

        // Extra scattered items
        { id: '11', src: 'Artboard11.png', top: 18, right: 25, width: 'w-24 md:w-32', speed: 0.3, zIndex: 0 },
        { id: '12', src: 'Artboard12.png', top: 40, left: 20, width: 'w-28 md:w-40', speed: -0.25, zIndex: 0 },
        // Use "Page 1" specifically somewhere prominent
        { id: '17', src: 'Page 1.png', top: 92, right: 5, width: 'w-40 md:w-64', speed: 0.1, zIndex: 0 },

    ], []);

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden h-full">
            {items.map((item) => {
                const transforms = `translateY(${scrollY * item.speed}px)`;

                return (
                    <div
                        key={item.id}
                        className={`absolute ${item.width} opacity-40 hover:opacity-80 transition-opacity duration-700 ease-in-out`}
                        style={{
                            top: `${item.top}%`,
                            left: item.left !== undefined ? `${item.left}%` : 'auto',
                            right: item.right !== undefined ? `${item.right}%` : 'auto',
                            transform: transforms,
                            zIndex: item.zIndex,
                        }}
                    >
                        <img
                            src={`/png/${item.src}`}
                            alt="Decoration"
                            className="w-full h-auto drop-shadow-xl rounded-lg"
                        />
                    </div>
                );
            })}
        </div>
    );
}
