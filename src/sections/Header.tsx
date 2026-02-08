interface HeaderProps {
  onContactClick: () => void;
}

export function Header({ onContactClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full bg-transparent">
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 py-4 sm:py-5 md:py-6 flex items-center justify-between">
        <a
          href="#"
          className="block hover:opacity-70 transition-opacity ml-3 sm:ml-0"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <img
            src="/logoมหาไอเดีย.png"
            alt="Maha iDEA"
            className="h-16 sm:h-20 md:h-24 w-auto object-contain"
          />
        </a>

        <button
          onClick={onContactClick}
          className="studio-btn text-xs sm:text-sm font-medium px-3 sm:px-4 py-1.5 border rounded-full transition-all duration-300 hover:text-white -mr-1 sm:mr-0"
          style={{
            borderColor: '#5301bb',
            color: '#5301bb',
            '--hover-bg': '#5301bb'
          } as React.CSSProperties}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#5301bb';
            e.currentTarget.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#5301bb';
          }}
        >
          หนังสือคน
        </button>
      </div>
    </header>
  );
}
