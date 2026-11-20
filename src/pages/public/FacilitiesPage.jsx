import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import PageBanner from '../../components/PageBanner';

export default function FacilitiesPage() {
  const { theme } = useTheme();

  const labImg = theme.labImgUrl || 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=800&auto=format&fit=crop&q=80';
  const sportsImg = theme.sportsImgUrl || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop&q=80';
  const libraryImg = theme.libraryImgUrl || 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&auto=format&fit=crop&q=80';
  const smartClassImg = theme.smartClassImgUrl || 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80';

  const facilities = [
    {
      title: 'Atal Tinkering & STEM Innovation Hub',
      badge: 'NITI AAYOG SUPPORTED',
      img: labImg,
      desc: 'Our Atal Tinkering Lab (ATL) equips students with hands-on exposure to 3D printing, artificial intelligence, robotics, IoT sensors, and design thinking. Additionally, full-fledged laboratories for Physics, Chemistry, and Biology empower hands-on scientific discovery.'
    },
    {
      title: 'Olympic-Standard Sports Complex',
      badge: 'FIT INDIA CERTIFIED',
      img: sportsImg,
      desc: 'State-of-the-art sports facilities including a BCCI-specification turf cricket ground, all-weather basketball courts, synthetic badminton courts, athletic running track, skating rink, and professional NIS-certified coaches across multiple sporting disciplines.'
    },
    {
      title: 'Central Resource Library & Knowledge Center',
      badge: '18,000+ BOOKS & DIGITAL E-RESOURCES',
      img: libraryImg,
      desc: 'A sanctuary of wisdom featuring over 18,000 volumes across fiction, non-fiction, encyclopedias, and competitive examination references (JEE/NEET/UPSC). Equipped with high-speed digital terminals and Kindle e-readers.'
    },
    {
      title: 'Digital Smart Classrooms',
      badge: '100% INTERACTIVE PANELS',
      img: smartClassImg,
      desc: 'All classrooms are equipped with high-resolution interactive flat panel displays (IFPD), multimedia audiovisual resources, climate control, and ergonomic child-safe furniture designed to facilitate active collaborative learning.'
    }
  ];

  return (
    <div>
      <PageBanner 
        title="Campus Infrastructure & Centers of Excellence" 
        subtitle="A vibrant, secure, and modern 25-acre learning ecosystem designed for all-round development"
        breadcrumb="Facilities"
      />

      <section style={{ padding: '4rem 1.2rem', backgroundColor: '#ffffff' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: 0 }}>
          
          <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.08em', color: 'var(--secondary-color)', textTransform: 'uppercase' }}>
              WORLD-CLASS ENVIRONMENT
            </span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', fontWeight: 900, color: 'var(--primary-color)', marginTop: '0.3rem' }}>
              Designed to Inspire Curiosity & Excellence
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.4rem' }}>
              From robotics labs to green athletic fields, every space on our campus is crafted to stimulate intellectual and physical growth.
            </p>
          </div>

          {/* Facility Detailed Cards */}
          <div style={{ display: 'grid', gap: '3rem' }}>
            {facilities.map((fac, i) => (
              <div
                key={i}
                className="card"
                style={{
                  padding: 0,
                  overflow: 'hidden',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                  alignItems: 'center',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
                }}
              >
                <div style={{ height: '320px', overflow: 'hidden' }}>
                  <img
                    src={fac.img}
                    alt={fac.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ padding: '2.5rem 2rem' }}>
                  <span style={{
                    backgroundColor: '#eff6ff',
                    color: '#1d4ed8',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '4px',
                    fontWeight: 800,
                    fontSize: '0.75rem',
                    letterSpacing: '0.06em'
                  }}>
                    {fac.badge}
                  </span>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--primary-color)', margin: '0.8rem 0 0.6rem' }}>
                    {fac.title}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1.2rem' }}>
                    {fac.desc}
                  </p>
                  <Link to="/contact" style={{ color: 'var(--secondary-color)', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none' }}>
                    Book a Campus Tour →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Safety & Medical Card */}
          <div style={{
            marginTop: '3.5rem',
            padding: '2rem',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.5rem'
          }}>
            <div>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🚌</div>
              <h4 style={{ fontWeight: 800, color: 'var(--primary-color)', marginBottom: '0.3rem' }}>GPS Fleet Transport</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6 }}>AC school buses covering all major city routes with live GPS parent tracking, female attendants, and speed governors.</p>
            </div>

            <div>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏥</div>
              <h4 style={{ fontWeight: 800, color: 'var(--primary-color)', marginBottom: '0.3rem' }}>Medical Infirmary</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6 }}>Full-time MBBS doctor and qualified nurse on duty, emergency medical equipment, and tie-ups with leading multi-specialty hospitals.</p>
            </div>

            <div>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🛡️</div>
              <h4 style={{ fontWeight: 800, color: 'var(--primary-color)', marginBottom: '0.3rem' }}>24/7 CCTV & Security</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6 }}>Over 350 high-definition CCTV cameras covering every classroom, corridor, and boundary wall with biometric visitor gates.</p>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
