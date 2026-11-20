import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function Footer() {
  const { theme } = useTheme();

  const schoolName = theme.schoolName || 'Greenwood Academy';
  const schoolSubName = theme.schoolSubName || 'Senior Secondary, Co-Educational • Affiliated to CBSE, New Delhi';
  const affiliation = theme.cbseAffiliation || 'CBSE Affiliation No: 2130892 | School Code: 70415';
  const phone = theme.phone || '+91 98765 43210';
  const email = theme.email || 'admissions@greenwood.edu';
  const address = theme.address || 'Sector 14, Institutional Area, Rohini, New Delhi - 110085';

  return (
    <footer id="contact" style={{
      backgroundColor: '#071829',
      color: '#cbd5e1',
      padding: '3.5rem 1.2rem 1.8rem',
      fontSize: '0.88rem',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      marginTop: 'auto'
    }}>
      <div className="container" style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '2.5rem',
        paddingBottom: '2.5rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        {/* Col 1: Institutional Details */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.8rem' }}>
            {theme.logoUrl ? (
              <img 
                src={theme.logoUrl} 
                alt="Logo" 
                style={{ maxHeight: '38px', maxWidth: '80px', objectFit: 'contain' }} 
              />
            ) : (
              <span style={{ fontSize: '1.8rem' }}>🏛️</span>
            )}
            <div>
              <div style={{ fontWeight: 900, fontSize: '1.05rem', color: '#ffffff', textTransform: 'uppercase', lineHeight: 1.2 }}>
                {schoolName}
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--accent-color)', fontWeight: 700, marginTop: '2px' }}>
                ESTD. 1988 • SENIOR SECONDARY
              </div>
            </div>
          </div>
          <p style={{ fontSize: '0.82rem', lineHeight: 1.55, marginBottom: '0.8rem', color: '#94a3b8' }}>
            {schoolSubName}.
          </p>
          <div style={{ fontSize: '0.78rem', color: 'var(--accent-color)', fontWeight: 600 }}>
            {affiliation}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', fontStyle: 'italic', marginTop: '0.5rem' }}>
            "विद्या ददाति विनयं" — True Knowledge Imparts Humility
          </div>
        </div>

        {/* Col 2: Quick Links (Explore Campus) */}
        <div>
          <div style={{ fontWeight: 800, fontSize: '0.82rem', letterSpacing: '0.08em', color: '#ffffff', textTransform: 'uppercase', marginBottom: '0.8rem', borderBottom: '2px solid var(--secondary-color)', display: 'inline-block', paddingBottom: '0.2rem' }}>
            EXPLORE CAMPUS
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.55rem', fontSize: '0.82rem' }}>
            <li>
              <Link to="/" style={{ color: '#cbd5e1', textDecoration: 'none', transition: 'color 0.2s' }}>
                🏠 Home Overview
              </Link>
            </li>
            <li>
              <Link to="/about" style={{ color: '#cbd5e1', textDecoration: 'none', transition: 'color 0.2s' }}>
                🏛️ About School & Leadership
              </Link>
            </li>
            <li>
              <Link to="/academics" style={{ color: '#cbd5e1', textDecoration: 'none', transition: 'color 0.2s' }}>
                📚 Academic Wings (Nursery – XII)
              </Link>
            </li>
            <li>
              <Link to="/facilities" style={{ color: '#cbd5e1', textDecoration: 'none', transition: 'color 0.2s' }}>
                🔬 Campus Labs & Sports
              </Link>
            </li>
            <li>
              <Link to="/blog" style={{ color: '#cbd5e1', textDecoration: 'none', transition: 'color 0.2s' }}>
                📰 School Blogs & Circulars
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Admissions & Compliance */}
        <div>
          <div style={{ fontWeight: 800, fontSize: '0.82rem', letterSpacing: '0.08em', color: '#ffffff', textTransform: 'uppercase', marginBottom: '0.8rem', borderBottom: '2px solid var(--secondary-color)', display: 'inline-block', paddingBottom: '0.2rem' }}>
            ADMISSIONS & COMPLIANCE
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.55rem', fontSize: '0.82rem' }}>
            <li>
              <Link to="/admissions" style={{ color: 'var(--accent-color)', fontWeight: 700, textDecoration: 'none' }}>
                📝 Online Admission 2026-27
              </Link>
            </li>
            <li>
              <Link to="/admissions" style={{ color: '#cbd5e1', textDecoration: 'none' }}>
                📋 Admission Criteria & Eligibility
              </Link>
            </li>
            <li>
              <Link to="/contact#disclosure" style={{ color: '#cbd5e1', textDecoration: 'none' }}>
                📜 CBSE Mandatory Public Disclosure (SARAS)
              </Link>
            </li>
            <li>
              <Link to="/contact" style={{ color: '#cbd5e1', textDecoration: 'none' }}>
                🛡️ Student Safety & Grievance Desk
              </Link>
            </li>
           
          </ul>
        </div>

        {/* Col 4: Reach Us */}
        <div>
          <div style={{ fontWeight: 800, fontSize: '0.82rem', letterSpacing: '0.08em', color: '#ffffff', textTransform: 'uppercase', marginBottom: '0.8rem', borderBottom: '2px solid var(--secondary-color)', display: 'inline-block', paddingBottom: '0.2rem' }}>
            CAMPUS HELPDESK
          </div>
          <div style={{ display: 'grid', gap: '0.55rem', fontSize: '0.82rem', color: '#94a3b8' }}>
            <div>📍 {address}</div>
            <div>📞 {phone}</div>
            <div>✉️ {email}</div>
            <div style={{ color: '#64748b', fontSize: '0.78rem', marginTop: '0.2rem' }}>
              🕒 Visiting: 8:00 AM – 3:30 PM (Mon–Sat)
            </div>
            <div style={{ marginTop: '0.3rem' }}>
              <Link 
                to="/contact" 
                style={{ 
                  color: 'var(--secondary-color)', 
                  fontWeight: 700, 
                  textDecoration: 'none',
                  fontSize: '0.82rem' 
                }}
              >
                Send Us an Inquiry →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright & Accreditations */}
      <div className="container" style={{
        maxWidth: '1280px',
        margin: '0 auto',
        paddingTop: '1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.8rem',
        fontSize: '0.75rem',
        color: '#64748b'
      }}>
        <div>
          © {new Date().getFullYear()} {schoolName}. All Rights Reserved. Affiliated to CBSE, New Delhi.
        </div>
        <div>
          Managed by Educational Trust • Dedicated to Quality Education
        </div>
      </div>
    </footer>
  );
}
