import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import PageBanner from '../../components/PageBanner';

export default function AcademicsPage() {
  const { theme } = useTheme();
  const [activeWing, setActiveWing] = useState('senior'); // 'foundational', 'primary', 'middle', 'senior'

  const schoolName = theme.schoolName || 'Greenwood Academy';

  return (
    <div>
      <PageBanner 
        title="Academics & Pedagogical Framework" 
        subtitle="CBSE Affiliated Curriculum from Nursery to Class XII • Guided by NEP 2020"
        breadcrumb="Academics"
      />

      {/* 1. Academic Wings Selector */}
      <section style={{ padding: '3.5rem 1.2rem', backgroundColor: '#ffffff' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: 0 }}>
          
          <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 2.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.08em', color: 'var(--secondary-color)', textTransform: 'uppercase' }}>
              STRUCTURED LEARNING PATHWAYS
            </span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', fontWeight: 900, color: 'var(--primary-color)', marginTop: '0.3rem' }}>
              Academic Wings (Pre-Primary to Class XII)
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.4rem' }}>
              Select a division below to explore the curriculum, subjects offered, laboratory exposure, and pedagogical approach.
            </p>
          </div>

          {/* Wing Tabs */}
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: '2.5rem'
          }}>
            {[
              { id: 'foundational', label: '🧸 Pre-Primary (Nursery-KG)' },
              { id: 'primary', label: '🎒 Primary (Classes I - V)' },
              { id: 'middle', label: '📐 Middle & Sec (VI - X)' },
              { id: 'senior', label: '🎓 Senior Secondary (XI - XII)' },
            ].map((wing) => {
              const isActive = activeWing === wing.id;
              return (
                <button
                  key={wing.id}
                  type="button"
                  onClick={() => setActiveWing(wing.id)}
                  style={{
                    padding: '0.75rem 1.4rem',
                    borderRadius: '50px',
                    border: `2px solid ${isActive ? 'var(--secondary-color)' : '#e2e8f0'}`,
                    backgroundColor: isActive ? 'var(--secondary-color)' : '#f8fafc',
                    color: isActive ? '#ffffff' : 'var(--text-primary)',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {wing.label}
                </button>
              );
            })}
          </div>

          {/* Active Wing Content */}
          <div className="card" style={{ padding: '2rem', borderTop: '4px solid var(--secondary-color)' }}>
            
            {/* Wing 1: Pre-Primary */}
            {activeWing === 'foundational' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '2.5rem' }}>🧸</span>
                  <div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--primary-color)' }}>
                      Pre-Primary Wing (Playgroup, Nursery, LKG, UKG)
                    </h3>
                    <div style={{ fontSize: '0.85rem', color: 'var(--secondary-color)', fontWeight: 700 }}>
                      AGE GROUP: 3 – 5 YEARS • NEP 2020 FOUNDATIONAL STAGE
                    </div>
                  </div>
                </div>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                  Our early childhood classrooms are joyful learning sanctuaries where little minds develop curiosity and security. We employ multi-sensory Jolly Phonics, experiential playway learning, storytelling, and motor skill exercises.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.2rem' }}>
                  <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <h4 style={{ fontWeight: 800, color: 'var(--primary-color)', marginBottom: '0.3rem' }}>Phonetics & Reading</h4>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Synthetic phonics and early sight words to build reading independence.</p>
                  </div>
                  <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <h4 style={{ fontWeight: 800, color: 'var(--primary-color)', marginBottom: '0.3rem' }}>Sensory & Motor Lab</h4>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Clay modeling, sand play, paper folding, and physical coordination.</p>
                  </div>
                  <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <h4 style={{ fontWeight: 800, color: 'var(--primary-color)', marginBottom: '0.3rem' }}>Numeracy Basics</h4>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Concrete object counting, shape recognition, and spatial awareness.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Wing 2: Primary */}
            {activeWing === 'primary' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '2.5rem' }}>🎒</span>
                  <div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--primary-color)' }}>
                      Primary Wing (Classes I – V)
                    </h3>
                    <div style={{ fontSize: '0.85rem', color: '#2563eb', fontWeight: 700 }}>
                      AGE GROUP: 6 – 10 YEARS • PREPARATORY STAGE
                    </div>
                  </div>
                </div>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                  Focus on Foundational Literacy and Numeracy (FLN), bilingual fluency in English and Hindi, discovery-based Environmental Studies (EVS), mental mathematics, and introduction to computer science.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.2rem' }}>
                  <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <h4 style={{ fontWeight: 800, color: 'var(--primary-color)', marginBottom: '0.3rem' }}>Core Curriculum</h4>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>English, Hindi, Mathematics, Environmental Studies (Science & Social), General Knowledge.</p>
                  </div>
                  <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <h4 style={{ fontWeight: 800, color: 'var(--primary-color)', marginBottom: '0.3rem' }}>Experiential Art & Music</h4>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Vocal music, classical Indian instruments, dance, and drawing studios.</p>
                  </div>
                  <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <h4 style={{ fontWeight: 800, color: 'var(--primary-color)', marginBottom: '0.3rem' }}>Coding & Tech Lab</h4>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Block-based Scratch programming, logical thinking, and cyber safety.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Wing 3: Middle & Secondary */}
            {activeWing === 'middle' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '2.5rem' }}>📐</span>
                  <div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--primary-color)' }}>
                      Middle & Secondary Wing (Classes VI – X)
                    </h3>
                    <div style={{ fontSize: '0.85rem', color: '#059669', fontWeight: 700 }}>
                      AGE GROUP: 11 – 15 YEARS • CBSE AISSE BOARD PREPARATION
                    </div>
                  </div>
                </div>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                  Rigorous NCERT syllabus, state-of-the-art laboratory experimentation, language enrichment (English, Hindi, Sanskrit, French), Atal Tinkering Lab projects, and structured CBSE Board Examination preparation.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.2rem' }}>
                  <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <h4 style={{ fontWeight: 800, color: 'var(--primary-color)', marginBottom: '0.3rem' }}>Science & Tech Labs</h4>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Physics, Chemistry, and Biology practical labs + Python coding.</p>
                  </div>
                  <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <h4 style={{ fontWeight: 800, color: 'var(--primary-color)', marginBottom: '0.3rem' }}>Third Language Choice</h4>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Option between Sanskrit and French in Classes VI to VIII.</p>
                  </div>
                  <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <h4 style={{ fontWeight: 800, color: 'var(--primary-color)', marginBottom: '0.3rem' }}>Board Examination Cell</h4>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Mock CBSE tests, remedial doubt-clearing, and answer-writing workshops.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Wing 4: Senior Secondary (All 3 Streams) */}
            {activeWing === 'senior' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.2rem' }}>
                  <span style={{ fontSize: '2.5rem' }}>🎓</span>
                  <div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--primary-color)' }}>
                      Senior Secondary 10+2 (Classes XI – XII)
                    </h3>
                    <div style={{ fontSize: '0.85rem', color: 'var(--secondary-color)', fontWeight: 700 }}>
                      CBSE AISSCE AFFILIATED • INTEGRATED NATIONAL COMPETITIVE EXAM GUIDANCE
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                  {/* Stream A */}
                  <div style={{ padding: '1.2rem', backgroundColor: '#fef2f2', borderRadius: '8px', borderLeft: '4px solid #b91c1c' }}>
                    <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#b91c1c', marginBottom: '0.4rem' }}>
                      🔬 Science Stream (Medical / Non-Med)
                    </h4>
                    <div style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.6 }}>
                      <div>• <strong>Non-Medical (PCM):</strong> Physics, Chemistry, Math, English, CS / IP / PE</div>
                      <div>• <strong>Medical (PCB):</strong> Physics, Chemistry, Biology, English, Psychology / PE</div>
                      <div style={{ marginTop: '0.4rem', color: '#991b1b', fontWeight: 700 }}>→ Integrated JEE Main/Advanced & NEET guidance</div>
                    </div>
                  </div>

                  {/* Stream B */}
                  <div style={{ padding: '1.2rem', backgroundColor: '#fffbeb', borderRadius: '8px', borderLeft: '4px solid #d97706' }}>
                    <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#d97706', marginBottom: '0.4rem' }}>
                      📈 Commerce Stream
                    </h4>
                    <div style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.6 }}>
                      <div>• <strong>Core Subjects:</strong> Accountancy, Business Studies, Economics, English</div>
                      <div>• <strong>Electives:</strong> Applied Mathematics, Informatics Practices, Physical Education</div>
                      <div style={{ marginTop: '0.4rem', color: '#b45309', fontWeight: 700 }}>→ CA Foundation, CUET & IPMAT preparation</div>
                    </div>
                  </div>

                  {/* Stream C */}
                  <div style={{ padding: '1.2rem', backgroundColor: '#eff6ff', borderRadius: '8px', borderLeft: '4px solid #1d4ed8' }}>
                    <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1d4ed8', marginBottom: '0.4rem' }}>
                      📚 Humanities & Liberal Arts
                    </h4>
                    <div style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.6 }}>
                      <div>• <strong>Subjects:</strong> Political Science, Psychology, Economics, History, Sociology</div>
                      <div>• <strong>Electives:</strong> Legal Studies, Fine Arts, English Literature</div>
                      <div style={{ marginTop: '0.4rem', color: '#1e40af', fontWeight: 700 }}>→ Civil Services (UPSC), CLAT & CUET mentoring</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Admission CTA Box */}
          <div style={{
            marginTop: '3rem',
            padding: '2rem',
            borderRadius: '12px',
            backgroundColor: '#0a2540',
            color: '#ffffff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.5rem'
          }}>
            <div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.3rem' }}>
                Admissions Open for Session 2026-27
              </h3>
              <p style={{ color: '#cbd5e1', fontSize: '0.92rem' }}>
                Online registrations are open for Nursery, KG, and Class XI (Science, Commerce & Humanities).
              </p>
            </div>
            <Link
              to="/admissions"
              className="btn btn-secondary"
              style={{ padding: '0.85rem 1.8rem', fontWeight: 800, fontSize: '0.95rem' }}
            >
              Apply for Admission →
            </Link>
          </div>

        </div>
      </section>
    </div>
  );
}
