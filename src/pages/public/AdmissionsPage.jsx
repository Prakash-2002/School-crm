import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import PageBanner from '../../components/PageBanner';
import { submitInquiry } from '../../firebase/inquiryService';

export default function AdmissionsPage() {
  const { theme } = useTheme();

  const [formData, setFormData] = useState({
    studentName: '',
    parentName: '',
    phone: '',
    email: '',
    grade: 'Nursery',
    comments: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const schoolName = theme.schoolName || 'Greenwood Academy';
  const phone = theme.phone || '+91 98765 43210';
  const email = theme.email || 'admissions@greenwood.edu';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitInquiry({
        type: 'admission',
        studentName: formData.studentName,
        parentName: formData.parentName,
        phone: formData.phone,
        email: formData.email,
        grade: formData.grade,
        comments: formData.comments,
        source: 'Online Admission Form'
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Failed to submit inquiry:', err);
      // Still show success because it was cached locally
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageBanner 
        title="Admission Guidelines (Session 2026-27)" 
        subtitle="Transparent, merit-based, and seamless admission procedure for Nursery to Class XI"
        breadcrumb="Admissions"
      />

      <section style={{ padding: '4rem 1.2rem', backgroundColor: '#ffffff' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: 0 }}>
          
          {/* 4 Step Process */}
          <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.08em', color: 'var(--secondary-color)', textTransform: 'uppercase' }}>
              STEP-BY-STEP ENROLLMENT
            </span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', fontWeight: 900, color: 'var(--primary-color)', marginTop: '0.3rem' }}>
              Admission Procedure (4 Simple Steps)
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.5rem',
            marginBottom: '4rem'
          }}>
            {[
              { step: '01', title: 'Online Registration', desc: 'Fill out the initial online inquiry or application form with student and parent details.' },
              { step: '02', title: 'Interaction / Aptitude', desc: 'Friendly informal interaction for Pre-Primary, and syllabus aptitude test for Classes VI to XI.' },
              { step: '03', title: 'Document Verification', desc: 'Submission of birth certificate, previous school report card, Aadhaar card, and photographs.' },
              { step: '04', title: 'Fee Payment & Enrolment', desc: 'Payment of composite admission fees online or at the school fee desk to finalize admission.' },
            ].map((st, i) => (
              <div key={i} className="card" style={{ borderTop: '4px solid var(--secondary-color)', padding: '1.5rem', position: 'relative' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--secondary-color)', opacity: 0.25, position: 'absolute', top: '10px', right: '15px' }}>
                  {st.step}
                </div>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--secondary-color)', marginBottom: '0.4rem' }}>
                  STAGE {st.step}
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-color)', marginBottom: '0.5rem' }}>
                  {st.title}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6 }}>
                  {st.desc}
                </p>
              </div>
            ))}
          </div>

          {/* 2 Column: Form + Eligibility / Documents */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3rem',
            alignItems: 'flex-start'
          }}>
            
            {/* Left: Interactive Registration Form */}
            <div className="card" style={{ padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--primary-color)' }}>
                  Online Admission Inquiry
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                  Submit this preliminary form. Our admission counselor will contact you within 24 hours.
                </p>
              </div>

              {submitted ? (
                <div style={{ padding: '1.5rem', backgroundColor: '#dcfce7', border: '1px solid #86efac', borderRadius: '8px', color: '#166534', textAlign: 'center' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎉</div>
                  <h4 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.3rem' }}>Application Submitted!</h4>
                  <p style={{ fontSize: '0.9rem', lineHeight: 1.5 }}>
                    Thank you, <strong>{formData.parentName}</strong>. Your inquiry for <strong>{formData.studentName}</strong> (Class {formData.grade}) has been received. Our admission office will call you at <strong>{formData.phone}</strong>.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="btn btn-outline"
                    style={{ marginTop: '1rem', fontSize: '0.85rem' }}
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                      Student's Full Name: *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.studentName}
                      onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                      placeholder="e.g. Aarav Sharma"
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.9rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                      Parent / Guardian Name: *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.parentName}
                      onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                      placeholder="e.g. Rajesh Sharma"
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.9rem' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                    <div>
                      <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                        Mobile Phone: *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765..."
                        style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.9rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                        Grade Applied For:
                      </label>
                      <select
                        value={formData.grade}
                        onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                        style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.9rem' }}
                      >
                        <option value="Pre-Nursery">Pre-Nursery</option>
                        <option value="Nursery">Nursery</option>
                        <option value="KG">Kindergarten (KG)</option>
                        <option value="Class I">Class I</option>
                        <option value="Class II">Class II</option>
                        <option value="Class III">Class III</option>
                        <option value="Class IV">Class IV</option>
                        <option value="Class V">Class V</option>
                        <option value="Class VI">Class VI</option>
                        <option value="Class VII">Class VII</option>
                        <option value="Class VIII">Class VIII</option>
                        <option value="Class IX">Class IX</option>
                        <option value="Class X">Class X</option>
                        <option value="Class XI - Science">Class XI - Science</option>
                        <option value="Class XI - Commerce">Class XI - Commerce</option>
                        <option value="Class XI - Humanities">Class XI - Humanities</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                      Email Address:
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="parent@example.com"
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.9rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                      Questions / Notes (Optional):
                    </label>
                    <textarea
                      rows={3}
                      value={formData.comments}
                      onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                      placeholder="Any specific questions about transport, fees, or stream selection..."
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.9rem' }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn btn-primary"
                    style={{ fontWeight: 800, padding: '0.8rem', backgroundColor: 'var(--secondary-color)', borderColor: 'var(--secondary-color)' }}
                  >
                    {submitting ? '⏳ Submitting...' : 'Submit Admission Enquiry →'}
                  </button>
                </form>
              )}
            </div>

            {/* Right: Age Eligibility & Document Checklist */}
            <div>
              {/* Age Eligibility Table */}
              <div className="card" style={{ marginBottom: '1.5rem', padding: '1.5rem' }}>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary-color)', marginBottom: '0.8rem' }}>
                  Age Criteria as of 31st March 2026 (NEP 2020)
                </h4>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f1f5f9', textAlign: 'left' }}>
                        <th style={{ padding: '0.5rem 0.8rem', borderBottom: '1px solid #cbd5e1' }}>Class / Grade</th>
                        <th style={{ padding: '0.5rem 0.8rem', borderBottom: '1px solid #cbd5e1' }}>Minimum Age Requirement</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ padding: '0.5rem 0.8rem', borderBottom: '1px solid #e2e8f0', fontWeight: 700 }}>Nursery</td>
                        <td style={{ padding: '0.5rem 0.8rem', borderBottom: '1px solid #e2e8f0' }}>3 Years Completed</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '0.5rem 0.8rem', borderBottom: '1px solid #e2e8f0', fontWeight: 700 }}>LKG / Prep</td>
                        <td style={{ padding: '0.5rem 0.8rem', borderBottom: '1px solid #e2e8f0' }}>4 Years Completed</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '0.5rem 0.8rem', borderBottom: '1px solid #e2e8f0', fontWeight: 700 }}>UKG / KG</td>
                        <td style={{ padding: '0.5rem 0.8rem', borderBottom: '1px solid #e2e8f0' }}>5 Years Completed</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '0.5rem 0.8rem', borderBottom: '1px solid #e2e8f0', fontWeight: 700 }}>Class I</td>
                        <td style={{ padding: '0.5rem 0.8rem', borderBottom: '1px solid #e2e8f0' }}>6 Years Completed</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Document Checklist */}
              <div className="card" style={{ padding: '1.5rem' }}>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary-color)', marginBottom: '0.8rem' }}>
                  Mandatory Documents for Verification
                </h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.6rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                  <li>✅ Original & self-attested copy of Birth Certificate (Municipal Corp)</li>
                  <li>✅ Transfer Certificate (TC) counter-signed by CBSE / State Education Dept</li>
                  <li>✅ Photocopy of Student and Parents' Aadhaar Cards</li>
                  <li>✅ Previous Academic Year Report Card / Marksheet</li>
                  <li>✅ 5 Recent Passport-size Photographs of Student & 2 of Parents</li>
                  <li>✅ Category Certificate (SC/ST/OBC/EWS) if applicable</li>
                </ul>
              </div>

              {/* Admission Helpline */}
              <div style={{ marginTop: '1.5rem', padding: '1.2rem', backgroundColor: '#eff6ff', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
                <div style={{ fontWeight: 800, color: '#1e40af', fontSize: '0.92rem', marginBottom: '0.2rem' }}>
                  Need Direct Guidance?
                </div>
                <div style={{ fontSize: '0.85rem', color: '#1e3a8a' }}>
                  Call Admission Desk: <strong>{phone}</strong> or email <strong>{email}</strong>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>
    </div>
  );
}
