import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { HumanBookFullPage } from './pages/HumanBookFullPage';
import { UpdatesDialog } from './components/UpdatesDialog';

function App() {
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
    <>
      <Routes>
        <Route
          path="/"
          element={
            <LandingPage
              scrollY={scrollY}
            />
          }
        />
        <Route path="/human-book/:id" element={<HumanBookFullPage />} />
      </Routes>

      <UpdatesDialog
        isOpen={isUpdatesOpen}
        onClose={() => setIsUpdatesOpen(false)}
      />
    </>
  );
}

export default App;
