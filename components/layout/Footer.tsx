/**
 * Footer Component
 * Componente de pie de página con logo de compufest, links a secciones y fondo negro
 */

'use client';

import { Link } from 'react-router-dom';
import Image from 'next/image';
import { MENU_ITEMS } from '@/lib/constants/navigation';
import styles from './Footer.module.css';

export function Footer() {
  // Filtrar items del menú que sean rutas internas (excluir Registro que es URL externa)
  const internalLinks = MENU_ITEMS.filter(item => item.link.startsWith('/'));

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Logo */}
        <div className={styles.logoSection}>
          <img
            src="/isotipo-blanco.png"
            alt="CompuFest Logo"
            className={styles.logo}
          />
        </div>

        {/* Links a secciones */}
        <nav className={styles.navigation}>
          <h3 className={styles.navTitle}>Secciones</h3>
          <ul className={styles.linksList}>
            {internalLinks.map((item) => (
              <li key={item.link}>
                <Link to={item.link} className={styles.link}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Copyright */}
        <div className={styles.copyright}>
          <p>&copy; {new Date().getFullYear()} Compufest. Todos los derechos reservados.</p>
        </div>
      </div>

      {/* Sitio creado y desarrollado por Chiiko */}
      <div className={styles.creditSection}>
        <span className={styles.creditText}>Sitio web creado y desarrollado por</span>
        <a 
          href="https://www.chiiko.design" 
          target="_blank" 
          rel="noopener noreferrer"
          className={styles.chikoLink}
        >
          <div className={styles.chikoLogo}>
            <Image 
              src="/chiikologosvg.svg"
              alt="Chiikö Logo"
              width={60}
              height={60}
              unoptimized
            />
          </div>
        </a>
      </div>
    </footer>
  );
}
