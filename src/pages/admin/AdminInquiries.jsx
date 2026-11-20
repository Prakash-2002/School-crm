import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchInquiries, updateInquiryStatus, deleteInquiry } from '../../firebase/inquiryService';
import AdminHeader from '../../components/admin/AdminHeader';

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all'); // 'all', 'admission', 'contact', 'new'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [feedback, setFeedback] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchInquiries();
      setInquiries(data);
    } catch (err) {
      console.error('Failed to load inquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      await updateInquiryStatus(id, newStatus);
      setInquiries(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
      setFeedback('Status updated successfully!');
      setTimeout(() => setFeedback(''), 3000);
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSaveNotes = async (id) => {
    try {
      await updateInquiryStatus(id, selectedInquiry.status, adminNotes);
      setInquiries(prev => prev.map(item => item.id === id ? { ...item, adminNotes } : item));
      setSelectedInquiry(prev => ({ ...prev, adminNotes }));
      setFeedback('Notes saved successfully!');
      setTimeout(() => setFeedback(''), 3000);
    } catch (err) {
      console.error('Failed to save notes:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this inquiry record?')) {
      try {
        await deleteInquiry(id);
        setInquiries(prev => prev.filter(item => item.id !== id));
        if (selectedInquiry?.id === id) setSelectedInquiry(null);
      } catch (err) {
        console.error('Failed to delete:', err);
      }
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Type', 'Student/Name', 'Parent Name', 'Phone', 'Email', 'Grade', 'Status', 'Date', 'Comments/Message'];
    const rows = inquiries.map(inq => [
      inq.type || 'admission',
      `"${inq.studentName || inq.name || ''}"`,
      `"${inq.parentName || ''}"`,
      `"${inq.phone || ''}"`,
      `"${inq.email || ''}"`,
      `"${inq.grade || inq.subject || ''}"`,
      `"${inq.status || 'new'}"`,
      `"${inq.createdAt ? new Date(inq.createdAt).toLocaleDateString() : ''}"`,
      `"${(inq.comments || inq.message || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `school_inquiries_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtering
  const filtered = inquiries.filter(item => {
    if (filterType === 'admission' && item.type !== 'admission') return false;
    if (filterType === 'contact' && item.type !== 'contact') return false;
    if (filterType === 'new' && item.status !== 'new') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = (item.studentName || item.name || '').toLowerCase().includes(q);
      const matchParent = (item.parentName || '').toLowerCase().includes(q);
      const matchPhone = (item.phone || '').toLowerCase().includes(q);
      const matchEmail = (item.email || '').toLowerCase().includes(q);
      const matchGrade = (item.grade || item.subject || '').toLowerCase().includes(q);
      return matchName || matchParent || matchPhone || matchEmail || matchGrade;
    }

    return true;
  });

  const newCount = inquiries.filter(i => i.status === 'new').length;

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '1240px' }}>
      
      {/* 1. UNIFIED ADMIN HEADER & NAVIGATION */}
      <AdminHeader
        title="Visitor Inquiries & Admission Leads"
        subtitle="Real-time inquiries submitted by parents and visitors from the website's Admissions & Contact forms."
        activeTab="inquiries"
        newInquiriesCount={newCount}
        actions={
          <>
            <button
              type="button"
              onClick={exportToCSV}
              className="btn btn-outline"
              style={{ fontWeight: 700, fontSize: '0.86rem', padding: '0.55rem 0.95rem', borderRadius: '8px', backgroundColor: '#ffffff', borderColor: '#cbd5e1', whiteSpace: 'nowrap' }}
            >
              📥 Export to CSV
            </button>
            <button
              type="button"
              onClick={loadData}
              className="btn btn-outline"
              style={{ fontWeight: 700, fontSize: '0.86rem', padding: '0.55rem 0.95rem', borderRadius: '8px', backgroundColor: '#ffffff', borderColor: '#cbd5e1', whiteSpace: 'nowrap' }}
            >
              🔄 Refresh
            </button>
          </>
        }
      />

      {/* 2. EXECUTIVE METRIC SUMMARY CARDS (Matching Dashboard style) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.2rem',
        marginBottom: '2rem'
      }}>
        {/* Card 1: New Leads */}
        <div className="card" style={{ borderTop: '3px solid #ef4444', padding: '1.3rem', borderRadius: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#991b1b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              NEW / UNACTIONED
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>
              ⚡
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--primary-color)', margin: '0.2rem 0' }}>
            {newCount}
          </div>
          <span style={{ fontSize: '0.8rem', color: '#ef4444', fontWeight: 700 }}>
            {newCount > 0 ? 'Requires parent callback' : 'All leads followed up ✓'}
          </span>
        </div>

        {/* Card 2: Admission Applications */}
        <div className="card" style={{ borderTop: '3px solid #3b82f6', padding: '1.3rem', borderRadius: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#1d4ed8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              ADMISSION FORMS
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>
              📝
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--primary-color)', margin: '0.2rem 0' }}>
            {inquiries.filter(i => i.type === 'admission').length}
          </div>
          <span style={{ fontSize: '0.8rem', color: '#3b82f6', fontWeight: 600 }}>
            Academic Session 2026-27
          </span>
        </div>

        {/* Card 3: Contact Messages */}
        <div className="card" style={{ borderTop: '3px solid #8b5cf6', padding: '1.3rem', borderRadius: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#6d28d9', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              GENERAL MESSAGES
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>
              ✉️
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--primary-color)', margin: '0.2rem 0' }}>
            {inquiries.filter(i => i.type === 'contact').length}
          </div>
          <span style={{ fontSize: '0.8rem', color: '#6d28d9', fontWeight: 600 }}>
            Public & visitor queries
          </span>
        </div>

        {/* Card 4: Total Records */}
        <div className="card" style={{ borderTop: '3px solid #10b981', padding: '1.3rem', borderRadius: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#047857', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              TOTAL INQUIRIES
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>
              📈
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--primary-color)', margin: '0.2rem 0' }}>
            {inquiries.length}
          </div>
          <span style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 600 }}>
            Real-time CRM database
          </span>
        </div>
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div style={{ padding: '0.75rem 1rem', backgroundColor: '#dcfce7', color: '#166534', borderRadius: '6px', marginBottom: '1.2rem', fontWeight: 600, fontSize: '0.9rem' }}>
          ✓ {feedback}
        </div>
      )}

      {/* Controls Bar: Search & Filter Tabs */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.5rem',
        backgroundColor: '#f8fafc',
        padding: '1rem',
        borderRadius: '8px',
        border: '1px solid #e2e8f0'
      }}>
        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: `All Inquiries (${inquiries.length})` },
            { id: 'new', label: `⚡ New / Unactioned (${newCount})` },
            { id: 'admission', label: `📝 Admissions (${inquiries.filter(i => i.type === 'admission').length})` },
            { id: 'contact', label: `✉️ Contact Messages (${inquiries.filter(i => i.type === 'contact').length})` },
          ].map(tab => {
            const isActive = filterType === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterType(tab.id)}
                style={{
                  padding: '0.45rem 0.9rem',
                  borderRadius: '50px',
                  border: `1px solid ${isActive ? 'var(--primary-color)' : '#cbd5e1'}`,
                  backgroundColor: isActive ? 'var(--primary-color)' : '#ffffff',
                  color: isActive ? '#ffffff' : 'var(--text-primary)',
                  fontWeight: isActive ? 800 : 600,
                  fontSize: '0.82rem',
                  cursor: 'pointer'
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div style={{ minWidth: '260px' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="🔍 Search by name, phone, grade..."
            style={{
              width: '100%',
              padding: '0.5rem 0.8rem',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              fontSize: '0.88rem'
            }}
          />
        </div>
      </div>

      {/* Main Content Layout: Table + Detail Inspector */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: selectedInquiry ? '1fr 380px' : '1fr',
        gap: '1.5rem',
        alignItems: 'flex-start'
      }}>
        
        {/* Inquiries Table */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              Loading visitor inquiries...
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No inquiries found matching your current filter.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    <th style={{ padding: '0.85rem 1rem' }}>APPLICANT / SENDER</th>
                    <th style={{ padding: '0.85rem 1rem' }}>INQUIRY TYPE</th>
                    <th style={{ padding: '0.85rem 1rem' }}>CONTACT & WHATSAPP</th>
                    <th style={{ padding: '0.85rem 1rem' }}>GRADE / INTEREST</th>
                    <th style={{ padding: '0.85rem 1rem' }}>DATE</th>
                    <th style={{ padding: '0.85rem 1rem' }}>STATUS</th>
                    <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(inq => {
                    const isAdmission = inq.type === 'admission';
                    const isSelected = selectedInquiry?.id === inq.id;

                    const statusColors = {
                      new: { bg: '#fee2e2', text: '#991b1b', label: 'New Lead' },
                      contacted: { bg: '#fef3c7', text: '#92400e', label: 'Contacted' },
                      scheduled: { bg: '#eff6ff', text: '#1d4ed8', label: 'Interview Scheduled' },
                      enrolled: { bg: '#dcfce7', text: '#166534', label: 'Enrolled' },
                      closed: { bg: '#f1f5f9', text: '#64748b', label: 'Closed' },
                    };
                    const statusObj = statusColors[inq.status] || statusColors.new;
                    const initialLetter = (inq.studentName || inq.name || 'A')[0].toUpperCase();

                    return (
                      <tr
                        key={inq.id}
                        style={{
                          borderBottom: '1px solid #f1f5f9',
                          backgroundColor: isSelected ? '#f0fdf4' : 'transparent',
                          transition: 'background-color 0.15s ease'
                        }}
                      >
                        {/* Applicant Name & Avatar */}
                        <td style={{ padding: '0.9rem 1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '50%',
                              backgroundColor: isAdmission ? '#eff6ff' : '#f5f3ff',
                              color: isAdmission ? '#1d4ed8' : '#7c3aed',
                              fontWeight: 800,
                              fontSize: '0.95rem',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0
                            }}>
                              {initialLetter}
                            </div>
                            <div>
                              <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '0.92rem' }}>
                                {inq.studentName || inq.name || 'Anonymous'}
                              </div>
                              {inq.parentName && (
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                  Parent: {inq.parentName}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Inquiry Type */}
                        <td style={{ padding: '0.9rem 1rem' }}>
                          <span style={{
                            padding: '0.25rem 0.65rem',
                            borderRadius: '50px',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            backgroundColor: isAdmission ? '#eff6ff' : '#f5f3ff',
                            color: isAdmission ? '#1d4ed8' : '#6d28d9',
                            border: `1px solid ${isAdmission ? '#bfdbfe' : '#ddd6fe'}`
                          }}>
                            {isAdmission ? '📝 Admission' : '✉️ General Query'}
                          </span>
                        </td>

                        {/* Contact & WhatsApp */}
                        <td style={{ padding: '0.9rem 1rem' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <a
                                href={`tel:${inq.phone}`}
                                style={{ fontWeight: 700, color: 'var(--primary-color)', textDecoration: 'none', fontSize: '0.85rem' }}
                              >
                                📞 {inq.phone || 'N/A'}
                              </a>
                              {inq.phone && (
                                <a
                                  href={`https://wa.me/${(inq.phone || '').replace(/[^0-9]/g, '')}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  style={{
                                    backgroundColor: '#25d366',
                                    color: '#ffffff',
                                    padding: '1px 6px',
                                    borderRadius: '4px',
                                    fontSize: '0.7rem',
                                    fontWeight: 700,
                                    textDecoration: 'none'
                                  }}
                                  title="Chat on WhatsApp"
                                >
                                  💬 WA
                                </a>
                              )}
                            </div>
                            {inq.email && (
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                ✉️ {inq.email}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Grade / Subject */}
                        <td style={{ padding: '0.9rem 1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {inq.grade || inq.subject || '—'}
                        </td>

                        {/* Date */}
                        <td style={{ padding: '0.9rem 1rem', fontSize: '0.8rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                          {inq.createdAt ? new Date(inq.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                        </td>

                        {/* Status */}
                        <td style={{ padding: '0.9rem 1rem' }}>
                          <select
                            value={inq.status || 'new'}
                            disabled={updatingId === inq.id}
                            onChange={(e) => handleStatusChange(inq.id, e.target.value)}
                            style={{
                              padding: '0.35rem 0.65rem',
                              borderRadius: '50px',
                              fontSize: '0.78rem',
                              fontWeight: 800,
                              backgroundColor: statusObj.bg,
                              color: statusObj.text,
                              border: `1px solid ${statusObj.text}44`,
                              cursor: 'pointer',
                              outline: 'none'
                            }}
                          >
                            <option value="new">⚡ New Lead</option>
                            <option value="contacted">📞 Contacted</option>
                            <option value="scheduled">📅 Interview</option>
                            <option value="enrolled">🎓 Enrolled</option>
                            <option value="closed">✕ Closed</option>
                          </select>
                        </td>

                        {/* Actions */}
                        <td style={{ padding: '0.9rem 1rem', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '0.45rem', alignItems: 'center' }}>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedInquiry(inq);
                                setAdminNotes(inq.adminNotes || '');
                              }}
                              className="btn btn-outline"
                              style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem', borderRadius: '6px', fontWeight: 700 }}
                            >
                              👁️ Inspect
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(inq.id)}
                              className="btn"
                              style={{ 
                                padding: '0.35rem 0.6rem', 
                                fontSize: '0.85rem', 
                                borderRadius: '6px',
                                backgroundColor: '#fee2e2',
                                color: '#991b1b',
                                border: '1px solid #fecaca'
                              }}
                              title="Delete inquiry"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Selected Inquiry Detail Inspector */}
        {selectedInquiry && (
          <div className="card" style={{ padding: '1.5rem', borderTop: '4px solid var(--secondary-color)', position: 'sticky', top: '80px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary-color)' }}>
                Inquiry Details
              </h3>
              <button
                type="button"
                onClick={() => setSelectedInquiry(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', color: '#64748b' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'grid', gap: '0.8rem', fontSize: '0.88rem', marginBottom: '1.2rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 700, display: 'block' }}>STUDENT / APPLICANT:</span>
                <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>
                  {selectedInquiry.studentName || selectedInquiry.name}
                </span>
              </div>

              {selectedInquiry.parentName && (
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 700, display: 'block' }}>PARENT / GUARDIAN:</span>
                  <span style={{ fontWeight: 700 }}>{selectedInquiry.parentName}</span>
                </div>
              )}

              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 700, display: 'block' }}>PHONE NUMBER:</span>
                <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', marginTop: '2px' }}>
                  <a href={`tel:${selectedInquiry.phone}`} style={{ fontWeight: 800, color: 'var(--primary-color)' }}>
                    📞 {selectedInquiry.phone}
                  </a>
                  <a
                    href={`https://wa.me/${(selectedInquiry.phone || '').replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      backgroundColor: '#25d366',
                      color: '#ffffff',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      textDecoration: 'none'
                    }}
                  >
                    💬 WhatsApp
                  </a>
                </div>
              </div>

              {selectedInquiry.email && (
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 700, display: 'block' }}>EMAIL:</span>
                  <a href={`mailto:${selectedInquiry.email}`} style={{ color: 'var(--secondary-color)', fontWeight: 600 }}>
                    ✉️ {selectedInquiry.email}
                  </a>
                </div>
              )}

              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 700, display: 'block' }}>GRADE / INQUIRY SUBJECT:</span>
                <span style={{ fontWeight: 700, color: 'var(--primary-color)' }}>
                  {selectedInquiry.grade || selectedInquiry.subject || 'General'}
                </span>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 700, display: 'block' }}>COMMENTS / MESSAGE:</span>
                <div style={{ padding: '0.7rem', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0', marginTop: '3px', fontSize: '0.85rem', lineHeight: 1.5 }}>
                  {selectedInquiry.comments || selectedInquiry.message || 'No additional comments provided.'}
                </div>
              </div>
            </div>

            {/* Admin Internal Notes */}
            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary-color)', marginBottom: '0.3rem' }}>
                📝 Staff Follow-Up Notes:
              </label>
              <textarea
                rows={3}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="e.g. Spoke to father, invited for diagnostic test on Saturday at 10 AM..."
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.82rem',
                  marginBottom: '0.6rem'
                }}
              />
              <button
                type="button"
                onClick={() => handleSaveNotes(selectedInquiry.id)}
                className="btn btn-secondary"
                style={{ width: '100%', padding: '0.5rem', fontSize: '0.82rem', fontWeight: 800 }}
              >
                Save Internal Notes
              </button>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
