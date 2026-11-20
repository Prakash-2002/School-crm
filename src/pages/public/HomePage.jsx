import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { fetchBlogPosts } from '../../firebase/blogService';
import { samplePublicPosts } from './BlogListPage';

export default function HomePage() {
  const { theme } = useTheme();
  const [circulars, setCirculars] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  // Indian School Sample Notice Board Items
  const officialNotices = [
    {
      date: 'NOV 20, 2026',
      tag: 'ADMISSION',
      title: 'Online Registration Open for Classes Nursery, LKG, UKG & Class XI (Session 2026-27)',
      urgent: true
    },
    {
      date: 'NOV 18, 2026',
      tag: 'CBSE',
      title: 'CBSE Class X & XII Pre-Board Examination 2026 Date Sheet and Guidelines Released',
      urgent: false
    },
    {
      date: 'NOV 15, 2026',
      tag: 'SPORTS',
      title: 'Annual Inter-House Athletics Meet & Championship Schedule Announced',
      urgent: false
    },
    {
      date: 'NOV 10, 2026',
      tag: 'CIRCULAR',
      title: 'Notice regarding Winter Uniform Transition & Parent-Teacher Meeting (PTM)',
      urgent: false
    }
  ];

  // House System
  const schoolHouses = [
    { name: 'Tagore House', color: '#b91c1c', motto: 'Truth & Wisdom', score: theme.houseTagoreScore || '1,420 Pts' },
    { name: 'Ashoka House', color: '#d97706', motto: 'Valor & Courage', score: theme.houseAshokaScore || '1,385 Pts' },
    { name: 'Shivaji House', color: '#1d4ed8', motto: 'Duty & Honor', score: theme.houseShivajiScore || '1,340 Pts' },
    { name: 'Raman House', color: '#047857', motto: 'Innovation & Science', score: theme.houseRamanScore || '1,310 Pts' }
  ];

  useEffect(() => {
    async function loadNotices() {
      try {
        const posts = await fetchBlogPosts({ onlyPublished: true });
        if (posts && posts.length > 0) {
          setCirculars(posts.slice(0, 3));
        } else {
          setCirculars(samplePublicPosts.slice(0, 3));
        }
      } catch {
        setCirculars(samplePublicPosts.slice(0, 3));
      } finally {
        setLoadingPosts(false);
      }
    }

    loadNotices();
  }, []);

  const schoolName = theme.schoolName || 'Greenwood Academy';
  const heroBg = theme.heroBgUrl || 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=1800&auto=format&fit=crop&q=85';
  const principalImg = theme.principalImgUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=85';
  const labImg = theme.labImgUrl || 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=800&auto=format&fit=crop&q=80';
  const sportsImg = theme.sportsImgUrl || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop&q=80';
  const libraryImg = theme.libraryImgUrl || 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&auto=format&fit=crop&q=80';
  const smartClassImg = theme.smartClassImgUrl || 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80';

  return (
    <div style={{ backgroundColor: '#ffffff', color: 'var(--text-primary)', overflowX: 'hidden' }}>

      {/* ========================================================
          1. FLASH NEWS TICKER / MARQUEE
          ======================================================== */}
      <div style={{
        backgroundColor: '#991b1b',
        color: '#ffffff',
        padding: '0.4rem 0.8rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        fontSize: '0.82rem',
        overflow: 'hidden',
        borderBottom: '2px solid var(--accent-color)'
      }}>
        <div style={{
          backgroundColor: '#ffffff',
          color: '#991b1b',
          padding: '0.15rem 0.5rem',
          borderRadius: '4px',
          fontWeight: 900,
          fontSize: '0.7rem',
          letterSpacing: '0.04em',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem'
        }}>
          <span>⚡</span> <span className="ticker-label">UPDATES</span>
        </div>
        <div style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden' }}>
          <marquee behavior="scroll" direction="left" scrollamount="5">
            {theme.tickerText || 'ADMISSIONS OPEN FOR ACADEMIC SESSION 2026-27 (PRE-NURSERY TO CLASS XI) • REGISTRATION FORMS AVAILABLE ONLINE • CBSE BOARD EXAMINATION 2026 PRACTICAL DATES ANNOUNCED • SCHOLARSHIP APTITUDE TEST THIS SUNDAY'}
          </marquee>
        </div>
      </div>

      {/* ========================================================
          2. GRAND CAMPUS HERO BANNER
          ======================================================== */}
      <section className="hero-section" style={{
        position: 'relative',
        minHeight: '70vh',
        backgroundImage: `linear-gradient(to right, rgba(10, 37, 64, 0.94) 0%, rgba(10, 37, 64, 0.82) 55%, rgba(10, 37, 64, 0.6) 100%), url(${heroBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        padding: '4rem 1.2rem 3.5rem'
      }}>
        <div className="container" style={{ maxWidth: '1280px', margin: '0 auto', width: '100%', padding: 0 }}>
          
          {/* Eyebrow Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.3rem 0.75rem',
            borderRadius: '4px',
            backgroundColor: 'rgba(217, 119, 6, 0.25)',
            border: '1px solid var(--accent-color)',
            color: 'var(--accent-color)',
            fontWeight: 800,
            fontSize: 'clamp(0.7rem, 2.5vw, 0.82rem)',
            letterSpacing: '0.08em',
            marginBottom: '1.2rem',
            maxWidth: '100%'
          }}>
            <span>★</span> <span>{theme.heroEyebrow || 'ESTABLISHED 1988 • NIRF TOP RANKED CBSE INSTITUTION'}</span>
          </div>

          {/* Main Headline */}
          <h1 style={{
            fontSize: 'clamp(1.85rem, 5.5vw, 3.8rem)',
            fontWeight: 900,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            maxWidth: '850px',
            marginBottom: '1rem',
            color: '#ffffff'
          }}>
            {theme.heroTitle || 'Nurturing Global Achievers, Rooted in Indian Values.'}
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: 'clamp(0.92rem, 2.5vw, 1.2rem)',
            lineHeight: 1.6,
            maxWidth: '700px',
            color: 'rgba(255, 255, 255, 0.9)',
            marginBottom: '2rem'
          }}>
            {theme.heroSubtitle || 'Empowering students with CBSE curriculum, Atal Tinkering Labs, Olympic-standard sports, and holistic moral leadership.'}
          </p>

          {/* Action CTAs */}
          <div className="hero-cta-group" style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <Link
              to="/admissions"
              className="btn-hero-primary"
              style={{
                backgroundColor: 'var(--secondary-color)',
                color: '#ffffff',
                padding: '0.85rem 1.8rem',
                borderRadius: '6px',
                fontWeight: 800,
                fontSize: '0.95rem',
                textDecoration: 'none',
                boxShadow: '0 4px 15px rgba(194, 65, 12, 0.35)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                textTransform: 'uppercase',
                letterSpacing: '0.04em'
              }}
            >
              {theme.heroCtaPrimary || 'Online Admission 2026-27 →'}
            </Link>

            <Link
              to="/facilities"
              className="btn-hero-secondary"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.5)',
                padding: '0.85rem 1.5rem',
                borderRadius: '6px',
                fontWeight: 700,
                fontSize: '0.92rem',
                textDecoration: 'none',
                backdropFilter: 'blur(6px)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem'
              }}
            >
              Explore Campus Facilities
            </Link>
          </div>

        </div>
      </section>

      {/* ========================================================
          3. STATS STRIP & KEY SERVICES
          ======================================================== */}
      <section style={{ backgroundColor: '#071829', color: '#ffffff', padding: '1.8rem 1rem', borderBottom: '4px solid var(--accent-color)' }}>
        <div className="container" style={{ maxWidth: '1280px', margin: '0 auto', padding: 0 }}>
          
          {/* 4 Academic Pillars Metrics */}
          <div className="stats-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1rem',
            textAlign: 'center',
            marginBottom: '1.8rem'
          }}>
            <div className="stat-cell" style={{ padding: '0.6rem' }}>
              <div style={{ fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', fontWeight: 900, color: 'var(--accent-color)', lineHeight: 1 }}>
                {theme.stat1Num || '2,800+'}
              </div>
              <div style={{ fontSize: 'clamp(0.68rem, 2vw, 0.8rem)', fontWeight: 700, letterSpacing: '0.06em', marginTop: '0.35rem', color: '#cbd5e1' }}>
                {theme.stat1Label || 'STUDENTS ENROLLED'}
              </div>
            </div>

            <div className="stat-cell" style={{ padding: '0.6rem' }}>
              <div style={{ fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', fontWeight: 900, color: '#38bdf8', lineHeight: 1 }}>
                {theme.stat2Num || '100%'}
              </div>
              <div style={{ fontSize: 'clamp(0.68rem, 2vw, 0.8rem)', fontWeight: 700, letterSpacing: '0.06em', marginTop: '0.35rem', color: '#cbd5e1' }}>
                {theme.stat2Label || 'CBSE BOARD PASS RATE'}
              </div>
            </div>

            <div className="stat-cell" style={{ padding: '0.6rem' }}>
              <div style={{ fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', fontWeight: 900, color: '#4ade80', lineHeight: 1 }}>
                {theme.stat3Num || '18 : 1'}
              </div>
              <div style={{ fontSize: 'clamp(0.68rem, 2vw, 0.8rem)', fontWeight: 700, letterSpacing: '0.06em', marginTop: '0.35rem', color: '#cbd5e1' }}>
                {theme.stat3Label || 'STUDENT-TEACHER RATIO'}
              </div>
            </div>

            <div className="stat-cell" style={{ padding: '0.6rem' }}>
              <div style={{ fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', fontWeight: 900, color: 'var(--accent-color)', lineHeight: 1 }}>
                {theme.stat4Num || '35+ Yrs'}
              </div>
              <div style={{ fontSize: 'clamp(0.68rem, 2vw, 0.8rem)', fontWeight: 700, letterSpacing: '0.06em', marginTop: '0.35rem', color: '#cbd5e1' }}>
                {theme.stat4Label || 'LEGACY OF EXCELLENCE'}
              </div>
            </div>
          </div>

          {/* 4 Key Indian School Online Services */}
          <div className="services-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '0.8rem',
            paddingTop: '1.2rem',
            borderTop: '1px solid rgba(255,255,255,0.15)'
          }}>
            {[
              { icon: '💳', title: 'Online Fee Payment', desc: 'Secure payment gateway', link: '/admissions' },
              { icon: '📝', title: 'Online Registration', desc: 'Pre-School to Class XI', link: '/admissions' },
              { icon: '📄', title: 'TC Verification', desc: 'Transfer Certificate search', link: '/contact' },
              { icon: '📋', title: 'Mandatory Disclosure', desc: 'CBSE Public Disclosure (SARAS)', link: '/contact#disclosure' },
            ].map((srv, i) => (
              <Link
                key={i}
                to={srv.link}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  borderRadius: '8px',
                  padding: '0.85rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.8rem',
                  border: '1px solid rgba(255,255,255,0.1)',
                  textDecoration: 'none',
                  transition: 'background-color 0.2s'
                }}
              >
                <span style={{ fontSize: '1.6rem', flexShrink: 0 }}>{srv.icon}</span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{srv.title}</div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{srv.desc}</div>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================
          4. PRINCIPAL'S DESK
          ======================================================== */}
      <section id="about" className="section-padding" style={{ padding: '3.5rem 1.2rem', backgroundColor: '#f8fafc' }}>
        <div className="container" style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2.5rem',
          alignItems: 'center',
          padding: 0
        }}>
          
          {/* Principal Photo Card */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              position: 'relative',
              display: 'inline-block',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 12px 30px rgba(0,0,0,0.1)',
              border: '4px solid #ffffff',
              maxWidth: '320px',
              width: '100%'
            }}>
              <img
                src={principalImg}
                alt="Principal"
                style={{ width: '100%', height: '360px', objectFit: 'cover', display: 'block' }}
              />
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: 'rgba(10, 37, 64, 0.94)',
                color: '#ffffff',
                padding: '0.85rem',
                backdropFilter: 'blur(6px)'
              }}>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: '#ffffff' }}>
                  {theme.principalName || 'Dr. Sunita Sharma'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--accent-color)', fontWeight: 600 }}>
                  {theme.principalDesignation || 'Principal & Director of Academics'}
                </div>
              </div>
            </div>
          </div>

          {/* Message Text */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ width: '24px', height: '3px', backgroundColor: 'var(--secondary-color)', display: 'inline-block' }} />
              <span style={{ fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.08em', color: 'var(--secondary-color)', textTransform: 'uppercase' }}>
                FROM THE PRINCIPAL'S DESK
              </span>
            </div>

            <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', fontWeight: 900, color: 'var(--primary-color)', lineHeight: 1.25, marginBottom: '1rem' }}>
              "विद्या ददाति विनयं" — True Knowledge Imparts Humility & Strength
            </h2>

            <blockquote style={{
              fontSize: 'clamp(0.92rem, 2.5vw, 1.05rem)',
              lineHeight: 1.65,
              color: 'var(--text-secondary)',
              fontStyle: 'italic',
              borderLeft: '4px solid var(--accent-color)',
              padding: '1rem 1.2rem',
              marginBottom: '1.2rem',
              backgroundColor: '#ffffff',
              borderRadius: '0 8px 8px 0'
            }}>
              {theme.principalQuote || '“Education is not merely the accumulation of facts; it is the illumination of character, discipline, and curiosity. At our institution, we integrate modern scientific inquiry with timeless Indian ethos to prepare learners who excel nationally and globally.”'}
            </blockquote>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.65, marginBottom: '1.5rem' }}>
              Under the National Education Policy (NEP 2020), our curriculum seamlessly blends artificial intelligence, experiential science labs, classical Indian arts, and sports excellence. We prepare learners to conquer global challenges while upholding national values.
            </p>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <Link to="/about" className="btn btn-outline" style={{ fontWeight: 700, borderColor: 'var(--primary-color)', color: 'var(--primary-color)', fontSize: '0.88rem' }}>
                Read Full Leadership Message →
              </Link>
              <Link to="/academics" style={{ fontSize: '0.85rem', color: 'var(--secondary-color)', fontWeight: 700, textDecoration: 'none' }}>
                Explore Curriculum Divisions ›
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================
          5. ACADEMIC WINGS
          ======================================================== */}
      <section id="academics" className="section-padding" style={{ padding: '3.5rem 1.2rem', backgroundColor: '#ffffff' }}>
        <div className="container" style={{ maxWidth: '1280px', margin: '0 auto', padding: 0 }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.08em', color: 'var(--secondary-color)', textTransform: 'uppercase' }}>
                EDUCATIONAL DIVISIONS
              </span>
              <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', fontWeight: 900, color: 'var(--primary-color)', marginTop: '0.3rem' }}>
                Comprehensive CBSE Curriculum
              </h2>
            </div>
            <Link to="/academics" className="btn btn-outline" style={{ fontWeight: 700, fontSize: '0.88rem' }}>
              View Detailed Curriculum & Streams →
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.2rem'
          }}>
            {/* Wing 1 */}
            <div className="card" style={{ borderTop: '4px solid #e11d48', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.6rem' }}>🧸</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-color)', marginBottom: '0.2rem' }}>
                Pre-Primary Wing
              </h3>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#e11d48', textTransform: 'uppercase', marginBottom: '0.6rem' }}>
                Playgroup • Nursery • KG
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.55, flex: 1 }}>
                Playway methodology, phonetics, sensory exploration, motor skills, and loving care in vibrant theme-based classrooms.
              </p>
              <div style={{ marginTop: '0.8rem', paddingTop: '0.6rem', borderTop: '1px solid #f1f5f9' }}>
                <Link to="/academics" style={{ fontSize: '0.82rem', color: '#e11d48', fontWeight: 700, textDecoration: 'none' }}>
                  Explore Wing Curriculum →
                </Link>
              </div>
            </div>

            {/* Wing 2 */}
            <div className="card" style={{ borderTop: '4px solid #2563eb', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.6rem' }}>🎒</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-color)', marginBottom: '0.2rem' }}>
                Primary Wing
              </h3>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', marginBottom: '0.6rem' }}>
                Classes I – V
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.55, flex: 1 }}>
                Foundational literacy and numeracy (FLN), bilingual communication, environmental studies, and creative arts.
              </p>
              <div style={{ marginTop: '0.8rem', paddingTop: '0.6rem', borderTop: '1px solid #f1f5f9' }}>
                <Link to="/academics" style={{ fontSize: '0.82rem', color: '#2563eb', fontWeight: 700, textDecoration: 'none' }}>
                  Explore Wing Curriculum →
                </Link>
              </div>
            </div>

            {/* Wing 3 */}
            <div className="card" style={{ borderTop: '4px solid #059669', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.6rem' }}>📐</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-color)', marginBottom: '0.2rem' }}>
                Middle & Secondary
              </h3>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669', textTransform: 'uppercase', marginBottom: '0.6rem' }}>
                Classes VI – X (CBSE Board)
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.55, flex: 1 }}>
                Rigorous NCERT curriculum, Science and Mathematics laboratories, Coding & AI integration, and Social Sciences.
              </p>
              <div style={{ marginTop: '0.8rem', paddingTop: '0.6rem', borderTop: '1px solid #f1f5f9' }}>
                <Link to="/academics" style={{ fontSize: '0.82rem', color: '#059669', fontWeight: 700, textDecoration: 'none' }}>
                  Explore Wing Curriculum →
                </Link>
              </div>
            </div>

            {/* Wing 4 */}
            <div className="card" style={{ borderTop: '4px solid var(--secondary-color)', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.6rem' }}>🎓</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-color)', marginBottom: '0.2rem' }}>
                Senior Secondary (10+2)
              </h3>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--secondary-color)', textTransform: 'uppercase', marginBottom: '0.6rem' }}>
                Classes XI – XII • All Streams
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.55, flex: 1 }}>
                Specialized streams: <strong>Science (Medical/Non-Med)</strong>, <strong>Commerce</strong>, and <strong>Humanities</strong> with JEE/NEET/CUET coaching.
              </p>
              <div style={{ marginTop: '0.8rem', paddingTop: '0.6rem', borderTop: '1px solid #f1f5f9' }}>
                <Link to="/academics" style={{ fontSize: '0.82rem', color: 'var(--secondary-color)', fontWeight: 700, textDecoration: 'none' }}>
                  Explore Wing Curriculum →
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================
          6. CAMPUS FACILITIES & LABS
          ======================================================== */}
      <section id="facilities" className="section-padding" style={{ padding: '3.5rem 1.2rem', backgroundColor: '#f1f5f9' }}>
        <div className="container" style={{ maxWidth: '1280px', margin: '0 auto', padding: 0 }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '0.8rem' }}>
            <div>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.08em', color: 'var(--secondary-color)', textTransform: 'uppercase' }}>
                STATE-OF-THE-ART CAMPUS
              </span>
              <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', fontWeight: 900, color: 'var(--primary-color)', marginTop: '0.3rem' }}>
                Facilities & Centers of Excellence
              </h2>
            </div>
            <Link to="/facilities" className="btn btn-outline" style={{ fontWeight: 700, fontSize: '0.88rem' }}>
              Explore All Facilities →
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.2rem'
          }}>
            {/* Facility 1 */}
            <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <img src={labImg} alt="Science Labs" style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
              <div style={{ padding: '1.2rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary-color)', marginBottom: '0.3rem' }}>
                  Atal Tinkering & STEM Labs
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5, flex: 1 }}>
                  NITI Aayog ATL, 3D printing, Robotics kits, and dedicated Physics, Chemistry & Biology research stations.
                </p>
                <div style={{ marginTop: '0.8rem', paddingTop: '0.6rem', borderTop: '1px solid #f1f5f9' }}>
                  <Link to="/facilities" style={{ fontSize: '0.82rem', color: 'var(--secondary-color)', fontWeight: 700, textDecoration: 'none' }}>
                    View Lab Details →
                  </Link>
                </div>
              </div>
            </div>

            {/* Facility 2 */}
            <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <img src={sportsImg} alt="Sports Ground" style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
              <div style={{ padding: '1.2rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary-color)', marginBottom: '0.3rem' }}>
                  Sports Academy & Grounds
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5, flex: 1 }}>
                  Cricket practice turf, basketball courts, badminton arena, taekwondo studio, and certified physical trainers.
                </p>
                <div style={{ marginTop: '0.8rem', paddingTop: '0.6rem', borderTop: '1px solid #f1f5f9' }}>
                  <Link to="/facilities" style={{ fontSize: '0.82rem', color: 'var(--secondary-color)', fontWeight: 700, textDecoration: 'none' }}>
                    View Sports Complex →
                  </Link>
                </div>
              </div>
            </div>

            {/* Facility 3 */}
            <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <img src={libraryImg} alt="Library" style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
              <div style={{ padding: '1.2rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary-color)', marginBottom: '0.3rem' }}>
                  Central Resource Library
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5, flex: 1 }}>
                  Over 18,000 reference books, encyclopedias, competitive exam materials, national periodicals, and e-terminals.
                </p>
                <div style={{ marginTop: '0.8rem', paddingTop: '0.6rem', borderTop: '1px solid #f1f5f9' }}>
                  <Link to="/facilities" style={{ fontSize: '0.82rem', color: 'var(--secondary-color)', fontWeight: 700, textDecoration: 'none' }}>
                    View Library Resources →
                  </Link>
                </div>
              </div>
            </div>

            {/* Facility 4 */}
            <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <img src={smartClassImg} alt="Smart Classes" style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
              <div style={{ padding: '1.2rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary-color)', marginBottom: '0.3rem' }}>
                  Digital Smart Classrooms
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5, flex: 1 }}>
                  Interactive flat panels, high-speed Wi-Fi, audio-visual lecture recording, and air-conditioned learning spaces.
                </p>
                <div style={{ marginTop: '0.8rem', paddingTop: '0.6rem', borderTop: '1px solid #f1f5f9' }}>
                  <Link to="/facilities" style={{ fontSize: '0.82rem', color: 'var(--secondary-color)', fontWeight: 700, textDecoration: 'none' }}>
                    View Smart Classrooms →
                  </Link>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================
          7. NOTICE BOARD & HOUSE TROPHIES
          ======================================================== */}
      <section className="section-padding" style={{ padding: '3.5rem 1.2rem', backgroundColor: '#ffffff' }}>
        <div className="container" style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          padding: 0
        }}>
          
          {/* Left: School Blogs & Updates */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', borderBottom: '2px solid var(--primary-color)', paddingBottom: '0.5rem' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '0.4rem', margin: 0 }}>
                <span>📰</span> School Blogs & Updates
              </h2>
              <Link to="/blog" style={{ color: 'var(--secondary-color)', fontWeight: 700, fontSize: '0.82rem', textDecoration: 'none' }}>
                All Stories & News →
              </Link>
            </div>

            <div style={{ display: 'grid', gap: '0.8rem' }}>
              {circulars && circulars.length > 0 ? (
                circulars.map((post) => (
                  <Link
                    key={post.id}
                    to={`/blog/${post.slug || post.id}`}
                    style={{
                      textDecoration: 'none',
                      padding: '0.85rem 1rem',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      borderLeft: '4px solid var(--primary-color)',
                      display: 'block',
                      transition: 'border-color 0.2s, box-shadow 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                      <span style={{
                        backgroundColor: '#e0f2fe',
                        color: '#0369a1',
                        padding: '1px 6px',
                        borderRadius: '4px',
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        textTransform: 'uppercase'
                      }}>
                        {post.category || 'School Life'}
                      </span>
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                        {post.publishedAt || 'Recent'}
                      </span>
                    </div>
                    <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--primary-color)', lineHeight: 1.35, marginBottom: '0.2rem' }}>
                      {post.title}
                    </div>
                    {post.summary && (
                      <p style={{
                        fontSize: '0.8rem',
                        color: 'var(--text-secondary)',
                        margin: 0,
                        lineHeight: 1.45,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {post.summary}
                      </p>
                    )}
                  </Link>
                ))
              ) : (
                officialNotices.map((ntc, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '0.85rem 1rem',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      borderLeft: ntc.urgent ? '4px solid #ef4444' : '4px solid var(--primary-color)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                      <span style={{
                        backgroundColor: ntc.urgent ? '#fee2e2' : '#e0f2fe',
                        color: ntc.urgent ? '#991b1b' : '#0369a1',
                        padding: '1px 5px',
                        borderRadius: '4px',
                        fontSize: '0.68rem',
                        fontWeight: 800
                      }}>
                        {ntc.tag}
                      </span>
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                        {ntc.date}
                      </span>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: 1.4 }}>
                      {ntc.title}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right: House Championship */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', borderBottom: '2px solid var(--accent-color)', paddingBottom: '0.5rem' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '0.4rem', margin: 0 }}>
                <span>🛡️</span> Inter-House Trophies
              </h2>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Session 2026-27</span>
            </div>

            <div style={{ display: 'grid', gap: '0.8rem' }}>
              {schoolHouses.map((hs, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1.1rem',
                    borderRadius: '8px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderLeft: `5px solid ${hs.color}`,
                    boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                      {hs.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontStyle: 'italic', marginTop: '2px' }}>
                      "{hs.motto}"
                    </div>
                  </div>
                  <div style={{
                    backgroundColor: '#f1f5f9',
                    padding: '0.3rem 0.75rem',
                    borderRadius: '50px',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    color: hs.color
                  }}>
                    {hs.score}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================
          8. ADMISSIONS CALL TO ACTION (SESSION 2026-27)
          ======================================================== */}
      <section id="admissions" style={{
        background: `linear-gradient(135deg, var(--primary-color) 0%, #081d33 100%)`,
        color: '#ffffff',
        padding: '3.5rem 1.2rem',
        textAlign: 'center',
        borderTop: '4px solid var(--secondary-color)'
      }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: 0 }}>
          
          <div style={{
            display: 'inline-block',
            backgroundColor: 'var(--secondary-color)',
            color: '#ffffff',
            padding: '0.25rem 0.8rem',
            borderRadius: '4px',
            fontSize: '0.75rem',
            fontWeight: 800,
            letterSpacing: '0.08em',
            marginBottom: '0.8rem',
            textTransform: 'uppercase'
          }}>
            ADMISSIONS OPEN • SESSION 2026-2027
          </div>

          <h2 style={{ fontSize: 'clamp(1.75rem, 5vw, 2.8rem)', fontWeight: 900, marginBottom: '0.8rem', color: '#ffffff', lineHeight: 1.2 }}>
            Give Your Child the Foundation for a Lifetime of Success
          </h2>

          <p style={{ fontSize: 'clamp(0.92rem, 2.5vw, 1.1rem)', lineHeight: 1.6, maxWidth: '650px', margin: '0 auto 2rem', opacity: 0.9 }}>
            Join the community of {schoolName}. Fill out the online registration form to begin the admission process for Pre-School to Class XI.
          </p>

          <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              to="/admissions"
              style={{
                backgroundColor: 'var(--secondary-color)',
                color: '#ffffff',
                padding: '0.85rem 1.8rem',
                borderRadius: '6px',
                fontWeight: 800,
                fontSize: '0.92rem',
                textDecoration: 'none',
                textTransform: 'uppercase',
                boxShadow: '0 4px 12px rgba(194, 65, 12, 0.4)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              className="admissions-btn"
            >
              Fill Online Admission Form →
            </Link>

            <Link
              to="/contact"
              style={{
                backgroundColor: 'transparent',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.5)',
                padding: '0.85rem 1.5rem',
                borderRadius: '6px',
                fontWeight: 700,
                fontSize: '0.92rem',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              className="admissions-btn"
            >
              Campus Visit / Helpdesk
            </Link>
          </div>

        </div>
      </section>

      {/* Responsive Inline CSS for Mobile Refinements */}
      <style>{`
        @media (max-width: 640px) {
          .stats-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 0.6rem !important;
          }
          .services-grid {
            grid-template-columns: 1fr 1fr !important;
          }
          .hero-cta-group {
            flex-direction: column !important;
            width: 100% !important;
          }
          .btn-hero-primary,
          .btn-hero-secondary,
          .admissions-btn {
            width: 100% !important;
            text-align: center !important;
          }
          .ticker-label {
            display: none;
          }
        }
        @media (max-width: 420px) {
          .services-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

    </div>
  );
}
