import React from 'react';

const Logo: React.FC = () => (
  <div className="text-xl md:text-2xl font-bold tracking-wider cursor-default">
    <span className="text-white">Nexus</span>
    <span className="text-blue-400">AI</span>
    <span className="text-white block text-xs md:text-sm font-normal tracking-widest">PARTNERS</span>
  </div>
);

const NavLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
  <a href={href} className="text-gray-300 hover:text-blue-400 transition-colors duration-300">
    {children}
  </a>
);

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const navLinks = [
    { href: '#', text: 'Home' },
    { href: '#', text: 'About Us' },
    { href: '#', text: 'Web Development' },
    { href: '#', text: 'Animation' },
    { href: '#', text: 'Contact Us' },
  ];

  return (
    <header className="bg-[#0a192f]/80 backdrop-blur-sm sticky top-0 z-50 border-b border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Logo />
          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <NavLink key={link.text} href={link.href}>{link.text}</NavLink>
            ))}
          </nav>
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-[#0d1b2a] py-4">
          <nav className="flex flex-col items-center space-y-4">
            {navLinks.map((link) => (
              <NavLink key={link.text} href={link.href}>{link.text}</NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
