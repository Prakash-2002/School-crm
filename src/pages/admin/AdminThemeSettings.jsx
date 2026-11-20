import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  useTheme, 
  defaultTheme, 
  GOOGLE_FONTS_OPTIONS 
} from '../../context/ThemeContext';
import { isFirebaseConfigured, uploadSchoolLogo, compressImageFile } from '../../firebase/config';
import AdminHeader from '../../components/admin/AdminHeader';

/**
 * Reusable Modern Media Studio Card for homepage photo management.
 * Provides live aspect ratio preview, styled file upload, direct URL input,
 * and 1-click restore to defaults.
 */
function PhotoEditorCard({
  title,
  subtitle,
  field,
  value,
  defaultValue,
  isSquare = false,
  uploading = false,
  onUpload,
  onChange,
  onReset
}) {
  return (
    <div className="card" style={{ padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '0.8rem' }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary-color)', margin: '0 0 0.25rem 0' }}>
            {title}
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>
            {subtitle}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onReset(field, defaultValue)}
          className="btn btn-outline"
          style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem', borderRadius: '6px' }}
        >
          ↺ Reset to Default
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', alignItems: 'center' }}>
        {/* Left: Live Visual Thumbnail */}
        <div style={{
          position: 'relative',
          borderRadius: '10px',
          overflow: 'hidden',
          height: isSquare ? '180px' : '170px',
          width: isSquare ? '180px' : '100%',
          backgroundColor: '#f1f5f9',
          border: '1px solid #cbd5e1',
          boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
        }}>
          <img
            src={value}
            alt={title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            color: '#ffffff',
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '0.7rem',
            fontWeight: 700,
            backdropFilter: 'blur(4px)'
          }}>
            Live Preview
          </div>
        </div>

        {/* Right: Modern Upload Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          <div>
            <label
              className="btn btn-primary"
              style={{
                cursor: uploading ? 'wait' : 'pointer',
                padding: '0.55rem 1.1rem',
                fontSize: '0.85rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                borderRadius: '8px',
                backgroundColor: 'var(--primary-color)',
                borderColor: 'var(--primary-color)',
                boxShadow: '0 2px 5px rgba(30, 58, 138, 0.2)'
              }}
            >
              <span>{uploading ? '⏳ Optimizing Photo...' : '📤 Upload from Computer'}</span>
              <input
                type="file"
                accept="image/*"
                disabled={uploading}
                onChange={(e) => onUpload(field, e.target.files?.[0])}
                style={{ display: 'none' }}
              />
            </label>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
              JPG, PNG or WebP • Automatically optimized for lightning fast page speed.
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Or Direct Image Web Address (URL):
            </label>
            <input
              type="url"
              value={value}
              onChange={(e) => onChange(field, e.target.value)}
              placeholder="https://images.unsplash.com/..."
              style={{
                width: '100%',
                padding: '0.5rem 0.8rem',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '0.88rem',
                backgroundColor: '#ffffff'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminThemeSettings() {
  const { theme, updateTheme, resetToDefaults } = useTheme();

  const [activeTab, setActiveTab] = useState('photos'); // 'photos', 'identity', 'hero', 'principal', 'colors'
  const [formData, setFormData] = useState({ ...defaultTheme, ...theme });
  const [saving, setSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState(null);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Keep form in sync when context loads
  useEffect(() => {
    setFormData((prev) => ({
      ...defaultTheme,
      ...prev,
      ...theme,
    }));
  }, [theme]);

  // Real-time update of local form state and DOM custom properties
  const handleChange = (field, value) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    updateTheme(updated, false);
  };

  // Safe image file handler with automatic canvas compression & fallback
  const handleImageUpload = async (field, file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setFeedback({ type: 'error', message: 'Please select a valid image file (PNG, JPG, WebP, SVG).' });
      return;
    }

    setUploadingField(field);
    setFeedback({ type: 'info', message: 'Optimizing and attaching image...' });

    try {
      let finalUrl;
      if (isFirebaseConfigured) {
        finalUrl = await uploadSchoolLogo(file);
      } else {
        finalUrl = await compressImageFile(file, 1200, 800, 0.75);
      }

      handleChange(field, finalUrl);
      setFeedback({ type: 'success', message: 'Image successfully attached! Click "Save & Publish Changes" to update the live site.' });
    } catch (err) {
      console.error('Image upload failed:', err);
      // Fall back directly to compressed data url
      try {
        const fallbackUrl = await compressImageFile(file, 1000, 700, 0.7);
        handleChange(field, fallbackUrl);
        setFeedback({ type: 'success', message: 'Image attached! Click Save to publish.' });
      } catch (fallbackErr) {
        setFeedback({ type: 'error', message: 'Upload failed: ' + err.message });
      }
    } finally {
      setUploadingField(null);
    }
  };

  // Save all theme and homepage customizations
  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    setFeedback({ type: '', message: '' });

    try {
      const settingsToSave = {
        ...formData,
        updatedAt: new Date().toISOString(),
      };

      await updateTheme(settingsToSave, true);

      setFeedback({
        type: 'success',
        message: 'All website customizations & photos have been saved and published successfully to the live site!',
      });
    } catch (err) {
      console.error('Failed to save theme:', err);
      setFeedback({ type: 'error', message: 'Failed to save settings: ' + err.message });
    } finally {
      setSaving(false);
    }
  };

  // Reset all settings to Indian School default design
  const handleReset = async () => {
    if (window.confirm('Reset all colors, photos, and Indian school copy back to default settings?')) {
      await resetToDefaults(isFirebaseConfigured);
      setFormData(defaultTheme);
      setFeedback({ type: 'info', message: 'Restored all settings back to standard defaults.' });
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '1240px' }}>
      
      {/* 1. UNIFIED ADMIN HEADER & NAVIGATION */}
      <AdminHeader
        title="Website & Visual Identity Customizer"
        subtitle="Customize homepage photos, headlines, notice ticker, and CBSE affiliation details across your school website."
        activeTab="theme"
        actions={
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="btn btn-primary"
            style={{ 
              fontWeight: 700, 
              padding: '0.55rem 1.2rem', 
              fontSize: '0.86rem',
              backgroundColor: 'var(--primary-color)', 
              borderColor: 'var(--primary-color)',
              borderRadius: '8px',
              boxShadow: '0 2px 6px rgba(30, 58, 138, 0.2)',
              whiteSpace: 'nowrap'
            }}
          >
            {saving ? '⏳ Publishing...' : '💾 Save & Publish Changes'}
          </button>
        }
      />

   

      {/* Feedback Banner */}
      {feedback.message && (
        <div style={{
          padding: '0.9rem 1.2rem',
          borderRadius: 'var(--border-radius)',
          marginBottom: '1.5rem',
          backgroundColor: feedback.type === 'error' ? '#fee2e2' : feedback.type === 'success' ? '#dcfce7' : '#e0f2fe',
          color: feedback.type === 'error' ? '#991b1b' : feedback.type === 'success' ? '#166534' : '#0369a1',
          border: `1px solid ${feedback.type === 'error' ? '#ef4444' : feedback.type === 'success' ? '#22c55e' : '#38bdf8'}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{ fontWeight: 600 }}>{feedback.message}</span>
          <button 
            onClick={() => setFeedback({ type: '', message: '' })} 
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', color: 'inherit' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Unified Secondary Navigation Pills */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        backgroundColor: '#f8fafc',
        padding: '0.8rem 1rem',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        marginBottom: '2rem',
        flexWrap: 'wrap'
      }}>
        {[
          { id: 'photos', label: '🖼️ Replace Homepage Photos' },
          { id: 'identity', label: '🏫 School Name & Affiliation' },
          { id: 'hero', label: '📢 Hero Banner & Marquee Ticker' },
          { id: 'principal', label: '🏛️ Principal Desk & House Points' },
          { id: 'colors', label: '🎨 Brand Colors & Typography' },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '0.45rem 1rem',
                borderRadius: '50px',
                border: `1px solid ${isActive ? 'var(--primary-color)' : '#cbd5e1'}`,
                backgroundColor: isActive ? 'var(--primary-color)' : '#ffffff',
                color: isActive ? '#ffffff' : 'var(--text-primary)',
                fontWeight: isActive ? 800 : 600,
                fontSize: '0.84rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ========================================================
          TAB 1: REPLACE ALL HOMEPAGE PHOTOS (HERO, PRINCIPAL, LABS, ETC)
          ======================================================== */}
      {activeTab === 'photos' && (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          
          <div style={{
            backgroundColor: '#eff6ff',
            border: '1px solid #bfdbfe',
            padding: '1rem 1.2rem',
            borderRadius: '10px',
            color: '#1e40af',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <span style={{ fontSize: '1.3rem' }}>💡</span>
            <div>
              <strong>Instant Visual Customization:</strong> Click <strong>"Upload from Computer"</strong> to pick any photo from your machine (automatically compressed and optimized for mobile & desktop speed) or paste a direct image URL.
            </div>
          </div>

          <PhotoEditorCard
            title="1. Hero Campus Banner Background"
            subtitle="The grand campus entrance photo featured behind the main homepage banner."
            field="heroBgUrl"
            value={formData.heroBgUrl}
            defaultValue={defaultTheme.heroBgUrl}
            uploading={uploadingField === 'heroBgUrl'}
            onUpload={handleImageUpload}
            onChange={handleChange}
            onReset={handleChange}
          />

          <PhotoEditorCard
            title="2. Principal / Director Portrait"
            subtitle="Portrait photograph featured prominently on the Principal's Desk section."
            field="principalImgUrl"
            value={formData.principalImgUrl}
            defaultValue={defaultTheme.principalImgUrl}
            isSquare={true}
            uploading={uploadingField === 'principalImgUrl'}
            onUpload={handleImageUpload}
            onChange={handleChange}
            onReset={handleChange}
          />

          <PhotoEditorCard
            title="3. Atal Tinkering / Science STEM Lab"
            subtitle="Appears in Campus Facilities showing robotics, 3D printing, and science laboratories."
            field="labImgUrl"
            value={formData.labImgUrl}
            defaultValue={defaultTheme.labImgUrl}
            uploading={uploadingField === 'labImgUrl'}
            onUpload={handleImageUpload}
            onChange={handleChange}
            onReset={handleChange}
          />

          <PhotoEditorCard
            title="4. Olympic Sports Grounds & Arena"
            subtitle="Photo of athletics track, football turf, cricket pitch, basketball court, or swimming pool."
            field="sportsImgUrl"
            value={formData.sportsImgUrl}
            defaultValue={defaultTheme.sportsImgUrl}
            uploading={uploadingField === 'sportsImgUrl'}
            onUpload={handleImageUpload}
            onChange={handleChange}
            onReset={handleChange}
          />

          <PhotoEditorCard
            title="5. Central Resource Library"
            subtitle="Photo of students reading and studying in the well-stocked school library."
            field="libraryImgUrl"
            value={formData.libraryImgUrl}
            defaultValue={defaultTheme.libraryImgUrl}
            uploading={uploadingField === 'libraryImgUrl'}
            onUpload={handleImageUpload}
            onChange={handleChange}
            onReset={handleChange}
          />

          <PhotoEditorCard
            title="6. Smart Digital Classroom"
            subtitle="Photo of modern technology-enabled digital classroom with interactive panels."
            field="smartClassImgUrl"
            value={formData.smartClassImgUrl}
            defaultValue={defaultTheme.smartClassImgUrl}
            uploading={uploadingField === 'smartClassImgUrl'}
            onUpload={handleImageUpload}
            onChange={handleChange}
            onReset={handleChange}
          />

        </div>
      )}

      {/* ========================================================
          TAB 2: SCHOOL NAME, LOGO & AFFILIATION
          ======================================================== */}
      {activeTab === 'identity' && (
        <div style={{ display: 'grid', gap: '2rem' }}>
          
          <div className="card">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-color)', marginBottom: '1.2rem' }}>
              Official School Identity & Crest
            </h3>

            {/* School Crest / Logo */}
            <div style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                School Crest / Emblem / Logo:
              </label>
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{
                  width: '70px',
                  height: '70px',
                  borderRadius: '50%',
                  border: '2px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#f8fafc',
                  overflow: 'hidden'
                }}>
                  {formData.logoUrl ? (
                    <img src={formData.logoUrl} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  ) : (
                    <span style={{ fontSize: '1.8rem' }}>🏫</span>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label
                    className="btn btn-primary"
                    style={{
                      cursor: 'pointer',
                      padding: '0.45rem 0.95rem',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      borderRadius: '8px',
                      backgroundColor: 'var(--primary-color)',
                      borderColor: 'var(--primary-color)'
                    }}
                  >
                    <span>📤 Upload School Crest / Logo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload('logoUrl', e.target.files?.[0])}
                      style={{ display: 'none' }}
                    />
                  </label>
                  {formData.logoUrl && (
                    <button
                      type="button"
                      onClick={() => handleChange('logoUrl', '')}
                      style={{ fontSize: '0.78rem', color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left' }}
                    >
                      ↺ Remove Crest (Use Default Icon)
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* School Name */}
            <div style={{ marginBottom: '1.2rem' }}>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                Full Institution / School Name:
              </label>
              <input
                type="text"
                value={formData.schoolName}
                onChange={(e) => handleChange('schoolName', e.target.value)}
                style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '1rem', fontWeight: 600 }}
              />
            </div>

            {/* Subtitle / Affiliation Status */}
            <div style={{ marginBottom: '1.2rem' }}>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                Header Subtitle / Affiliation Summary:
              </label>
              <input
                type="text"
                value={formData.schoolSubName}
                onChange={(e) => handleChange('schoolSubName', e.target.value)}
                style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.92rem' }}
              />
            </div>

            {/* Sanskrit Motto */}
            <div style={{ marginBottom: '1.2rem' }}>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                Institutional Sanskrit Motto:
              </label>
              <input
                type="text"
                value={formData.schoolMotto}
                onChange={(e) => handleChange('schoolMotto', e.target.value)}
                placeholder="तमसो मा ज्योतिर्गमय (Lead Us from Darkness to Light)"
                style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.92rem' }}
              />
            </div>

            {/* CBSE Affiliation String */}
            <div style={{ marginBottom: '1.2rem' }}>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                Affiliation Number & School Code:
              </label>
              <input
                type="text"
                value={formData.cbseAffiliation}
                onChange={(e) => handleChange('cbseAffiliation', e.target.value)}
                placeholder="CBSE Affiliation No: 2130892 | School Code: 70415"
                style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.92rem' }}
              />
            </div>

            {/* Phone & Email */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.2rem' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                  Admission Helpline / Phone:
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.92rem' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                  Official Email:
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.92rem' }}
                />
              </div>
            </div>

            {/* Campus Address */}
            <div>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                Campus Full Address (with PIN Code):
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.92rem' }}
              />
            </div>

          </div>

        </div>
      )}

      {/* ========================================================
          TAB 3: HERO BANNER & FLASH MARQUEE TICKER
          ======================================================== */}
      {activeTab === 'hero' && (
        <div style={{ display: 'grid', gap: '2rem' }}>
          
          <div className="card">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-color)', marginBottom: '1rem' }}>
              ⚡ Flash News Marquee / Ticker (Signature Indian School Bar)
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.8rem' }}>
              This scrolling ticker appears immediately beneath the navigation on the homepage to broadcast urgent circulars, admission deadlines, and board results.
            </p>
            <textarea
              rows={3}
              value={formData.tickerText}
              onChange={(e) => handleChange('tickerText', e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.92rem', lineHeight: 1.5 }}
            />
          </div>

          <div className="card">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-color)', marginBottom: '1.2rem' }}>
              Grand Hero Section Content
            </h3>

            {/* Eyebrow */}
            <div style={{ marginBottom: '1.2rem' }}>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                Eyebrow Accreditation Tag:
              </label>
              <input
                type="text"
                value={formData.heroEyebrow}
                onChange={(e) => handleChange('heroEyebrow', e.target.value)}
                placeholder="ESTABLISHED 1988 • NIRF TOP RANKED SCHOOL"
                style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.92rem' }}
              />
            </div>

            {/* Hero Title */}
            <div style={{ marginBottom: '1.2rem' }}>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                Hero Main Headline:
              </label>
              <input
                type="text"
                value={formData.heroTitle}
                onChange={(e) => handleChange('heroTitle', e.target.value)}
                style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '1.05rem', fontWeight: 700 }}
              />
            </div>

            {/* Hero Subtitle */}
            <div style={{ marginBottom: '1.2rem' }}>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                Hero Subtitle Description:
              </label>
              <textarea
                rows={2}
                value={formData.heroSubtitle}
                onChange={(e) => handleChange('heroSubtitle', e.target.value)}
                style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.92rem' }}
              />
            </div>

            {/* CTA Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                  Primary CTA Button:
                </label>
                <input
                  type="text"
                  value={formData.heroCtaPrimary}
                  onChange={(e) => handleChange('heroCtaPrimary', e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.92rem' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                  Secondary CTA Button:
                </label>
                <input
                  type="text"
                  value={formData.heroCtaSecondary}
                  onChange={(e) => handleChange('heroCtaSecondary', e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.92rem' }}
                />
              </div>
            </div>

            {/* 4 Stats Counters */}
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary-color)', marginBottom: '0.8rem' }}>
              4 Academic Pillars / Stat Counters
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div style={{ padding: '0.8rem', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Stat 1 Number & Label:</label>
                <input
                  type="text"
                  value={formData.stat1Num}
                  onChange={(e) => handleChange('stat1Num', e.target.value)}
                  placeholder="2,800+"
                  style={{ width: '100%', padding: '0.4rem', marginBottom: '0.4rem', fontWeight: 800 }}
                />
                <input
                  type="text"
                  value={formData.stat1Label}
                  onChange={(e) => handleChange('stat1Label', e.target.value)}
                  placeholder="STUDENTS ENROLLED"
                  style={{ width: '100%', padding: '0.4rem', fontSize: '0.8rem' }}
                />
              </div>

              <div style={{ padding: '0.8rem', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Stat 2 Number & Label:</label>
                <input
                  type="text"
                  value={formData.stat2Num}
                  onChange={(e) => handleChange('stat2Num', e.target.value)}
                  placeholder="100%"
                  style={{ width: '100%', padding: '0.4rem', marginBottom: '0.4rem', fontWeight: 800 }}
                />
                <input
                  type="text"
                  value={formData.stat2Label}
                  onChange={(e) => handleChange('stat2Label', e.target.value)}
                  placeholder="CBSE BOARD PASS RATE"
                  style={{ width: '100%', padding: '0.4rem', fontSize: '0.8rem' }}
                />
              </div>

              <div style={{ padding: '0.8rem', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Stat 3 Number & Label:</label>
                <input
                  type="text"
                  value={formData.stat3Num}
                  onChange={(e) => handleChange('stat3Num', e.target.value)}
                  placeholder="18 : 1"
                  style={{ width: '100%', padding: '0.4rem', marginBottom: '0.4rem', fontWeight: 800 }}
                />
                <input
                  type="text"
                  value={formData.stat3Label}
                  onChange={(e) => handleChange('stat3Label', e.target.value)}
                  placeholder="STUDENT-TEACHER RATIO"
                  style={{ width: '100%', padding: '0.4rem', fontSize: '0.8rem' }}
                />
              </div>

              <div style={{ padding: '0.8rem', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Stat 4 Number & Label:</label>
                <input
                  type="text"
                  value={formData.stat4Num}
                  onChange={(e) => handleChange('stat4Num', e.target.value)}
                  placeholder="35+ Yrs"
                  style={{ width: '100%', padding: '0.4rem', marginBottom: '0.4rem', fontWeight: 800 }}
                />
                <input
                  type="text"
                  value={formData.stat4Label}
                  onChange={(e) => handleChange('stat4Label', e.target.value)}
                  placeholder="LEGACY OF EXCELLENCE"
                  style={{ width: '100%', padding: '0.4rem', fontSize: '0.8rem' }}
                />
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================
          TAB 4: PRINCIPAL'S DESK & HOUSE CHAMPIONSHIP
          ======================================================== */}
      {activeTab === 'principal' && (
        <div style={{ display: 'grid', gap: '2rem' }}>
          
          <div className="card">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-color)', marginBottom: '1.2rem' }}>
              Principal / Director's Desk Message
            </h3>

            <div style={{ marginBottom: '1.2rem' }}>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                Principal Name & Academic Titles:
              </label>
              <input
                type="text"
                value={formData.principalName}
                onChange={(e) => handleChange('principalName', e.target.value)}
                placeholder="Dr. Sunita Sharma, Ph.D. (Edu), M.Sc., B.Ed."
                style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.95rem', fontWeight: 600 }}
              />
            </div>

            <div style={{ marginBottom: '1.2rem' }}>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                Designation & Awards:
              </label>
              <input
                type="text"
                value={formData.principalDesignation}
                onChange={(e) => handleChange('principalDesignation', e.target.value)}
                placeholder="Principal & Director of Academics (National CBSE Awardee)"
                style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.92rem' }}
              />
            </div>

            <div style={{ marginBottom: '1.2rem' }}>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                Principal's Educational Quote / Philosophy:
              </label>
              <textarea
                rows={4}
                value={formData.principalQuote}
                onChange={(e) => handleChange('principalQuote', e.target.value)}
                style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.92rem', lineHeight: 1.6 }}
              />
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-color)', marginBottom: '0.5rem' }}>
              🏆 Inter-House Championship Points Tally
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>
              Real-time scores for the 4 school houses (Tagore, Ashoka, Shivaji, Raman) displayed on the live homepage leaderboard.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div style={{ borderLeft: '4px solid #b91c1c', padding: '0.8rem', backgroundColor: '#fef2f2', borderRadius: '0 6px 6px 0' }}>
                <span style={{ fontWeight: 800, color: '#b91c1c', fontSize: '0.9rem' }}>Tagore House (Red)</span>
                <input
                  type="text"
                  value={formData.houseTagoreScore}
                  onChange={(e) => handleChange('houseTagoreScore', e.target.value)}
                  placeholder="1,420 Pts"
                  style={{ width: '100%', padding: '0.45rem', marginTop: '0.4rem', fontWeight: 700 }}
                />
              </div>

              <div style={{ borderLeft: '4px solid #d97706', padding: '0.8rem', backgroundColor: '#fffbeb', borderRadius: '0 6px 6px 0' }}>
                <span style={{ fontWeight: 800, color: '#d97706', fontSize: '0.9rem' }}>Ashoka House (Gold)</span>
                <input
                  type="text"
                  value={formData.houseAshokaScore}
                  onChange={(e) => handleChange('houseAshokaScore', e.target.value)}
                  placeholder="1,385 Pts"
                  style={{ width: '100%', padding: '0.45rem', marginTop: '0.4rem', fontWeight: 700 }}
                />
              </div>

              <div style={{ borderLeft: '4px solid #1d4ed8', padding: '0.8rem', backgroundColor: '#eff6ff', borderRadius: '0 6px 6px 0' }}>
                <span style={{ fontWeight: 800, color: '#1d4ed8', fontSize: '0.9rem' }}>Shivaji House (Blue)</span>
                <input
                  type="text"
                  value={formData.houseShivajiScore}
                  onChange={(e) => handleChange('houseShivajiScore', e.target.value)}
                  placeholder="1,340 Pts"
                  style={{ width: '100%', padding: '0.45rem', marginTop: '0.4rem', fontWeight: 700 }}
                />
              </div>

              <div style={{ borderLeft: '4px solid #047857', padding: '0.8rem', backgroundColor: '#f0fdf4', borderRadius: '0 6px 6px 0' }}>
                <span style={{ fontWeight: 800, color: '#047857', fontSize: '0.9rem' }}>Raman House (Green)</span>
                <input
                  type="text"
                  value={formData.houseRamanScore}
                  onChange={(e) => handleChange('houseRamanScore', e.target.value)}
                  placeholder="1,310 Pts"
                  style={{ width: '100%', padding: '0.45rem', marginTop: '0.4rem', fontWeight: 700 }}
                />
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================
          TAB 5: BRAND COLORS & TYPOGRAPHY
          ======================================================== */}
      {activeTab === 'colors' && (
        <div style={{ display: 'grid', gap: '2rem' }}>
          
          <div className="card">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-color)', marginBottom: '1.2rem' }}>
              Academic Color Palette
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
              {/* Primary Color */}
              <div>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                  Primary (Deep Academic Navy):
                </label>
                <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                  <input
                    type="color"
                    value={formData.primaryColor}
                    onChange={(e) => handleChange('primaryColor', e.target.value)}
                    style={{ width: '48px', height: '42px', border: 'none', cursor: 'pointer', borderRadius: '6px' }}
                  />
                  <input
                    type="text"
                    value={formData.primaryColor}
                    onChange={(e) => handleChange('primaryColor', e.target.value)}
                    style={{ flex: 1, padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.88rem' }}
                  />
                </div>
              </div>

              {/* Secondary Color */}
              <div>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                  Secondary (Indian Saffron / Terracotta):
                </label>
                <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                  <input
                    type="color"
                    value={formData.secondaryColor}
                    onChange={(e) => handleChange('secondaryColor', e.target.value)}
                    style={{ width: '48px', height: '42px', border: 'none', cursor: 'pointer', borderRadius: '6px' }}
                  />
                  <input
                    type="text"
                    value={formData.secondaryColor}
                    onChange={(e) => handleChange('secondaryColor', e.target.value)}
                    style={{ flex: 1, padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.88rem' }}
                  />
                </div>
              </div>

              {/* Accent Color */}
              <div>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                  Accent (Warm Academic Gold):
                </label>
                <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                  <input
                    type="color"
                    value={formData.accentColor}
                    onChange={(e) => handleChange('accentColor', e.target.value)}
                    style={{ width: '48px', height: '42px', border: 'none', cursor: 'pointer', borderRadius: '6px' }}
                  />
                  <input
                    type="text"
                    value={formData.accentColor}
                    onChange={(e) => handleChange('accentColor', e.target.value)}
                    style={{ flex: 1, padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.88rem' }}
                  />
                </div>
              </div>
            </div>

            {/* Typography */}
            <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                Primary Academic Font Family (Google Fonts):
              </label>
              <select
                value={formData.fontFamily}
                onChange={(e) => handleChange('fontFamily', e.target.value)}
                style={{ width: '100%', maxWidth: '400px', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.95rem' }}
              >
                {GOOGLE_FONTS_OPTIONS.map((f) => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
            </div>

            <div style={{ marginTop: '2rem' }}>
              <button
                type="button"
                onClick={handleReset}
                className="btn btn-outline"
                style={{ color: '#dc2626', borderColor: '#fca5a5' }}
              >
                ↺ Reset All Settings to Indian School Standard Defaults
              </button>
            </div>

          </div>

        </div>
      )}

      {/* Persistent Bottom Save Bar */}
      <div style={{
        marginTop: '2.5rem',
        padding: '1.2rem',
        backgroundColor: '#ffffff',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
      }}>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
          Remember to save your changes to publish all updates to the live website.
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="btn btn-primary"
          style={{ 
            fontWeight: 700, 
            padding: '0.65rem 1.8rem', 
            fontSize: '0.95rem', 
            backgroundColor: 'var(--primary-color)', 
            borderColor: 'var(--primary-color)',
            borderRadius: '8px',
            boxShadow: '0 2px 6px rgba(30, 58, 138, 0.2)'
          }}
        >
          {saving ? 'Publishing...' : '💾 Save & Publish Changes'}
        </button>
      </div>

    </div>
  );
}
