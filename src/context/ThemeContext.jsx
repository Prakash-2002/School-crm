import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase/config';

// Curated Educational & Clean Google Fonts
export const GOOGLE_FONTS_OPTIONS = [
  { id: 'Plus Jakarta Sans', name: 'Plus Jakarta Sans (Modern Academic)', category: 'sans-serif' },
  { id: 'Inter', name: 'Inter (Clean Standard)', category: 'sans-serif' },
  { id: 'Poppins', name: 'Poppins (Geometric & Friendly)', category: 'sans-serif' },
  { id: 'Merriweather', name: 'Merriweather (Classic Academic Serif)', category: 'serif' },
  { id: 'Montserrat', name: 'Montserrat (Authoritative Bold)', category: 'sans-serif' },
  { id: 'Roboto', name: 'Roboto (Clear & Legible)', category: 'sans-serif' },
];

export const defaultTheme = {
  // Brand Identity (Indian School Standards)
  schoolName: 'Delhi Heritage Public School',
  schoolSubName: 'Senior Secondary, Co-Educational • Affiliated to CBSE, New Delhi',
  schoolMotto: 'तमसो मा ज्योतिर्गमय (Lead Us from Darkness to Light)',
  cbseAffiliation: 'CBSE Affiliation No: 2130892 | School Code: 70415',
  phone: '+91 (011) 2765-4321 / +91 98765 43210',
  email: 'admissions@delhiheritage.edu.in',
  address: 'Sector 14, Institutional Area, Rohini, New Delhi - 110085',
  logoUrl: '',

  // Color Palette (Prestigious Indian School Theme: Deep Navy, Saffron/Maroon & Warm Gold)
  primaryColor: '#0a2540',       // Deep Academic Navy
  primaryHover: '#071829',
  secondaryColor: '#c2410c',     // Rich Indian Saffron / Terracotta
  secondaryHover: '#9a3412',
  accentColor: '#d97706',        // Warm Academic Gold
  maroonColor: '#881337',        // Deep Crimson Maroon
  backgroundColor: '#f8fafc',    // Crisp Light Slate White
  surfaceColor: '#ffffff',
  surfaceDark: '#0a2540',
  textPrimary: '#0f172a',
  textSecondary: '#475569',
  borderRadius: '8px',
  fontFamily: 'Plus Jakarta Sans',

  // Flash News Marquee
  tickerText: 'ADMISSIONS OPEN FOR ACADEMIC SESSION 2026-27 (PRE-NURSERY TO CLASS XI) • REGISTRATION FORMS AVAILABLE ONLINE • CBSE BOARD EXAMINATION 2026 PRACTICAL DATES ANNOUNCED • SCHOLARSHIP APTITUDE TEST THIS SUNDAY',

  // Hero Section
  heroBgUrl: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=1800&auto=format&fit=crop&q=85',
  heroEyebrow: 'ESTABLISHED 1988 • NIRF TOP RANKED SCHOOL',
  heroTitle: 'Nurturing Global Achievers, Rooted in Indian Values.',
  heroSubtitle: 'Empowering over 2,800 students with cutting-edge CBSE curriculum, Atal Tinkering Labs, Olympic-standard sports, and holistic moral leadership.',
  heroCtaPrimary: 'Online Admission 2026-27 →',
  heroCtaSecondary: 'CBSE Mandatory Disclosure',
  stat1Num: '2,800+',
  stat1Label: 'STUDENTS ENROLLED',
  stat2Num: '100%',
  stat2Label: 'CBSE BOARD PASS RATE',
  stat3Num: '18 : 1',
  stat3Label: 'STUDENT-TEACHER RATIO',
  stat4Num: '35+ Yrs',
  stat4Label: 'LEGACY OF EXCELLENCE',

  // Principal / Chairman Desk
  principalName: 'Dr. Sunita Sharma, Ph.D. (Edu), M.Sc., B.Ed.',
  principalDesignation: 'Principal & Director of Academics (National CBSE Awardee)',
  principalQuote: '“Education is not merely the accumulation of facts; it is the illumination of character, discipline, and curiosity. At our institution, we integrate modern scientific inquiry with timeless Indian ethos to prepare learners who excel nationally and globally.”',
  principalImgUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=85',

  // Campus Facilities Photos
  labImgUrl: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=800&auto=format&fit=crop&q=80',
  sportsImgUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop&q=80',
  libraryImgUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&auto=format&fit=crop&q=80',
  smartClassImgUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80',

  // Inter-House Points
  houseTagoreScore: '1,420 Pts',
  houseAshokaScore: '1,385 Pts',
  houseShivajiScore: '1,340 Pts',
  houseRamanScore: '1,310 Pts',
};

