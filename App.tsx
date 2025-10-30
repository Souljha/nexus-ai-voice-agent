import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Testimonials from './components/Testimonials';
import Pricing from './components/Pricing';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import TermsOfService from './components/TermsOfService';
import RefundPolicy from './components/RefundPolicy';

const HomePage: React.FC = () => {
  return (
    <main>
      <Hero />
      <Testimonials />
      <Pricing />
      <FAQ />
    </main>
  );
};

const App: React.FC = () => {
  return (
    <div className="bg-[#0a192f] text-gray-300 min-h-screen font-sans antialiased">
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
