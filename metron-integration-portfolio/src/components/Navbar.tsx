import { useState } from 'react';
import './Navbar.scss';

interface NavbarProps {
  onIntegrations: () => void;
}

export default function Navbar({ onIntegrations }: NavbarProps) {
  const [open, setOpen] = useState(false);

  return (
    <header className="metron-header">
      <nav className="navbar navbar-expand-lg metron-navbar">
        <div className="container-wide d-flex align-items-center">
          <a className="navbar-brand metron-brand" href="#home" aria-label="Metron Security home">
            <span className="brand-mark">m</span>
            <span className="brand-word"><strong>metron</strong><small>security</small></span>
          </a>
          <button className="navbar-toggler metron-toggler" type="button" aria-label="Toggle navigation" aria-expanded={open} onClick={() => setOpen(!open)}>
            <span /><span /><span />
          </button>
          <div className={`collapse navbar-collapse ${open ? 'show' : ''}`}>
            <ul className="navbar-nav ms-auto align-items-lg-center metron-links">
              <li className="nav-item"><a className="nav-link" href="#home" onClick={() => setOpen(false)}>Home</a></li>
              <li className="nav-item"><a className="nav-link" href="#products">Product &amp; Services <span className="chevron">⌄</span></a></li>
              <li className="nav-item"><button className="nav-link nav-link-button" onClick={() => { onIntegrations(); setOpen(false); }}>Integrations <span className="chevron">⌄</span></button></li>
              <li className="nav-item"><a className="nav-link" href="#partners">Partners</a></li>
              <li className="nav-item"><a className="nav-link" href="#testimonials">Testimonials</a></li>
              <li className="nav-item"><a className="nav-link" href="#resources">Resources <span className="chevron">⌄</span></a></li>
              <li className="nav-item"><a className="nav-link" href="#careers">Careers</a></li>
            </ul>
            <a className="btn metron-contact" href="mailto:info@metronsecurity.com">CONTACT US</a>
          </div>
        </div>
      </nav>
    </header>
  );
}