import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { fetchInquiries } from '../../firebase/inquiryService';
import { fetchBlogPosts } from '../../firebase/blogService';
import AdminHeader from '../../components/admin/AdminHeader';

export default function AdminDashboard() {
  const { user } = useAuth();
  const { theme } = useTheme();

  const [inquiries, setInquiries] = useState([]);
  const [blogsCount, setBlogsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [inqData, blogData] = await Promise.all([
          fetchInquiries(),
          fetchBlogPosts().catch(() => [])
        ]);
        setInquiries(inqData || []);
        setBlogsCount(blogData ? blogData.length : 0);
      } catch (err) {
        console.error('Failed to load dashboard metrics:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const schoolName = theme.schoolName || 'Greenwood Academy';
  const newInquiries = inquiries.filter(i => i.status === 'new');
  const recentInquiries = inquiries.slice(0, 4);

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '1240px' }}>
      
      {/* 1. UNIFIED ADMIN HEADER & NAVIGATION */}
      <AdminHeader
        title="School Admin Console"
        subtitle={`Logged in as ${user?.email || 'Administrator'} • Managing ${schoolName}`}
        activeTab="dashboard"
        newInquiriesCount={newInquiries.length}
        actions={
          <Link
            to="/admin/blogs/new"
            className="btn btn-primary"
            style={{ fontWeight: 800, backgroundColor: 'var(--primary-color)' }}
          >
            + Create Blog Post
          </Link>
        }
      />

      {/* 3. EXECUTIVE METRICS CARDS */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
        gap: '1.2rem',
        marginBottom: '2.5rem'
      }}>
        {/* Metric 1: New Leads */}
        <div className="card" style={{ borderTop: '3px solid #ef4444', padding: '1.4rem', borderRadius: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#991b1b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              NEW LEADS
            </span>
            <div style={{ width: '34px', height: '34px', borderRadius: '8px', backgroundColor: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>
              ⚡
            </div>
          </div>
          <div style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--primary-color)', margin: '0.3rem 0' }}>
            {loading ? '...' : newInquiries.length}
          </div>
          <Link to="/admin/inquiries" style={{ fontSize: '0.82rem', color: '#ef4444', fontWeight: 700 }}>
            {newInquiries.length > 0 ? 'Requires Follow-up →' : 'All leads actioned ✓'}
          </Link>
        </div>

        {/* Metric 2: Total Inquiries */}
        <div className="card" style={{ borderTop: '3px solid #3b82f6', padding: '1.4rem', borderRadius: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#1d4ed8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              TOTAL INQUIRIES
            </span>
            <div style={{ width: '34px', height: '34px', borderRadius: '8px', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>
              📥
            </div>
          </div>
          <div style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--primary-color)', margin: '0.3rem 0' }}>
            {loading ? '...' : inquiries.length}
          </div>
          <Link to="/admin/inquiries" style={{ fontSize: '0.82rem', color: '#3b82f6', fontWeight: 700 }}>
            View Full Inbox →
          </Link>
        </div>

        {/* Metric 3: Published Blogs */}
        <div className="card" style={{ borderTop: '3px solid #10b981', padding: '1.4rem', borderRadius: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#047857', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              SCHOOL BLOGS
            </span>
            <div style={{ width: '34px', height: '34px', borderRadius: '8px', backgroundColor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>
              📰
            </div>
          </div>
          <div style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--primary-color)', margin: '0.3rem 0' }}>
            {loading ? '...' : blogsCount}
          </div>
          <Link to="/admin/blogs" style={{ fontSize: '0.82rem', color: '#10b981', fontWeight: 700 }}>
            Manage School Blogs →
          </Link>
        </div>

        {/* Metric 4: Brand Identity */}
        <div className="card" style={{ borderTop: '3px solid var(--primary-color)', padding: '1.4rem', borderRadius: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--primary-color)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              BRAND THEME
            </span>
            <div style={{ width: '34px', height: '34px', borderRadius: '8px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>
              🎨
            </div>
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--primary-color)', margin: '0.8rem 0 0.5rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {schoolName}
          </div>
          <Link to="/admin/theme" style={{ fontSize: '0.82rem', color: 'var(--primary-color)', fontWeight: 700 }}>
            Edit Photos & Copy →
          </Link>
        </div>
      </div>

      {/* 4. RECENT VISITOR INQUIRIES FEED (Directly on Dashboard) */}
      <div className="card" style={{ padding: '1.8rem', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '0.8rem' }}>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary-color)' }}>
              📥 Recent Visitor Inquiries & Admission Leads
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Latest messages submitted through website inquiry forms.
            </p>
          </div>
          <Link
            to="/admin/inquiries"
            className="btn btn-outline"
            style={{ fontWeight: 700, fontSize: '0.85rem' }}
          >
            View All Inquiries ({inquiries.length}) →
          </Link>
        </div>

        {loading ? (
          <p style={{ color: 'var(--text-secondary)' }}>Loading inquiries...</p>
        ) : recentInquiries.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>No visitor inquiries received yet.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: 'var(--text-secondary)', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '0.65rem 0.8rem' }}>Type</th>
                  <th style={{ padding: '0.65rem 0.8rem' }}>Applicant / Sender</th>
                  <th style={{ padding: '0.65rem 0.8rem' }}>Phone</th>
                  <th style={{ padding: '0.65rem 0.8rem' }}>Grade / Subject</th>
                  <th style={{ padding: '0.65rem 0.8rem' }}>Status</th>
                  <th style={{ padding: '0.65rem 0.8rem', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentInquiries.map(inq => (
                  <tr key={inq.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.75rem 0.8rem' }}>
                      <span style={{
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        backgroundColor: inq.type === 'admission' ? '#eff6ff' : '#f5f3ff',
                        color: inq.type === 'admission' ? '#1d4ed8' : '#6d28d9'
                      }}>
                        {inq.type === 'admission' ? '📝 Admission' : '✉️ Contact'}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 0.8rem', fontWeight: 700 }}>
                      {inq.studentName || inq.name}
                      {inq.parentName && <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 400 }}>Parent: {inq.parentName}</div>}
                    </td>
                    <td style={{ padding: '0.75rem 0.8rem' }}>
                      <a href={`tel:${inq.phone}`} style={{ color: 'var(--primary-color)', fontWeight: 600 }}>
                        {inq.phone || 'N/A'}
                      </a>
                    </td>
                    <td style={{ padding: '0.75rem 0.8rem', color: 'var(--text-secondary)' }}>
                      {inq.grade || inq.subject || '—'}
                    </td>
                    <td style={{ padding: '0.75rem 0.8rem' }}>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '50px',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        backgroundColor: inq.status === 'new' ? '#fee2e2' : inq.status === 'contacted' ? '#fef3c7' : '#dcfce7',
                        color: inq.status === 'new' ? '#991b1b' : inq.status === 'contacted' ? '#92400e' : '#166534'
                      }}>
                        {inq.status === 'new' ? '⚡ New' : inq.status === 'contacted' ? 'Contacted' : 'Followed Up'}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 0.8rem', textAlign: 'right' }}>
                      <Link
                        to="/admin/inquiries"
                        style={{ color: 'var(--secondary-color)', fontWeight: 700, fontSize: '0.8rem', textDecoration: 'none' }}
                      >
                        Inspect →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 5. QUICK MODULE LAUNCHERS */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2.5rem'
      }}>
        {/* Module 1: Inquiries CRM */}
        <div className="card" style={{ borderTop: '4px solid #3b82f6', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>📥</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-color)', marginBottom: '0.4rem' }}>
              Inquiries & Admission CRM
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1.2rem' }}>
              Track visitor submissions, update enrollment statuses, send WhatsApp / direct calls to parents, and export all leads to CSV for school records.
            </p>
          </div>
          <Link to="/admin/inquiries" className="btn btn-primary" style={{ fontWeight: 700, textAlign: 'center', borderRadius: '8px' }}>
            Open Inquiries Inbox →
          </Link>
        </div>

        {/* Module 2: School Blogs */}
        <div className="card" style={{ borderTop: '4px solid #10b981', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>📰</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-color)', marginBottom: '0.4rem' }}>
              School Blogs & Articles
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1.2rem' }}>
              Publish school stories, student achievements, academic highlights, and campus events with rich-text formatting and cover images.
            </p>
          </div>
          <Link to="/admin/blogs" className="btn btn-primary" style={{ fontWeight: 700, textAlign: 'center', borderRadius: '8px' }}>
            Manage School Blogs ({blogsCount}) →
          </Link>
        </div>

        {/* Module 3: Visual Customizer */}
        <div className="card" style={{ borderTop: '4px solid var(--primary-color)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>🖼️</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-color)', marginBottom: '0.4rem' }}>
              Homepage Photos & Theme
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1.2rem' }}>
              Replace all homepage photos (Hero campus, Principal portrait, Atal lab, Sports ground, Library), Sanskrit motto, and CBSE affiliation details.
            </p>
          </div>
          <Link to="/admin/theme" className="btn btn-primary" style={{ fontWeight: 700, textAlign: 'center', borderRadius: '8px' }}>
            Customize Visuals & Photos →
          </Link>
        </div>
      </div>

    </div>
  );
}
