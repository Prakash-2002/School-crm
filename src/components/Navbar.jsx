import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const schoolName = theme.schoolName || 'Greenwood Academy';
  const affiliation = theme.cbseAffiliation || 'CBSE Affiliation No: 2130892';
  const phone = theme.phone || '+91 98765 43210';

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header style={{
      width: '100%',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
      transition: 'all 0.2s ease'
    }}>
      <div className="container" style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 1rem',
        height: '66px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.8rem'
      }}>
        
        {/* ========================================================
            LEFT: School Logo & Full School Name
            ======================================================== */}
        <Link 
          to="/" 
          onClick={closeMenu}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.65rem', 
            textDecoration: 'none',
            flex: '1 1 auto',
            minWidth: 0,
            paddingRight: '0.5rem'
          }}
        >
          {theme.logoUrl ? (
            <img 
              src={theme.logoUrl} 
              alt={schoolName} 
              className="navbar-logo-img"
              style={{
                maxHeight: '40px',
                maxWidth: '75px',
                objectFit: 'contain',
                flexShrink: 0
              }}
            />
          ) : (
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: 'var(--primary-color)',
              color: 'var(--accent-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem',
              flexShrink: 0,
              boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
            }}>
              🏛️
            </div>
          )}

          <div style={{ minWidth: 0, flex: 1 }}>
            {/* Full School Name */}
            <div 
              className="navbar-school-title"
              style={{
                fontWeight: 900,
                fontSize: 'clamp(0.95rem, 3.8vw, 1.25rem)',
                color: 'var(--primary-color)',
                letterSpacing: '-0.01em',
                lineHeight: 1.15,
                textTransform: 'uppercase',
                wordBreak: 'break-word',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}
            >
              {schoolName}
            </div>

            {/* Subtitle / CBSE badge */}
            <div style={{
              fontSize: '0.65rem',
              color: 'var(--text-secondary)',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              marginTop: '1px'
            }}>
              <span style={{
                backgroundColor: '#eff6ff',
                color: '#2563eb',
                padding: '1px 4px',
                borderRadius: '3px',
                fontWeight: 700,
                fontSize: '0.58rem',
                flexShrink: 0
              }}>
                CBSE
              </span>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {affiliation}
              </span>
            </div>
          </div>
        </Link>

        {/* ========================================================
            CENTER: Desktop Main Navigation
            ======================================================== */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.3rem'
        }} className="desktop-nav-items">
          <NavLink 
            to="/" 
            end
            style={({ isActive }) => ({
              padding: '0.45rem 0.65rem',
              color: isActive ? 'var(--secondary-color)' : 'var(--text-primary)',
              fontWeight: isActive ? 800 : 600,
              fontSize: '0.86rem',
              textDecoration: 'none',
              borderRadius: '6px'
            })}
          >
            Home
          </NavLink>

          <NavLink 
            to="/about" 
            style={({ isActive }) => ({
              padding: '0.45rem 0.65rem',
              color: isActive ? 'var(--secondary-color)' : 'var(--text-primary)',
              fontWeight: isActive ? 800 : 600,
              fontSize: '0.86rem',
              textDecoration: 'none',
              borderRadius: '6px'
            })}
          >
            About
          </NavLink>

          <NavLink 
            to="/academics" 
            style={({ isActive }) => ({
              padding: '0.45rem 0.65rem',
              color: isActive ? 'var(--secondary-color)' : 'var(--text-primary)',
              fontWeight: isActive ? 800 : 600,
              fontSize: '0.86rem',
              textDecoration: 'none',
              borderRadius: '6px'
            })}
          >
            Academics
          </NavLink>

          <NavLink 
            to="/facilities" 
            style={({ isActive }) => ({
              padding: '0.45rem 0.65rem',
              color: isActive ? 'var(--secondary-color)' : 'var(--text-primary)',
              fontWeight: isActive ? 800 : 600,
              fontSize: '0.86rem',
              textDecoration: 'none',
              borderRadius: '6px'
            })}
          >
            Facilities
          </NavLink>

          <NavLink 
            to="/blog" 
            style={({ isActive }) => ({
              padding: '0.45rem 0.65rem',
              color: isActive ? 'var(--secondary-color)' : 'var(--text-primary)',
              fontWeight: isActive ? 800 : 600,
              fontSize: '0.86rem',
              textDecoration: 'none',
              borderRadius: '6px'
            })}
          >
            Blogs
          </NavLink>

          <NavLink 
            to="/contact" 
            style={({ isActive }) => ({
              padding: '0.45rem 0.65rem',
              color: isActive ? 'var(--secondary-color)' : 'var(--text-primary)',
              fontWeight: isActive ? 800 : 600,
              fontSize: '0.86rem',
              textDecoration: 'none',
              borderRadius: '6px'
            })}
          >
            Contact
          </NavLink>

          {isAdmin && (
            <NavLink 
              to="/admin" 
              style={{
                padding: '0.35rem 0.65rem',
                backgroundColor: '#eff6ff',
                color: '#1d4ed8',
                borderRadius: '6px',
                fontWeight: 700,
                fontSize: '0.8rem',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                marginLeft: '0.2rem'
              }}
            >
              ⚙️ Admin
            </NavLink>
          )}
        </nav>

        {/* ========================================================
            RIGHT: Action Buttons & Mobile Hamburger
            ======================================================== */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
          
          {/* Admissions Button */}
          <Link
            to="/admissions"
            onClick={closeMenu}
            className="navbar-cta-desktop"
            style={{
              backgroundColor: 'var(--secondary-color)',
              color: '#ffffff',
              padding: '0.5rem 1.1rem',
              borderRadius: '6px',
              fontWeight: 800,
              fontSize: '0.85rem',
              textDecoration: 'none',
              boxShadow: '0 2px 6px rgba(194, 65, 12, 0.25)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              whiteSpace: 'nowrap'
            }}
          >
            <span>📝</span> Admissions 2026-27
          </Link>

          {/* Desktop Auth Button */}
          <div className="desktop-auth-btn">
            {user ? (
              <button 
                onClick={handleLogout} 
                className="btn btn-outline" 
                style={{ padding: '0.4rem 0.7rem', fontSize: '0.78rem', fontWeight: 600 }}
              >
                Sign Out
              </button>
            ) : (
              <Link 
                to="/login" 
                className="btn btn-outline"
                style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', fontWeight: 600, whiteSpace: 'nowrap' }}
              >
                Admin Login
              </Link>
            )}
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <button
            type="button"
            className="mobile-hamburger-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            style={{
              background: '#f8fafc',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              width: '40px',
              height: '40px',
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '1.25rem',
              color: 'var(--primary-color)',
              flexShrink: 0
            }}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

      </div>

      {/* ========================================================
          MOBILE EXPANDABLE MENU
          ======================================================== */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: '#ffffff',
          borderTop: '1px solid #e2e8f0',
          padding: '1.2rem 1rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.12)',
          display: 'grid',
          gap: '0.4rem',
          animation: 'fadeIn 0.15s ease'
        }}>
          {/* Prominent Admissions CTA at Top of Mobile Menu */}
          <Link
            to="/admissions"
            onClick={closeMenu}
            style={{
              backgroundColor: 'var(--secondary-color)',
              color: '#ffffff',
              padding: '0.8rem 1rem',
              borderRadius: '8px',
              fontWeight: 800,
              fontSize: '0.95rem',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 12px rgba(194, 65, 12, 0.3)',
              marginBottom: '0.6rem',
              textAlign: 'center'
            }}
          >
            <span>📝</span> Online Admission 2026-27 →
          </Link>

          {/* Quick Info Bar */}
          <div style={{
            padding: '0.5rem 0.75rem',
            backgroundColor: '#f8fafc',
            borderRadius: '6px',
            fontSize: '0.75rem',
            color: 'var(--text-secondary)',
            marginBottom: '0.4rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>📞 {phone}</span>
            <span style={{ color: 'var(--secondary-color)', fontWeight: 700 }}>CBSE Affiliated</span>
          </div>

          <NavLink 
            to="/" 
            end
            onClick={closeMenu}
            style={({ isActive }) => ({
              padding: '0.65rem 0.75rem',
              borderRadius: '6px',
              fontWeight: 700,
              fontSize: '0.95rem',
              color: isActive ? 'var(--secondary-color)' : 'var(--text-primary)',
              backgroundColor: isActive ? '#fef2f2' : 'transparent',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            })}
          >
            <span>🏠 Home</span>
            <span>›</span>
          </NavLink>

          <NavLink 
            to="/about" 
            onClick={closeMenu}
            style={({ isActive }) => ({
              padding: '0.65rem 0.75rem',
              borderRadius: '6px',
              fontWeight: 700,
              fontSize: '0.95rem',
              color: isActive ? 'var(--secondary-color)' : 'var(--text-primary)',
              backgroundColor: isActive ? '#fef2f2' : 'transparent',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            })}
          >
            <span>🏛️ About Us & Principal</span>
            <span>›</span>
          </NavLink>

          <NavLink 
            to="/academics" 
            onClick={closeMenu}
            style={({ isActive }) => ({
              padding: '0.65rem 0.75rem',
              borderRadius: '6px',
              fontWeight: 700,
              fontSize: '0.95rem',
              color: isActive ? 'var(--secondary-color)' : 'var(--text-primary)',
              backgroundColor: isActive ? '#fef2f2' : 'transparent',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            })}
          >
            <span>📚 Academic Wings (Nursery-XII)</span>
            <span>›</span>
          </NavLink>

          <NavLink 
            to="/facilities" 
            onClick={closeMenu}
            style={({ isActive }) => ({
              padding: '0.65rem 0.75rem',
              borderRadius: '6px',
              fontWeight: 700,
              fontSize: '0.95rem',
              color: isActive ? 'var(--secondary-color)' : 'var(--text-primary)',
              backgroundColor: isActive ? '#fef2f2' : 'transparent',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            })}
          >
            <span>🔬 Campus Facilities & Labs</span>
            <span>›</span>
          </NavLink>

          <NavLink 
            to="/blog" 
            onClick={closeMenu}
            style={({ isActive }) => ({
              padding: '0.65rem 0.75rem',
              borderRadius: '6px',
              fontWeight: 700,
              fontSize: '0.95rem',
              color: isActive ? 'var(--secondary-color)' : 'var(--text-primary)',
              backgroundColor: isActive ? '#fef2f2' : 'transparent',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            })}
          >
            <span>📰 School Blogs & News</span>
            <span>›</span>
          </NavLink>

          <NavLink 
            to="/contact" 
            onClick={closeMenu}
            style={({ isActive }) => ({
              padding: '0.65rem 0.75rem',
              borderRadius: '6px',
              fontWeight: 700,
              fontSize: '0.95rem',
              color: isActive ? 'var(--secondary-color)' : 'var(--text-primary)',
              backgroundColor: isActive ? '#fef2f2' : 'transparent',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            })}
          >
            <span>📍 Contact & Location</span>
            <span>›</span>
          </NavLink>

          {isAdmin && (
            <NavLink 
              to="/admin" 
              onClick={closeMenu}
              style={{
                padding: '0.65rem 0.75rem',
                borderRadius: '6px',
                fontWeight: 700,
                fontSize: '0.95rem',
                color: '#1d4ed8',
                backgroundColor: '#eff6ff',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '0.3rem'
              }}
            >
              <span>⚙️ Admin Portal Dashboard</span>
              <span>›</span>
            </NavLink>
          )}

          {/* Bottom Actions inside Mobile Drawer */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '0.6rem',
            paddingTop: '0.8rem',
            marginTop: '0.5rem',
            borderTop: '1px solid #e2e8f0'
          }}>
            {user ? (
              <button 
                onClick={() => { closeMenu(); handleLogout(); }} 
                className="btn btn-outline"
                style={{ padding: '0.65rem', fontSize: '0.9rem', fontWeight: 700, width: '100%' }}
              >
                Sign Out ({user.email})
              </button>
            ) : (
              <Link
                to="/login"
                onClick={closeMenu}
                className="btn btn-outline"
                style={{ padding: '0.65rem', fontSize: '0.9rem', fontWeight: 700, textAlign: 'center', width: '100%' }}
              >
                Parent / Staff ERP Login
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Responsive Media Queries */}
      <style>{`
        @media (max-width: 960px) {
          .desktop-nav-items {
            display: none !important;
          }
          .desktop-auth-btn {
            display: none !important;
          }
        }
        @media (max-width: 768px) {
          .navbar-cta-desktop {
            display: none !important;
          }
          .mobile-hamburger-btn {
            display: flex !important;
          }
        }
        @media (max-width: 480px) {
          .navbar-logo-img {
            max-height: 32px !important;
            max-width: 45px !important;
          }
          .navbar-school-title {
            font-size: 0.9rem !important;
            line-height: 1.15 !important;
          }
        }
      `}</style>
    </header>
  );
}