// Dynamically load Google Font via <link> stylesheet
export function loadGoogleFont(fontName) {
  if (!fontName || typeof document === 'undefined') return;

  const cleanName = fontName.replace(/['",]|sans-serif|serif/g, '').trim();
  if (!cleanName || cleanName.startsWith('-apple-system') || cleanName.startsWith('system-ui')) {
    return;
  }

  const linkId = 'dynamic-google-fonts';
  let link = document.getElementById(linkId);
  const fontUrlParam = encodeURIComponent(cleanName);
  const href = `https://fonts.googleapis.com/css2?family=${fontUrlParam}:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,600;1,700&display=swap`;

  if (!link) {
    link = document.createElement('link');
    link.id = linkId;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }
  if (link.href !== href) {
    link.href = href;
  }
}

const ThemeContext = createContext({
  theme: defaultTheme,
  loading: true,
  updateTheme: async () => {},
  resetToDefaults: () => {},
});

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(defaultTheme);
  const [loading, setLoading] = useState(true);

  // Apply theme settings to CSS Custom Properties on document.documentElement
  const applyThemeToDOM = useCallback((themeSettings) => {
    const root = document.documentElement;
    if (!root) return;

    if (themeSettings.primaryColor) root.style.setProperty('--primary-color', themeSettings.primaryColor);
    if (themeSettings.primaryHover) root.style.setProperty('--primary-hover', themeSettings.primaryHover);
    if (themeSettings.secondaryColor) root.style.setProperty('--secondary-color', themeSettings.secondaryColor);
    if (themeSettings.secondaryHover) root.style.setProperty('--secondary-hover', themeSettings.secondaryHover);
    if (themeSettings.accentColor) root.style.setProperty('--accent-color', themeSettings.accentColor);
    if (themeSettings.maroonColor) root.style.setProperty('--maroon-color', themeSettings.maroonColor);
    if (themeSettings.backgroundColor) root.style.setProperty('--background-color', themeSettings.backgroundColor);
    if (themeSettings.surfaceColor) root.style.setProperty('--surface-color', themeSettings.surfaceColor);
    if (themeSettings.surfaceDark) root.style.setProperty('--surface-dark', themeSettings.surfaceDark);
    if (themeSettings.textPrimary) root.style.setProperty('--text-primary', themeSettings.textPrimary);
    if (themeSettings.textSecondary) root.style.setProperty('--text-secondary', themeSettings.textSecondary);
    if (themeSettings.borderRadius) root.style.setProperty('--border-radius', themeSettings.borderRadius);

    if (themeSettings.fontFamily) {
      const selectedFont = themeSettings.fontFamily;
      const fontCategory = GOOGLE_FONTS_OPTIONS.find((f) => f.id === selectedFont)?.category || 'sans-serif';
      root.style.setProperty('--font-family', `'${selectedFont}', ${fontCategory}`);
      loadGoogleFont(selectedFont);
    }
  }, []);

  // Load theme from Firestore on initial mount (with clean fallback and offline cache)
  useEffect(() => {
    let isMounted = true;

    async function loadTheme() {
      // 1. Initial cached render for instant response
      const cached = localStorage.getItem('school_crm_theme');
      let initialSettings = defaultTheme;
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          initialSettings = { ...defaultTheme, ...parsed };
        } catch {
          // ignore cache parse error
        }
      }

      if (isMounted) {
        setTheme(initialSettings);
        applyThemeToDOM(initialSettings);
      }

      // 2. Fetch from Firestore (school_settings/theme) if configured and online
      if (isFirebaseConfigured && navigator.onLine) {
        try {
          const primaryRef = doc(db, 'school_settings', 'theme');
          let snap = await getDoc(primaryRef);

          if (!snap.exists()) {
            const legacyRef = doc(db, 'settings', 'theme');
            const legacySnap = await getDoc(legacyRef);
            if (legacySnap.exists()) {
              snap = legacySnap;
            }
          }

          if (snap.exists() && isMounted) {
            const remoteData = snap.data();
            const merged = { ...defaultTheme, ...remoteData };
            setTheme(merged);
            applyThemeToDOM(merged);
            localStorage.setItem('school_crm_theme', JSON.stringify(merged));
          }
        } catch (error) {
          console.warn('[ThemeContext] Could not load theme from Firestore; falling back to clean school defaults/offline cache:', error);
        }
      }

      if (isMounted) setLoading(false);
    }

    loadTheme();

    return () => {
      isMounted = false;
    };
  }, [applyThemeToDOM]);

  // Update theme in state, DOM custom properties, localStorage, and optionally Firestore
  const updateTheme = async (newThemeValues, persistToFirestore = false) => {
    const updated = { ...theme, ...newThemeValues };
    setTheme(updated);
    applyThemeToDOM(updated);
    localStorage.setItem('school_crm_theme', JSON.stringify(updated));

    if (persistToFirestore && isFirebaseConfigured) {
      const docRef = doc(db, 'school_settings', 'theme');
      await setDoc(docRef, updated, { merge: true });
    }
  };

  const resetToDefaults = async (persistToFirestore = false) => {
    setTheme(defaultTheme);
    applyThemeToDOM(defaultTheme);
    localStorage.setItem('school_crm_theme', JSON.stringify(defaultTheme));

    if (persistToFirestore && isFirebaseConfigured) {
      const docRef = doc(db, 'school_settings', 'theme');
      await setDoc(docRef, defaultTheme);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, loading, updateTheme, resetToDefaults }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
