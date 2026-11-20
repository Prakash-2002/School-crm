import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import PageBanner from '../../components/PageBanner';

export default function AboutPage() {
  const { theme } = useTheme();

  const schoolName = theme.schoolName || 'Greenwood Academy';
  const principalImg = theme.principalImgUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=85';

  return (
    <div>
      <PageBanner 
        title="About Our Institution" 
        subtitle={`Excellence in Education, Character in Life • Serving the Nation since 1988`}
        breadcrumb="About Us"
      />

      {/* 1. Vision, Mission & Core Values */}
      <section style={{ padding: '4rem 1.2rem', backgroundColor: '#ffffff' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: 0 }}>
          
          <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.08em', color: 'var(--secondary-color)', textTransform: 'uppercase' }}>
              OUR FOUNDATIONAL PHILOSOPHY
            </span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', fontWeight: 900, color: 'var(--primary-color)', marginTop: '0.3rem' }}>
              Vision, Mission & Timeless Indian Values
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.8rem'
          }}>
            {/* Vision */}
            <div className="card" style={{ borderTop: '4px solid var(--primary-color)', padding: '2rem' }}>
              <div style={{ fontSize: '2.4rem', marginBottom: '1rem' }}>🔭</div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary-color)', marginBottom: '0.6rem' }}>
                Our Vision
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7 }}>
                To be a premier center of holistic learning that nurtures intellectually curious, morally upright, and culturally rooted global citizens who contribute meaningfully to national progress and humanity.
              </p>
            </div>

            {/* Mission */}
            <div className="card" style={{ borderTop: '4px solid var(--secondary-color)', padding: '2rem' }}>
              <div style={{ fontSize: '2.4rem', marginBottom: '1rem' }}>🎯</div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary-color)', marginBottom: '0.6rem' }}>
                Our Mission
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7 }}>
                To empower learners through the progressive CBSE curriculum, cutting-edge STEM and AI laboratories, competitive sports training, and experiential pedagogy aligned with the National Education Policy (NEP 2020).
              </p>
            </div>

            {/* Core Values */}
            <div className="card" style={{ borderTop: '4px solid var(--accent-color)', padding: '2rem' }}>
              <div style={{ fontSize: '2.4rem', marginBottom: '1rem' }}>💎</div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary-color)', marginBottom: '0.6rem' }}>
                Our Core Pillars
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.6rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                <li><strong>Satya (Truth):</strong> Intellectual honesty and scientific rigor</li>
                <li><strong>Dharma (Righteousness):</strong> Moral integrity and ethical conduct</li>
                <li><strong>Shanti (Peace):</strong> Universal empathy and emotional resilience</li>
                <li><strong>Seva (Service):</strong> Dedication to society and nation-building</li>
              </ul>
            </div>
          </div>

        </div>
      </section>

      {/* 2. From the Principal's Desk */}
      <section style={{ padding: '4rem 1.2rem', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
        <div className="container" style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '3rem',
          alignItems: 'center',
          padding: 0
        }}>
          {/* Portrait */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              position: 'relative',
              display: 'inline-block',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 15px 35px rgba(0,0,0,0.12)',
              border: '6px solid #ffffff',
              maxWidth: '360px',
              width: '100%'
            }}>
              <img
                src={principalImg}
                alt="Principal"
                style={{ width: '100%', height: '420px', objectFit: 'cover', display: 'block' }}
              />
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: 'rgba(10, 37, 64, 0.94)',
                color: '#ffffff',
                padding: '1rem',
                backdropFilter: 'blur(6px)'
              }}>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#ffffff' }}>
                  {theme.principalName || 'Dr. Sunita Sharma, Ph.D.'}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--accent-color)', fontWeight: 600 }}>
                  {theme.principalDesignation || 'Principal & Director of Academics'}
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Message */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
              <span style={{ width: '28px', height: '3px', backgroundColor: 'var(--secondary-color)', display: 'inline-block' }} />
              <span style={{ fontSize: '0.82rem', fontWeight: 800, letterSpacing: '0.1em', color: 'var(--secondary-color)', textTransform: 'uppercase' }}>
                LEADERSHIP PERSPECTIVE
              </span>
            </div>

            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', fontWeight: 900, color: 'var(--primary-color)', lineHeight: 1.2, marginBottom: '1.2rem' }}>
              "विद्या ददाति विनयं" — True Knowledge Imparts Humility & Strength
            </h2>

            <blockquote style={{
              fontSize: '1.05rem',
              lineHeight: 1.7,
              color: 'var(--text-secondary)',
              fontStyle: 'italic',
              borderLeft: '4px solid var(--accent-color)',
              padding: '1.2rem',
              marginBottom: '1.5rem',
              backgroundColor: '#ffffff',
              borderRadius: '0 8px 8px 0'
            }}>
              {theme.principalQuote || '“Education is not merely the accumulation of facts; it is the illumination of character, discipline, and curiosity. At our institution, we integrate modern scientific inquiry with timeless Indian ethos to prepare learners who excel nationally and globally.”'}
            </blockquote>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1rem' }}>
              Welcome to {schoolName}. For more than three decades, our campus has stood as a beacon of academic rigor and character formation. We believe every child is endowed with unique potential, and our role is to kindle that spark into an enduring flame of wisdom.
            </p>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
              With dedicated teachers, world-class sports facilities, and Atal Tinkering Labs, we provide the ideal launchpad for the future doctors, engineers, civil servants, entrepreneurs, and artists of India.
            </p>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <Link to="/contact" className="btn btn-primary" style={{ fontWeight: 800, backgroundColor: 'var(--secondary-color)', borderColor: 'var(--secondary-color)' }}>
                Schedule Campus Interaction →
              </Link>
              <Link to="/academics" className="btn btn-outline" style={{ fontWeight: 700 }}>
                Explore Academic Wings
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Accreditations & Honors */}
      <section style={{ padding: '4rem 1.2rem', backgroundColor: '#ffffff' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center', padding: 0 }}>
          
          <span style={{ fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.08em', color: 'var(--secondary-color)', textTransform: 'uppercase' }}>
            PROUD RECOGNITIONS
          </span>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', fontWeight: 900, color: 'var(--primary-color)', marginTop: '0.3rem', marginBottom: '2.5rem' }}>
            Institutional Honors & Accreditations
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.5rem'
          }}>
            <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.8rem' }}>🏆</div>
              <h4 style={{ fontWeight: 800, color: 'var(--primary-color)', marginBottom: '0.3rem' }}>CBSE National Award</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Recognized for academic excellence and pedagogical innovation</p>
            </div>

            <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.8rem' }}>🤖</div>
              <h4 style={{ fontWeight: 800, color: 'var(--primary-color)', marginBottom: '0.3rem' }}>NITI Aayog ATL Center</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Designated Atal Tinkering Lab for robotics and artificial intelligence</p>
            </div>

            <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.8rem' }}>🌿</div>
              <h4 style={{ fontWeight: 800, color: 'var(--primary-color)', marginBottom: '0.3rem' }}>Green Campus Certified</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>100% solar powered, rainwater harvesting & eco-friendly campus</p>
            </div>

            <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.8rem' }}>🏅</div>
              <h4 style={{ fontWeight: 800, color: 'var(--primary-color)', marginBottom: '0.3rem' }}>Fit India School 5-Star</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Ministry of Youth Affairs certified sports and physical fitness facility</p>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
