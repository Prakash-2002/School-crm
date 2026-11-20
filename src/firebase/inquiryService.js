import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './config';

const LOCAL_STORAGE_KEY = 'school_visitor_inquiries';

// Fallback initial sample inquiries if newly launched
const initialSampleInquiries = [
  {
    id: 'sample-inq-1',
    type: 'admission',
    studentName: 'Aarav Sharma',
    parentName: 'Rajesh Sharma',
    phone: '+91 98765 12345',
    email: 'rajesh.sharma@example.com',
    grade: 'Class XI - Science',
    comments: 'Looking for integrated coaching for JEE Advanced alongside CBSE Board syllabus.',
    status: 'new', // 'new', 'contacted', 'scheduled', 'enrolled', 'closed'
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    source: 'Website Admission Form'
  },
  {
    id: 'sample-inq-2',
    type: 'admission',
    studentName: 'Ananya Verma',
    parentName: 'Dr. Meenakshi Verma',
    phone: '+91 98111 87654',
    email: 'm.verma@example.com',
    grade: 'Nursery',
    comments: 'Inquiring about school bus transport routes for Rohini Sector 14.',
    status: 'contacted',
    createdAt: new Date(Date.now() - 3600000 * 26).toISOString(),
    source: 'Website Admission Form'
  },
  {
    id: 'sample-inq-3',
    type: 'contact',
    name: 'Vikram Malhotra',
    email: 'vikram.m@gmail.com',
    phone: '+91 97171 22334',
    subject: 'Transfer Certificate (TC) Request',
    message: 'Need expedited TC verification for transfer to Bangalore branch.',
    status: 'scheduled',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    source: 'Contact Page Inquiry'
  }
];

function getLocalInquiries() {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialSampleInquiries));
      return initialSampleInquiries;
    }
    return JSON.parse(data);
  } catch {
    return initialSampleInquiries;
  }
}

function saveLocalInquiries(inquiries) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(inquiries));
  } catch (e) {
    console.error('Failed to save to local storage', e);
  }
}

/**
 * Submit a new visitor inquiry (Admission or Contact form)
 * @param {Object} data 
 * @returns {Promise<Object>}
 */
export async function submitInquiry(data) {
  const inquiryRecord = {
    ...data,
    status: 'new',
    createdAt: new Date().toISOString(),
  };

  // Always save locally so preview/offline mode immediately reflects it
  const localList = getLocalInquiries();
  const newLocalItem = { ...inquiryRecord, id: 'local-' + Date.now() };
  saveLocalInquiries([newLocalItem, ...localList]);

  if (isFirebaseConfigured) {
    try {
      const docRef = await addDoc(collection(db, 'inquiries'), {
        ...inquiryRecord,
        createdAtServer: serverTimestamp(),
      });
      return { id: docRef.id, ...inquiryRecord };
    } catch (err) {
      console.warn('[Firestore] Could not write inquiry to Firestore, stored locally:', err.message);
      return newLocalItem;
    }
  }

  return newLocalItem;
}

/**
 * Fetch all inquiries for the admin portal
 * @returns {Promise<Array>}
 */
export async function fetchInquiries() {
  if (isFirebaseConfigured) {
    try {
      const q = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const cloudInquiries = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        // Update local cache
        saveLocalInquiries(cloudInquiries);
        return cloudInquiries;
      }
    } catch (err) {
      console.warn('[Firestore] Falling back to local inquiries cache:', err.message);
    }
  }

  return getLocalInquiries();
}

/**
 * Update the status or notes of an inquiry
 * @param {string} inquiryId 
 * @param {string} newStatus 
 * @param {string} notes 
 */
export async function updateInquiryStatus(inquiryId, newStatus, notes = '') {
  // Update local list
  const localList = getLocalInquiries();
  const updatedList = localList.map(item => {
    if (item.id === inquiryId) {
      return { 
        ...item, 
        status: newStatus, 
        adminNotes: notes || item.adminNotes || '',
        updatedAt: new Date().toISOString() 
      };
    }
    return item;
  });
  saveLocalInquiries(updatedList);

  if (isFirebaseConfigured && !inquiryId.startsWith('local-') && !inquiryId.startsWith('sample-')) {
    try {
      const docRef = doc(db, 'inquiries', inquiryId);
      await updateDoc(docRef, {
        status: newStatus,
        adminNotes: notes,
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      console.error('[Firestore] Failed to update inquiry status:', err);
    }
  }

  return true;
}

/**
 * Delete an inquiry
 * @param {string} inquiryId 
 */
export async function deleteInquiry(inquiryId) {
  const localList = getLocalInquiries();
  const filtered = localList.filter(item => item.id !== inquiryId);
  saveLocalInquiries(filtered);

  if (isFirebaseConfigured && !inquiryId.startsWith('local-') && !inquiryId.startsWith('sample-')) {
    try {
      const docRef = doc(db, 'inquiries', inquiryId);
      await deleteDoc(docRef);
    } catch (err) {
      console.error('[Firestore] Failed to delete inquiry:', err);
    }
  }

  return true;
}
