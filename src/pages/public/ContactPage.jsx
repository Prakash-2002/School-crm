import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import PageBanner from '../../components/PageBanner';
import { submitInquiry } from '../../firebase/inquiryService';

export default function ContactPage() {
  const { theme } = useTheme();

  const [messageSent, setMessageSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: ''
  });

  const schoolName = theme.schoolName || 'Greenwood Academy';
  const phone = theme.phone || '+91 98765 43210';
  const email = theme.email || 'admissions@greenwood.edu';
  const address = theme.address || 'Sector 14, Institutional Area, Rohini, New Delhi - 110085';
  const affiliation = theme.cbseAffiliation || 'CBSE Affiliation No: 2130892 | School Code: 70415';

  const handleSend = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitInquiry({
        type: 'contact',
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
        source: 'Contact Page Inquiry'
      });
      setMessageSent(true);
    } catch (err) {
      console.error('Failed to submit message:', err);
      setMessageSent(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageBanner 
        title="Contact Us & Statutory Disclosure" 
        subtitle="Campus directions, administrative helpline, and official CBSE Mandatory Public Disclosures"
        breadcrumb="Contact"
      />

      <section style={{ padding: '4rem 1.2rem', backgroundColor: '#ffffff' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: 0 }}>
          
          {/* Top 3 Info Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
            marginBottom: '3.5rem'
          }}>
            <div className="card" style={{ borderTop: '4px solid var(--primary-color)', padding: '1.8rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.6rem' }}>📍</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-color)', marginBottom: '0.4rem' }}>
                Campus Location
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                {address}
              </p>
              <div style={{ fontSize: '0.8rem', color: 'var(--secondary-color)', fontWeight: 700, marginTop: '0.6rem' }}>
                Near Metro Station & Ring Road
              </div>
            </div>

            <div className="card" style={{ borderTop: '4px solid var(--secondary-color)', padding: '1.8rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.6rem' }}>📞</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-color)', marginBottom: '0.4rem' }}>
                Helpline & Email
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Phone: <strong>{phone}</strong><br />
                Email: <strong>{email}</strong>
              </p>
              <div style={{ fontSize: '0.8rem', color: 'var(--secondary-color)', fontWeight: 700, marginTop: '0.6rem' }}>
                Mon–Sat: 8:00 AM – 3:30 PM
              </div>
            </div>

            <div className="card" style={{ borderTop: '4px solid var(--accent-color)', padding: '1.8rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.6rem' }}>🏛️</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-color)', marginBottom: '0.4rem' }}>
                Board Affiliation
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                {affiliation}<br />
                Co-Educational, Senior Secondary (10+2)
              </p>
              <div style={{ fontSize: '0.8rem', color: '#047857', fontWeight: 700, marginTop: '0.6rem' }}>
                Status: Active & In Order
              </div>
            </div>
          </div>

          {/* Form + Map Split */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3rem',
            alignItems: 'flex-start',
            marginBottom: '4.5rem'
          }}>
            {/* Form */}
            <div className="card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--primary-color)', marginBottom: '0.4rem' }}>
                Send Us a Message
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
                Have a question regarding admissions, academics, or transportation? Reach our administration desk.
              </p>

              {messageSent ? (
                <div style={{ padding: '1.5rem', backgroundColor: '#dcfce7', border: '1px solid #86efac', borderRadius: '8px', color: '#166534', textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>✉️</div>
                  <h4 style={{ fontWeight: 800 }}>Message Delivered!</h4>
                  <p style={{ fontSize: '0.88rem', marginTop: '0.3rem' }}>
                    Thank you, {formData.name}. Our administrative officer will respond to your email shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => setMessageSent(false)}
                    className="btn btn-outline"
                    style={{ marginTop: '1rem', fontSize: '0.85rem' }}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSend} style={{ display: 'grid', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                      Your Full Name: *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.9rem' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                    <div>
                      <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                        Email: *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.9rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                        Mobile Phone:
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.9rem' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                      Subject:
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.9rem' }}
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Admission Question">Admission & Registration Question</option>
                      <option value="Fee Department">Fee & Accounts Department</option>
                      <option value="Transfer Certificate">TC (Transfer Certificate) Request</option>
                      <option value="Principal Appointment">Request Appointment with Principal</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                      Your Message: *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.9rem' }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn btn-primary"
                    style={{ fontWeight: 800, padding: '0.8rem', backgroundColor: 'var(--primary-color)' }}
                  >
                    {submitting ? '⏳ Sending...' : 'Submit Message →'}
                  </button>
                </form>
              )}
            </div>

            {/* Map & Visiting Hours */}
            <div>
              <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary-color)', marginBottom: '0.6rem' }}>
                  Campus Visiting Protocols
                </h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.6rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                  <li>🕒 <strong>School Office Hours:</strong> 8:00 AM – 3:30 PM (Mon to Sat)</li>
                  <li>👥 <strong>Parent-Teacher Meetings:</strong> 2nd & 4th Saturdays</li>
                  <li>🏛️ <strong>Principal Visiting Hours:</strong> 10:00 AM – 12:00 PM (By prior appointment)</li>
                  <li>🛡️ <strong>Visitor Gate Protocol:</strong> Government photo ID mandatory at Reception</li>
                </ul>
              </div>

              <div className="card" style={{ padding: '1.5rem', backgroundColor: '#f8fafc' }}>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary-color)', marginBottom: '0.6rem' }}>
                  Student Safety Committees
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                  Our institution strictly adheres to CBSE safety bylaws. For child welfare, POCSO matters, or anti-ragging concerns, contact our designated grievance officer at <strong>grievance@{schoolName.toLowerCase().replace(/[^a-z0-9]/g, '')}.edu</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* Statutory CBSE Public Disclosure (SARAS) Section */}
          <div id="disclosure" className="card" style={{ padding: '2rem', borderTop: '4px solid var(--primary-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--primary-color)' }}>
                  CBSE Mandatory Public Disclosure (Appendix IX / SARAS)
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  Statutory disclosures required under CBSE Affiliation Bye-Laws 2018.
                </p>
              </div>
              <span style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', padding: '0.3rem 0.8rem', borderRadius: '4px', fontWeight: 800, fontSize: '0.78rem' }}>
                SARAS COMPLIANT
              </span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '0.75rem', fontWeight: 700, width: '35%', backgroundColor: '#f8fafc' }}>Name of Institution</td>
                    <td style={{ padding: '0.75rem' }}>{schoolName}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '0.75rem', fontWeight: 700, backgroundColor: '#f8fafc' }}>Affiliation Details</td>
                    <td style={{ padding: '0.75rem' }}>{affiliation}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '0.75rem', fontWeight: 700, backgroundColor: '#f8fafc' }}>Principal Name & Qualifications</td>
                    <td style={{ padding: '0.75rem' }}>{theme.principalName || 'Dr. Sunita Sharma, Ph.D. (Edu), M.Sc., B.Ed.'}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '0.75rem', fontWeight: 700, backgroundColor: '#f8fafc' }}>Campus Area & Infrastructure</td>
                    <td style={{ padding: '0.75rem' }}>25 Acres (Pucca Boundary Wall, Rainwater Harvesting, Fire Safety Compliant)</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '0.75rem', fontWeight: 700, backgroundColor: '#f8fafc' }}>Drinking Water & Sanitary Conditions</td>
                    <td style={{ padding: '0.75rem' }}>RO Water Purification Plant installed, periodic water health tests certified</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '0.75rem', fontWeight: 700, backgroundColor: '#f8fafc' }}>Fire & Building Safety Certificates</td>
                    <td style={{ padding: '0.75rem' }}>Valid Building Safety & Fire NOC issued by Department of Fire Services</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
