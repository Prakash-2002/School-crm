import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchInquiries } from '../../firebase/inquiryService';

/**
 * Reusable unified top header and navigation for all Admin Portal pages.
 * Guarantees 100% identical styling, consistent color tokens, badge counts,
 * and seamless navigation across the entire CRM.
 */
export default function AdminHeader({
  title,
  subtitle,
  activeTab = 'dashboard', // 'dashboard' | 'inquiries' | 'blogs' | 'theme'
  actions = null,
  newInquiriesCount = undefined
}) {
  const [unreadCount, setUnreadCount] = useState(newInquiriesCount || 0);

  useEffect(() => {
    if (typeof newInquiriesCount === 'number') {
      setUnreadCount(newInquiriesCount);
    } else {
      // Automatically sync badge count across all admin pages
      fetchInquiries()
        .then((items) => {
          if (items) {
            const count = items.filter((i) => i.status === 'new').length;
            setUnreadCount(count);
          }
        })
        .catch(() => {});
    }
  }, [newInquiriesCount]);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: '📊', path: '/admin' },
    { 
      id: 'inquiries', 
      label: 'Inquiries & Leads', 
      icon: '📥', 
      path: '/admin/inquiries', 
      badge: unreadCount > 0 ? unreadCount : null 
    },
    { id: 'blogs', label: 'School Blogs', icon: '📰', path: '/admin/blogs' },
    { id: 'theme', label: 'Website Customizer & Photos', icon: '🎨', path: '/admin/theme' },
  ];

  return (
    <div style={{ marginBottom: '2rem' }}>
      {/* 1. Header Row: Title, Subtitle on Left, Actions on Right (Always in Row on Desktop) */}
      <div 
        className="admin-header-row"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1.5rem',
          marginBottom: '1.5rem',
        }}
      >
        <div style={{ minWidth: 0, flex: '1 1 auto' }}>
          <h1 style={{
            fontSize: 'clamp(1.5rem, 2.5vw, 2.1rem)',
            color: 'var(--text-primary)',
            fontWeight: 800,
            margin: '0 0 0.35rem 0',
            letterSpacing: '-0.025em',
            lineHeight: 1.2
          }}>
            {title}
          </h1>
          {subtitle && (
            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '0.92rem',
              margin: 0,
              lineHeight: 1.45,
              maxWidth: '650px'
            }}>
              {subtitle}
            </p>
          )}
        </div>

        {/* Action Buttons Toolbar (Always side-by-side in a horizontal row) */}
        <div style={{
          display: 'inline-flex',
          gap: '0.65rem',
          alignItems: 'center',
          flexShrink: 0,
          whiteSpace: 'nowrap'
        }}>
          <Link
            to="/"
            target="_blank"
            className="btn btn-outline"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              fontWeight: 700,
              fontSize: '0.86rem',
              padding: '0.55rem 0.95rem',
              borderRadius: '8px',
              backgroundColor: '#ffffff',
              borderColor: '#cbd5e1',
              color: 'var(--text-primary)',
              whiteSpace: 'nowrap'
            }}
          >
            🌐 View Live Website ↗
          </Link>
          {actions}
        </div>
      </div>

      {/* 2. Unified Sub-Navigation Tabs Bar */}
      <div style={{
        display: 'flex',
        gap: '0.4rem',
        backgroundColor: '#f1f5f9',
        padding: '0.35rem',
        borderRadius: '10px',
        border: '1px solid #e2e8f0',
        flexWrap: 'wrap',
        overflowX: 'auto',
        alignItems: 'center'
      }}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <Link
              key={tab.id}
              to={tab.path}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.55rem 1.1rem',
                borderRadius: '8px',
                fontWeight: isActive ? 800 : 600,
                fontSize: '0.88rem',
                textDecoration: 'none',
                backgroundColor: isActive ? '#ffffff' : 'transparent',
                color: isActive ? 'var(--primary-color)' : 'var(--text-secondary)',
                border: isActive ? '1px solid #cbd5e1' : '1px solid transparent',
                boxShadow: isActive ? '0 2px 4px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap'
              }}
            >
              <span style={{ fontSize: '1rem' }}>{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.badge && (
                <span style={{
                  backgroundColor: '#ef4444',
                  color: '#ffffff',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '1px 6px',
                  borderRadius: '10px',
                  lineHeight: '1.2'
                }}>
                  {tab.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
