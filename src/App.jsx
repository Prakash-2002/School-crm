import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminRoute from './components/AdminRoute';

// Public Pages
import HomePage from './pages/public/HomePage';
import AboutPage from './pages/public/AboutPage';
import AcademicsPage from './pages/public/AcademicsPage';
import FacilitiesPage from './pages/public/FacilitiesPage';
import AdmissionsPage from './pages/public/AdmissionsPage';
import ContactPage from './pages/public/ContactPage';
import BlogListPage from './pages/public/BlogListPage';
import BlogPostPage from './pages/public/BlogPostPage';
import LoginPage from './pages/public/LoginPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminInquiries from './pages/admin/AdminInquiries';
import AdminBlogList from './pages/admin/AdminBlogList';
import AdminBlogEditor from './pages/admin/AdminBlogEditor';
import AdminThemeSettings from './pages/admin/AdminThemeSettings';

// Global Styles
import './styles/theme.css';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <main style={{ flex: 1 }}>
              <Routes>
                {/* Public Dedicated Pages */}
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/academics" element={<AcademicsPage />} />
                <Route path="/facilities" element={<FacilitiesPage />} />
                <Route path="/admissions" element={<AdmissionsPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/blog" element={<BlogListPage />} />
                <Route path="/blog/:slug" element={<BlogPostPage />} />
                <Route path="/login" element={<LoginPage />} />

                {/* Protected Admin Routes */}
                <Route path="/admin" element={<AdminRoute />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="inquiries" element={<AdminInquiries />} />
                  <Route path="blogs" element={<AdminBlogList />} />
                  <Route path="blogs/new" element={<AdminBlogEditor />} />
                  <Route path="blogs/edit/:id" element={<AdminBlogEditor />} />
                  <Route path="blog" element={<Navigate to="/admin/blogs" replace />} />
                  <Route path="theme" element={<AdminThemeSettings />} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
