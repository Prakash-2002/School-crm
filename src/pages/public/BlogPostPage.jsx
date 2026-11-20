import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { fetchBlogPostBySlug } from '../../firebase/blogService';
import { isFirebaseConfigured } from '../../firebase/config';
import { samplePublicPosts } from './BlogListPage';

export default function BlogPostPage() {
  const { slug, id } = useParams();
  const slugOrId = slug || id;

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadArticle() {
      setLoading(true);
      setError(null);

      // 1. Check fallback sample posts first if offline or demo post
      const sampleMatch = samplePublicPosts.find(
        (p) => (p.slug === slugOrId || p.id === slugOrId) && p.published
      );
      if (sampleMatch) {
        setPost(sampleMatch);
        setLoading(false);
        return;
      }

      if (!isFirebaseConfigured) {
        setError('This article could not be found, and Firebase is not currently configured.');
        setLoading(false);
        return;
      }

      try {
        // Fetch only published post by slug
        const fetched = await fetchBlogPostBySlug(slugOrId, true);

        if (fetched) {
          setPost(fetched);
        } else {
          setError('Article not found or is currently an unpublished draft.');
        }
      } catch (err) {
        console.error('Error fetching blog post by slug:', err);
        setError('Failed to load article from the server.');
      } finally {
        setLoading(false);
      }
    }

    loadArticle();
  }, [slugOrId]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
        Loading article...
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: '520px', margin: '0 auto', padding: '2.5rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
          <h2 style={{ marginBottom: '0.8rem', color: 'var(--danger-color)' }}>
            Article Unavailable
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            {error || 'The requested article could not be found. It may have been unpublished or removed.'}
          </p>
          <Link to="/blog" className="btn btn-primary">
            ← Return to School News
          </Link>
        </div>
      </div>
    );
  }

  // Security standard: sanitize rich-text with DOMPurify
  const sanitizedContent = DOMPurify.sanitize(post.content || '');

  return (
    <div className="container" style={{ padding: '2.5rem 1rem', maxWidth: '860px' }}>
      {/* Breadcrumb Navigation */}
      <nav style={{ display: 'flex', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <Link to="/" style={{ color: 'var(--text-secondary)' }}>Home</Link>
        <span>/</span>
        <Link to="/blog" style={{ color: 'var(--text-secondary)' }}>Blog</Link>
        <span>/</span>
        <Link to={`/blog?category=${encodeURIComponent(post.category || 'News')}`} style={{ color: 'var(--primary-color)', fontWeight: 600 }}>
          {post.category || 'News'}
        </Link>
      </nav>

      <article className="card" style={{ padding: '2.5rem' }}>
        {/* Category & Date Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <span style={{
            backgroundColor: 'var(--primary-color)',
            color: '#ffffff',
            padding: '0.25rem 0.7rem',
            borderRadius: 'var(--border-radius)',
            fontSize: '0.8rem',
            fontWeight: 700,
            textTransform: 'uppercase'
          }}>
            {post.category || 'News'}
          </span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {post.publishedAt || 'Published recently'}
          </span>
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: '2.4rem',
          color: 'var(--text-primary)',
          marginBottom: '1rem',
          lineHeight: 1.25,
          fontWeight: 800
        }}>
          {post.title}
        </h1>

        {/* Author / Metadata info */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.8rem',
          paddingBottom: '1.5rem',
          marginBottom: '1.8rem',
          borderBottom: '1px solid var(--border-color)',
          fontSize: '0.9rem',
          color: 'var(--text-secondary)'
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary-color)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '0.9rem'
          }}>
            {post.author ? post.author[0].toUpperCase() : 'A'}
          </div>
          <div>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
              {post.author || 'Greenwood Administration'}
            </div>
            <div style={{ fontSize: '0.78rem' }}>Greenwood Academy Official Publication</div>
          </div>
        </div>

        {/* High-Resolution Cover Image */}
        {post.coverImageUrl && (
          <div style={{
            marginBottom: '2rem',
            borderRadius: 'var(--border-radius)',
            overflow: 'hidden',
            maxHeight: '440px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.06)'
          }}>
            <img
              src={post.coverImageUrl}
              alt={post.title}
              style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
            />
          </div>
        )}

        {/* Summary Excerpt Quote */}
        {post.summary && (
          <div style={{
            backgroundColor: 'var(--background-color)',
            borderLeft: '4px solid var(--accent-color)',
            padding: '1rem 1.4rem',
            marginBottom: '2rem',
            borderRadius: '0 var(--border-radius) var(--border-radius) 0',
            fontStyle: 'italic',
            fontSize: '1.1rem',
            color: 'var(--text-primary)',
            lineHeight: 1.6
          }}>
            {post.summary}
          </div>
        )}

        {/* Rich-Text Body Sanitized via DOMPurify */}
        <div
          className="rich-text-content"
          style={{
            lineHeight: 1.85,
            fontSize: '1.08rem',
            color: 'var(--text-primary)'
          }}
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />

        {/* Footer Back Link */}
        <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/blog" className="btn btn-outline">
            ← Back to All Articles
          </Link>
          <Link to={`/blog?category=${encodeURIComponent(post.category || 'News')}`} className="btn btn-primary" style={{ fontSize: '0.85rem' }}>
            More {post.category || 'News'} Stories
          </Link>
        </div>
      </article>
    </div>
  );
}
