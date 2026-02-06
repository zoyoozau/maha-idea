import { useState, useEffect } from 'react';
import { Header } from './sections/Header';
import { Hero } from './sections/Hero';
import { Studios } from './sections/Studios';
import { Collaboration } from './sections/Collaboration';
import { WordCloud } from './sections/WordCloud';
import { Works } from './sections/Works';
import { Footer } from './sections/Footer';
import { ContactDialog } from './components/ContactDialog';
import { UpdatesDialog } from './components/UpdatesDialog';
import { FloatingDecorations } from './components/FloatingDecorations';

function App() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isUpdatesOpen, setIsUpdatesOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-black">
      <Header onContactClick={() => setIsContactOpen(true)} />

      <main>
        <Hero scrollY={scrollY} />
        <div className="relative z-10 bg-white overflow-hidden">
          <FloatingDecorations scrollY={scrollY} />
          <Studios />
          <Collaboration onGetInTouch={() => setIsContactOpen(true)} />
          <WordCloud scrollY={scrollY} />
          <Works />
        </div>
      </main>

      <Footer onGetUpdates={() => setIsUpdatesOpen(true)} />

      <ContactDialog
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

      <UpdatesDialog
        isOpen={isUpdatesOpen}
        onClose={() => setIsUpdatesOpen(false)}
      />
    </div>
  );
}

export default App;
