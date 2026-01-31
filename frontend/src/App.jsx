import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { WinnersBoard } from './components/WinnersBoard';
import { CursorGlow } from './components/CursorGlow';
import './App.css';

function App() {
  return (
    <main className="relative min-h-screen overflow-hidden scanlines">
      <CursorGlow />
      <div className="relative z-10">
        <Header />
        <HeroSection />
        <WinnersBoard />
      </div>
    </main>
  );
}

export default App;
