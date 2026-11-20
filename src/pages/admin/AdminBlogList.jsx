import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  fetchBlogPosts, 
  togglePostPublish, 
  deletePost, 
  BLOG_CATEGORIES 
} from '../../firebase/blogService';
import { isFirebaseConfigured } from '../../firebase/config';
import AdminHeader from '../../components/admin/AdminHeader';

export default function AdminBlogList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All', 'Published', 'Drafts'
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const loadPosts = async () => {
    setLoading(true);
    try {
      const data = await fetchBlogPosts({
        onlyPublished: false,
        category: selectedCategory === 'All' ? '' : selectedCategory,
        search: searchTerm,
      });

      let filtered = data;
      if (statusFilter === 'Published') {
        filtered = filtered.filter((p) => p.published);
      } else if (statusFilter === 'Drafts') {
        filtered = filtered.filter((p) => !p.published);
      }

      setPosts(filtered);
    } catch (err) {
      console.error('Error loading posts:', err);
      setFeedback({ type: 'error', message: 'Failed to load posts: ' + err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [selectedCategory, statusFilter, searchTerm]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadPosts();
  };

  const handleTogglePublished = async (post) => {
    try {
      await togglePostPublish(post.id, post.published);
      setFeedback({
        type: 'success',
        message: `Post "${post.title}" is now ${!post.published ? 'Published' : 'Draft'}.`
      });
      loadPosts();
    } catch (err) {
      console.error('Error toggling post:', err);
      setFeedback({ type: 'error', message: 'Failed to update publish state: ' + err.message });
    }
  };

  const handleDelete = async (post) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${post.title}"?`)) return;

    try {
      await deletePost(post.id);
      setFeedback({ type: 'success', message: 'Post successfully deleted.' });
      loadPosts();
    } catch (err) {
      console.error('Error deleting post:', err);
      setFeedback({ type: 'error', message: 'Failed to delete post: ' + err.message });
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '1240px' }}>
      {/* 1. UNIFIED ADMIN HEADER & NAVIGATION */}
      <AdminHeader
        title="School Blogs & Articles"
        subtitle="Publish and manage school articles, student stories, achievements, and campus updates."
        activeTab="blogs"
        actions={
          <Link 
            to="/admin/blogs/new" 
            className="btn btn-primary" 
            style={{ 
              fontWeight: 700,
              padding: '0.55rem 1.1rem',
              fontSize: '0.88rem',
              borderRadius: '8px',
              backgroundColor: 'var(--primary-color)',
              borderColor: 'var(--primary-color)',
              boxShadow: '0 2px 6px rgba(30, 58, 138, 0.2)'
            }}
          >
            + Create New Blog
          </Link>
        }
      />

      {feedback.message && (
        <div style={{
          padding: '0.8rem 1.2rem',
          borderRadius: 'var(--border-radius)',
          marginBottom: '1.5rem',
          backgroundColor: feedback.type === 'error' ? '#fee2e2' : '#dcfce7',
          color: feedback.type === 'error' ? '#991b1b' : '#166534',
          border: `1px solid ${feedback.type === 'error' ? '#ef4444' : '#22c55e'}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>{feedback.message}</span>
          <button 
            onClick={() => setFeedback({ type: '', message: '' })}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Unified Secondary Filter Bar */}
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
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {[
            { id: 'All', label: `All Articles (${posts.length})` },
            { id: 'Published', label: `● Published (${posts.filter(p => p.published).length})` },
            { id: 'Drafts', label: `○ Drafts (${posts.filter(p => !p.published).length})` },
          ].map(tab => {
            const isActive = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
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

          {/* Category Dropdown Pill */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: '0.42rem 0.8rem',
              borderRadius: '50px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              color: 'var(--text-primary)',
              fontWeight: 600,
              fontSize: '0.82rem',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option value="All">All Categories</option>
            {BLOG_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Search Input */}
        <div style={{ minWidth: '260px' }}>
          <input
            type="text"
            placeholder="🔍 Search articles, authors, topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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

      {/* Posts Table / List */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            Loading blog posts...
          </div>
        ) : posts.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              No blog posts found matching your criteria.
            </p>
            <Link to="/admin/blogs/new" className="btn btn-primary" style={{ fontSize: '0.9rem' }}>
              Create Your First Post
            </Link>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>ARTICLE</th>
                  <th style={{ padding: '0.75rem 1rem' }}>CATEGORY</th>
                  <th style={{ padding: '0.75rem 1rem' }}>STATUS</th>
                  <th style={{ padding: '0.75rem 1rem' }}>DATE</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '1rem', verticalAlign: 'top' }}>
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                        {post.coverImageUrl ? (
                          <img
                            src={post.coverImageUrl}
                            alt="Cover"
                            style={{
                              width: '56px',
                              height: '42px',
                              objectFit: 'cover',
                              borderRadius: 'var(--border-radius)',
                              flexShrink: 0
                            }}
                          />
                        ) : (
                          <div style={{
                            width: '56px',
                            height: '42px',
                            backgroundColor: '#f1f5f9',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--border-radius)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.2rem',
                            flexShrink: 0
                          }}>
                            📰
                          </div>
                        )}
                        <div>
                          <Link 
                            to={`/admin/blogs/edit/${post.id}`} 
                            style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.95rem' }}
                          >
                            {post.title}
                          </Link>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                            Slug: <code style={{ backgroundColor: '#f1f5f9', padding: '1px 4px', borderRadius: '3px' }}>{post.slug || post.id}</code>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '1rem', verticalAlign: 'middle' }}>
                      <span style={{
                        padding: '0.25rem 0.6rem',
                        borderRadius: 'var(--border-radius)',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        backgroundColor: '#f1f5f9',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-primary)'
                      }}>
                        {post.category || 'News'}
                      </span>
                    </td>

                    <td style={{ padding: '1rem', verticalAlign: 'middle' }}>
                      <button
                        onClick={() => handleTogglePublished(post)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          fontWeight: 600,
                          fontSize: '0.85rem',
                          color: post.published ? 'var(--success-color)' : 'var(--text-muted)'
                        }}
                        title={post.published ? 'Click to unpublish' : 'Click to publish'}
                      >
                        <span style={{ fontSize: '1rem' }}>{post.published ? '●' : '○'}</span>
                        {post.published ? 'Published' : 'Draft'}
                      </button>
                    </td>

                    <td style={{ padding: '1rem', verticalAlign: 'middle', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                      {post.publishedAt || 'Not published'}
                    </td>

                    <td style={{ padding: '1rem', verticalAlign: 'middle', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center' }}>
                        {post.published && (
                          <Link
                            to={`/blog/${post.slug || post.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-outline"
                            style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem', borderRadius: '6px' }}
                            title="View Public Post"
                          >
                            👁️ View
                          </Link>
                        )}
                        <Link
                          to={`/admin/blogs/edit/${post.id}`}
                          className="btn btn-outline"
                          style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem', borderRadius: '6px' }}
                        >
                          ✏️ Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(post)}
                          className="btn"
                          style={{ 
                            padding: '0.35rem 0.6rem', 
                            fontSize: '0.85rem', 
                            borderRadius: '6px',
                            backgroundColor: '#fee2e2',
                            color: '#991b1b',
                            border: '1px solid #fecaca'
                          }}
                          title="Delete Post"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
