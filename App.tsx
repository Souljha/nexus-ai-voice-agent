import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Testimonials from './components/Testimonials';
import Pricing from './components/Pricing';
import FAQ from './components/FAQ';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <div className="bg-[#0a192f] text-gray-300 min-h-screen font-sans antialiased">
      <Header />
      <main>
        <Hero />
        <Testimonials />
        <Pricing />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
};

export default App;
