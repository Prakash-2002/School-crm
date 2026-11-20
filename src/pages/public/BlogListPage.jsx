import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { fetchBlogPosts, BLOG_CATEGORIES } from '../../firebase/blogService';
import { isFirebaseConfigured } from '../../firebase/config';

// Fallback sample posts matching Maple Grove's real stories
export const samplePublicPosts = [
  {
    id: 'story-1',
    slug: 'little-gardeners-big-discoveries',
    title: 'Little gardeners. Big discoveries.',
    category: 'School life',
    summary: 'Our school garden is becoming an outdoor classroom, one seed and one curious question at a time.',
    content: `<p>Our school garden is becoming an outdoor classroom, one seed and one curious question at a time.</p>
    <p>Students from kindergarten through 5th grade have been planting radishes, snap peas, and autumn wildflowers. Through hands-on cultivation, learners connect with natural science, seasonal cycles, and teamwork.</p>`,
    coverImageUrl: 'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?w=900&auto=format&fit=crop&q=80',
    author: 'Ms. Henderson, Garden Coordinator',
    published: true,
    publishedAt: 'OCTOBER 12, 2026',
  },
  {
    id: 'story-2',
    slug: 'a-new-chapter-in-every-day',
    title: 'A new chapter in every day.',
    category: 'For families',
    summary: 'Our fall reading challenge is here. Find your next favorite book and make a little time for reading together.',
    content: `<p>Our fall reading challenge is here! We invite every family to cozy up with a favorite book this autumn.</p>
    <p>Log your family reading minutes each evening to earn classroom book rewards and badges in our media center.</p>`,
    coverImageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=900&auto=format&fit=crop&q=80',
    author: 'Library Media Team',
    published: true,
    publishedAt: 'OCTOBER 8, 2026',
  },
  {
    id: 'story-3',
    slug: 'colorful-minds-at-work',
    title: 'Colorful minds at work.',
    category: 'In the classroom',
    summary: 'Step inside our art room, where autumn leaves are inspiring creativity, confidence, and a whole lot of color.',
    content: `<p>Step inside our art studio, where vibrant autumn leaves and watercolor washes are bringing student imagination to life.</p>
    <p>Every child explored color theory, leaf textures, and personal expression during this week's art workshop.</p>`,
    coverImageUrl: 'https://images.unsplash.com/photo-1596495577886-d920f1fb7238?w=900&auto=format&fit=crop&q=80',
    author: 'Art Department',
    published: true,
    publishedAt: 'OCTOBER 5, 2026',
  }
];

