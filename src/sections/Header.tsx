interface HeaderProps {
  onContactClick: () => void;
}

export function Header({ onContactClick }: HeaderProps) {
  return (
    <header className="relative z-50 w-full bg-white">
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 py-4 sm:py-5 md:py-6 flex items-center justify-between">
        <a 
          href="#" 
          className="text-xl sm:text-2xl md:text-3xl font-medium tracking-tight text-black hover:opacity-70 transition-opacity"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          One
        </a>
        
        <button
          onClick={onContactClick}
          className="studio-btn text-xs sm:text-sm md:text-base font-medium px-3 sm:px-4 py-1.5 sm:py-2 border border-black text-black rounded-full hover:bg-black hover:text-white transition-all duration-300"
        >
          Contact
        </button>
      </div>
    </header>
  );
}
