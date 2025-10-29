import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import HelpWidget from './components/HelpWidget';

const App: React.FC = () => {
  return (
    <div className="bg-[#0a192f] text-gray-300 min-h-screen font-sans antialiased">
      <Header />
      <main>
        <Hero />
        <FAQ />
      </main>
      <Footer />
      <HelpWidget />
    </div>
  );
};

export default App;
