import { useState } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { WinnersBoard } from './components/WinnersBoard';
import { CursorGlow } from './components/CursorGlow';
import { Play } from './components/Play';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('home');

  return (
    <main className="relative min-h-screen scanlines">
      <CursorGlow />
      <div className="relative z-10">
        <Header onNavigate={setCurrentView} currentView={currentView} />
        {currentView === 'home' && (
          <>
            <HeroSection onPlayClick={() => setCurrentView('play')} />
            <WinnersBoard />
          </>
        )}
        {currentView === 'play' && <Play />}
        {currentView === 'leaderboard' && <WinnersBoard />}
      </div>
    </main>
  );
}

export default App;
