import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function PageBanner({ title, subtitle, breadcrumb }) {
  const { theme } = useTheme();

  return (
    <div style={{
      backgroundColor: 'var(--primary-color)',
      backgroundImage: `linear-gradient(135deg, var(--primary-color) 0%, #071829 100%)`,
      color: '#ffffff',
      padding: '3rem 1.2rem',
      borderBottom: '4px solid var(--accent-color)'
    }}>
      <div className="container" style={{ maxWidth: '1280px', margin: '0 auto', padding: 0 }}>
        
        {/* Breadcrumb */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.8rem',
          color: '#cbd5e1',
          marginBottom: '0.8rem',
          fontWeight: 600
        }}>
          <Link to="/" style={{ color: '#93c5fd', textDecoration: 'none' }}>Home</Link>
          <span>›</span>
          <span style={{ color: 'var(--accent-color)' }}>{breadcrumb || title}</span>
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: 'clamp(2rem, 4.5vw, 2.8rem)',
          fontWeight: 900,
          color: '#ffffff',
          lineHeight: 1.2,
          marginBottom: '0.5rem'
        }}>
          {title}
        </h1>

        {/* Subtitle / Sanskrit Motto */}
        <p style={{
          fontSize: 'clamp(0.95rem, 2vw, 1.15rem)',
          color: '#e2e8f0',
          maxWidth: '750px',
          lineHeight: 1.6
        }}>
          {subtitle || theme.schoolMotto || 'तमसो मा ज्योतिर्गमय • Lead Us from Darkness to Light'}
        </p>

      </div>
    </div>
  );
}
