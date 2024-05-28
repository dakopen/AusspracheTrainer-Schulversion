import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <nav className="footer-nav">
                <ul className="footer-menu">
                    <li className="footer-item">
                        <Link to="/contact" className="footer-link">Kontakt & Impressum</Link>
                    </li>
                    <li className="footer-item">
                        <Link to="/privacy" className="footer-link">Datenschutzerklärung</Link>
                    </li>
                </ul>
            </nav>
        </footer>
    );
};

export default Footer;
