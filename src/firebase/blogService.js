import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import DOMPurify from 'dompurify';
import { db, isFirebaseConfigured } from './config';

export const BLOG_CATEGORIES = ['News', 'Events', 'Academics', 'Notices'];

/**
 * Generate a clean kebab-case URL slug from a title string
 * @param {string} title 
 * @returns {string}
 */
export function generateSlug(title) {
  if (!title) return '';
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // remove non-alphanumerics except hyphen and space
    .replace(/\s+/g, '-')      // replace spaces with single hyphen
    .replace(/-+/g, '-')      // replace consecutive hyphens
    .replace(/^-+|-+$/g, '');  // trim leading & trailing hyphens
}

/**
 * Ensure the slug is unique in the blog_posts collection
 * @param {string} baseSlug 
 * @param {string|null} excludeId 
 * @returns {Promise<string>}
 */
export async function getUniqueSlug(baseSlug, excludeId = null) {
  let slug = baseSlug || 'post';
  if (!isFirebaseConfigured) return slug;

  try {
    const postsRef = collection(db, 'blog_posts');
    let candidate = slug;
    let counter = 1;
    let isUnique = false;

    while (!isUnique) {
      const q = query(postsRef, where('slug', '==', candidate));
      const snap = await getDocs(q);

      // Unique if no documents matched or if the only match is the current document
      if (snap.empty || (excludeId && snap.docs.length === 1 && snap.docs[0].id === excludeId)) {
        return candidate;
      }

      counter += 1;
      candidate = `${slug}-${counter}`;
    }

    return candidate;
  } catch (err) {
    console.warn('Error checking unique slug, using base slug with timestamp:', err);
    return `${slug}-${Date.now().toString(36)}`;
  }
}

/**
 * Fetch blog posts with optional filtering
 * @param {Object} options
 * @param {boolean} [options.onlyPublished=false]
 * @param {string} [options.category='']
 * @param {string} [options.search='']
 * @returns {Promise<Array>}
 */
export async function fetchBlogPosts({ onlyPublished = false, category = '', search = '' } = {}) {
  if (!isFirebaseConfigured) {
    return [];
  }

  try {
    const postsRef = collection(db, 'blog_posts');
    let q;

    if (onlyPublished) {
      q = query(postsRef, where('published', '==', true));
    } else {
      q = query(postsRef);
    }

    const snap = await getDocs(q);
    let posts = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    // Filter by category if specified
    if (category && category !== 'All') {
      posts = posts.filter((p) => p.category?.toLowerCase() === category.toLowerCase());
    }

    // Filter by search query in title, summary, or category
    if (search && search.trim()) {
      const term = search.toLowerCase().trim();
      posts = posts.filter((p) => 
        p.title?.toLowerCase().includes(term) ||
        p.summary?.toLowerCase().includes(term) ||
        p.author?.toLowerCase().includes(term) ||
        p.category?.toLowerCase().includes(term)
      );
    }

    // Sort by publishedAt or createdAt descending
    posts.sort((a, b) => {
      const dateA = new Date(a.publishedAt || a.createdAt?.toDate?.() || 0);
      const dateB = new Date(b.publishedAt || b.createdAt?.toDate?.() || 0);
      return dateB - dateA;
    });

    return posts;
  } catch (err) {
    console.error('Error fetching blog posts from Firestore:', err);
    throw err;
  }
}

/**
 * Fetch a single blog post by its slug (or fallback ID)
 * @param {string} slugOrId
 * @param {boolean} [onlyPublished=true]
 * @returns {Promise<Object|null>}
 */
export async function fetchBlogPostBySlug(slugOrId, onlyPublished = true) {
  if (!isFirebaseConfigured || !slugOrId) return null;

  try {
    const postsRef = collection(db, 'blog_posts');

    // 1. Query by unique slug
    const q = query(postsRef, where('slug', '==', slugOrId));
    const snap = await getDocs(q);

    if (!snap.empty) {
      const docSnap = snap.docs[0];
      const data = { id: docSnap.id, ...docSnap.data() };
      if (onlyPublished && !data.published) return null;
      return data;
    }

    // 2. Fallback: try by document ID
    const directDocRef = doc(db, 'blog_posts', slugOrId);
    const directSnap = await getDoc(directDocRef);
    if (directSnap.exists()) {
      const data = { id: directSnap.id, ...directSnap.data() };
      if (onlyPublished && !data.published) return null;
      return data;
    }

    return null;
  } catch (err) {
    console.error('Error fetching blog post by slug:', err);
    throw err;
  }
}

/**
 * Fetch single post by ID (for admin editing)
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
export async function fetchBlogPostById(id) {
  if (!isFirebaseConfigured || !id) return null;
  const docRef = doc(db, 'blog_posts', id);
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    return { id: snap.id, ...snap.data() };
  }
  return null;
}

/**
 * Save new or existing blog post
 * @param {Object} postData
 * @param {string|null} [id=null]
 * @returns {Promise<string>} document ID
 */
export async function saveBlogPost(postData, id = null) {
  if (!isFirebaseConfigured) {
    throw new Error('Firebase is not configured. Add credentials in .env.local to save posts.');
  }

  // Ensure content is sanitized with DOMPurify
  const sanitizedContent = DOMPurify.sanitize(postData.content || '');

  // Calculate clean slug
  const baseSlug = generateSlug(postData.slug || postData.title);
  const uniqueSlug = await getUniqueSlug(baseSlug, id);

  const payload = {
    title: postData.title?.trim() || 'Untitled Post',
    slug: uniqueSlug,
    category: postData.category || 'News',
    summary: postData.summary?.trim() || '',
    content: sanitizedContent,
    coverImageUrl: postData.coverImageUrl || '',
    published: Boolean(postData.published),
    author: postData.author?.trim() || 'Greenwood Administration',
    updatedAt: serverTimestamp(),
  };

  if (!id) {
    // New Post
    payload.createdAt = serverTimestamp();
    payload.publishedAt = postData.published ? new Date().toISOString().split('T')[0] : null;
    const docRef = await addDoc(collection(db, 'blog_posts'), payload);
    return docRef.id;
  } else {
    // Existing Post Update
    if (postData.published && !postData.publishedAt) {
      payload.publishedAt = new Date().toISOString().split('T')[0];
    }
    const docRef = doc(db, 'blog_posts', id);
    await updateDoc(docRef, payload);
    return id;
  }
}

/**
 * Toggle published status of a post
 * @param {string} id
 * @param {boolean} currentStatus
 */
export async function togglePostPublish(id, currentStatus) {
  if (!isFirebaseConfigured) return;
  const docRef = doc(db, 'blog_posts', id);
  const nextStatus = !currentStatus;
  await updateDoc(docRef, {
    published: nextStatus,
    publishedAt: nextStatus ? new Date().toISOString().split('T')[0] : null,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Delete a post from Firestore
 * @param {string} id
 */
export async function deletePost(id) {
  if (!isFirebaseConfigured) return;
  const docRef = doc(db, 'blog_posts', id);
  await deleteDoc(docRef);
}