export default function BlogListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadPublicArticles() {
      setLoading(true);

      if (!isFirebaseConfigured) {
        // Filter sample posts
        let filtered = samplePublicPosts.filter((p) => p.published);
        if (selectedCategory !== 'All') {
          filtered = filtered.filter((p) => p.category?.toLowerCase() === selectedCategory.toLowerCase());
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          filtered = filtered.filter((p) => 
            p.title.toLowerCase().includes(q) || 
            p.summary.toLowerCase().includes(q)
          );
        }
        setPosts(filtered);
        setLoading(false);
        return;
      }

      try {
        const fetched = await fetchBlogPosts({
          onlyPublished: true,
          category: selectedCategory === 'All' ? '' : selectedCategory,
          search: searchQuery,
        });

        if (fetched.length === 0 && !searchQuery && selectedCategory === 'All') {
          setPosts(samplePublicPosts);
        } else {
          setPosts(fetched);
        }
      } catch (err) {
        console.warn('Could not load from Firestore, using offline sample posts:', err);
        setPosts(samplePublicPosts);
      } finally {
        setLoading(false);
      }
    }

    loadPublicArticles();
  }, [selectedCategory, searchQuery]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (category === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1rem' }}>
      {/* Title & Introduction */}
      <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 2.5rem' }}>
        <h1 style={{ fontSize: '2.4rem', color: 'var(--text-primary)', marginBottom: '0.6rem', fontWeight: 800 }}>
          School News & Official Blog
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
          Discover the latest stories, academic milestones, and campus events from Greenwood Academy.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="card" style={{ marginBottom: '2.5rem', padding: '1.2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          
          {/* Search Box */}
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search announcements, events, topics, or faculty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 2.5rem',
                borderRadius: 'var(--border-radius)',
                border: '1px solid var(--border-color)',
                fontSize: '1rem',
                outline: 'none',
                backgroundColor: 'var(--background-color)',
                color: 'var(--text-primary)'
              }}
            />
            <span style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>
              🔍
            </span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '0.9rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)'
                }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginRight: '0.5rem' }}>
              Categories:
            </span>
            {['All', ...BLOG_CATEGORIES].map((category) => {
              const isActive = selectedCategory.toLowerCase() === category.toLowerCase();
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleCategoryChange(category)}
                  className="btn"
                  style={{
                    padding: '0.35rem 0.85rem',
                    fontSize: '0.85rem',
                    borderRadius: 'var(--border-radius)',
                    backgroundColor: isActive ? 'var(--primary-color)' : 'var(--background-color)',
                    color: isActive ? '#ffffff' : 'var(--text-primary)',
                    border: `1px solid ${isActive ? 'var(--primary-color)' : 'var(--border-color)'}`,
                    cursor: 'pointer'
                  }}
                >
                  {category}
                </button>
              );
            })}
          </div>

        </div>
      </div>

      {/* Articles Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-secondary)' }}>
          Loading stories and announcements...
        </div>
      ) : posts.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.8rem' }}>📭</div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.4rem' }}>No published articles found</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
            No articles match the chosen category or search query. Try clearing your filters.
          </p>
          <button
            onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
            className="btn btn-outline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '2rem'
        }}>
          {posts.map((post) => {
            const postSlug = post.slug || post.id;
            return (
              <article
                key={post.id}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: 0,
                  overflow: 'hidden',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                }}
              >
                {/* Cover Image */}
                <Link to={`/blog/${postSlug}`} style={{ display: 'block', overflow: 'hidden' }}>
                  {post.coverImageUrl ? (
                    <img
                      src={post.coverImageUrl}
                      alt={post.title}
                      style={{
                        width: '100%',
                        height: '190px',
                        objectFit: 'cover',
                        display: 'block',
                        transition: 'transform 0.25s ease'
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
                      onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    />
                  ) : (
                    <div style={{
                      width: '100%',
                      height: '190px',
                      backgroundColor: 'var(--background-color)',
                      borderBottom: '1px solid var(--border-color)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '3rem'
                    }}>
                      🏫
                    </div>
                  )}
                </Link>

                {/* Content Box */}
                <div style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span style={{
                      backgroundColor: 'var(--background-color)',
                      color: 'var(--primary-color)',
                      border: '1px solid var(--border-color)',
                      padding: '0.2rem 0.55rem',
                      borderRadius: 'var(--border-radius)',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'uppercase'
                    }}>
                      {post.category || 'News'}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {post.publishedAt || 'Recent'}
                    </span>
                  </div>

                  <h2 style={{ fontSize: '1.25rem', marginBottom: '0.6rem', lineHeight: 1.35 }}>
                    <Link
                      to={`/blog/${postSlug}`}
                      style={{ color: 'var(--text-primary)', textDecoration: 'none' }}
                      onMouseOver={(e) => (e.currentTarget.style.color = 'var(--primary-color)')}
                      onMouseOut={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                    >
                      {post.title}
                    </Link>
                  </h2>

                  <p style={{
                    color: 'var(--text-secondary)',
                    fontSize: '0.9rem',
                    lineHeight: 1.55,
                    marginBottom: '1.2rem',
                    flex: 1
                  }}>
                    {post.summary || (post.content ? post.content.replace(/<[^>]+>/g, '').slice(0, 140) + '...' : '')}
                  </p>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTop: '1px solid var(--border-color)',
                    paddingTop: '0.9rem'
                  }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      By {post.author || 'Administration'}
                    </span>
                    <Link
                      to={`/blog/${postSlug}`}
                      className="btn btn-outline"
                      style={{ fontSize: '0.85rem', padding: '0.35rem 0.75rem' }}
                    >
                      Read Story →
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
