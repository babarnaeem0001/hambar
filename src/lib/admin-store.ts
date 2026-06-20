import { Article } from '../types';
import { supabase } from './supabase';
import { createClient } from '@supabase/supabase-js';

export interface FormSubmission {
  id: string;
  type: 'contact' | 'booking';
  timestamp: string;
  status: 'new' | 'in_progress' | 'resolved';
  notes?: string;
  // Common fields
  name: string;
  email: string;
  phone?: string;
  companyName?: string;
  // Contact specific
  serviceInterested?: string;
  budgetRange?: string;
  details?: string;
  // Booking specific
  primaryService?: string;
  additionalServices?: string[];
  ndaRequired?: string;
  websiteUrl?: string;
  howHeard?: string;
  meetingDate?: string;
  meetingTimeSlot?: string;
  uploadedFilesCount?: number;
  description?: string;
  address?: string;
}

// In-memory cache
let cachedArticles: Article[] | null = null;
let cachedSubmissions: FormSubmission[] | null = null;
let cachedAdmins: any[] | null = null;

export const adminStore = {
  // --- AUTHENTICATION ---
  async isAuthenticated(): Promise<boolean> {
    if (supabase) {
      const { data: { session } } = await supabase.auth.getSession();
      return !!session;
    }
    return false;
  },
  async login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          return { success: false, error: error.message };
        }
        return { success: true };
      } catch (e: any) {
        return { success: false, error: `Login failed: ${e.message}. Please check if VITE_SUPABASE_URL is valid.` };
      }
    }
    return { success: false, error: 'Database not connected. Please check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.' };
  },
  async logout(): Promise<void> {
    if (supabase) {
      await supabase.auth.signOut();
    }
  },

  // --- ADMIN USERS ---
  async getCurrentAdmin() {
    if (!supabase) return null;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && user.email) {
        let adminData = null;
        try {
          const { data, error } = await supabase.from('admins').select('*').eq('email', user.email).single();
          if (data && !error) {
            adminData = data;
          }
        } catch (_) {}

        if (!adminData) {
          // Check local storage for fallback user's saved data
          const localAdmins = getLocal<any>('bk_admins');
          const found = localAdmins.find((a: any) => a.email?.toLowerCase() === user.email?.toLowerCase());
          if (found) adminData = found;
        }

        if (adminData) {
          // Enforce correct roles
          if (user.email === 'hambar0011@gmail.com') {
            adminData.role = 'Super Admin';
          } else if (user.email === 'babarnaeem808@gmail.com' || user.email === 'hamidsaleem0011@gmail.com') {
            adminData.role = 'Admin';
          }
          return adminData;
        }

        // Ultimate Admin Fallback based on auth email
        const isSuper = user.email === 'hambar0011@gmail.com';
        return {
          id: user.id,
          email: user.email,
          name: user.email === 'hambar0011@gmail.com' ? 'Hambar Saleem' : (user.email === 'babarnaeem808@gmail.com' ? 'Babar Naeem' : (user.email === 'hamidsaleem0011@gmail.com' ? 'Hamid Saleem' : 'Admin')),
          role: isSuper ? 'Super Admin' : 'Admin',
          avatar: ''
        };
      }
    } catch (e) {
      console.error("getCurrentAdmin error:", e);
    }
    return null;
  },

  async getAdmins() {
    if (cachedAdmins) return cachedAdmins;
    let dbAdmins: any[] = [];
    if (supabase) {
      try {
        const { data, error } = await supabase.from('admins').select('*').order('created_at', { ascending: true });
        if (data && !error) {
          dbAdmins = data;
        }
      } catch (e) {
         console.error("Failed to query admins from Supabase:", e);
      }
    }
    
    // Merge with key-value local storage
    const localAdmins = getLocal<any>('bk_admins');
    
    // Merge by Email to ensure no duplicates or cross-ID conflicts
    const mergedMap = new Map<string, any>();
    
    const seedAdmins = [
      { id: 'admin-seed-hambar', name: 'Hambar Saleem', email: 'hambar0011@gmail.com', role: 'Super Admin', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120' },
      { id: 'admin-seed-hamid', name: 'Hamid Saleem', email: 'hamidsaleem0011@gmail.com', role: 'Admin', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120' }
    ];

    // 1. Load seed admins
    seedAdmins.forEach(adm => mergedMap.set(adm.email.toLowerCase(), adm));

    // 2. Load Local admins (local overrides/complements)
    localAdmins.forEach(adm => {
      const key = adm.email?.toLowerCase() || adm.id;
      const existing = mergedMap.get(key);
      if (existing) {
        mergedMap.set(key, { ...existing, ...adm });
      } else {
        mergedMap.set(key, adm);
      }
    });

    // 3. Load DB Admins
    dbAdmins.forEach(adm => {
      const key = adm.email?.toLowerCase() || adm.id;
      const existing = mergedMap.get(key);
      if (existing) {
        mergedMap.set(key, { ...existing, ...adm, id: adm.id || existing.id });
      } else {
        mergedMap.set(key, adm);
      }
    });

    // 4. Ensure current active user is represented with exact matching role
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && user.email) {
        const isSuper = user.email === 'hambar0011@gmail.com';
        const role = isSuper ? 'Super Admin' : 'Admin';
        const key = user.email.toLowerCase();
        const existing = mergedMap.get(key);
        if (existing) {
          existing.role = role;
          if (user.email === 'hambar0011@gmail.com') existing.role = 'Super Admin';
          if (user.email === 'babarnaeem808@gmail.com') existing.role = 'Admin';
        } else {
          mergedMap.set(key, {
            id: user.id,
            email: user.email,
            name: user.email === 'hambar0011@gmail.com' ? 'Hambar Saleem' : (user.email === 'babarnaeem808@gmail.com' ? 'Babar Naeem' : (user.email === 'hamidsaleem0011@gmail.com' ? 'Hamid Saleem' : 'Admin')),
            role: role,
            avatar: ''
          });
        }
      }
    } catch (_) {}

    const deletedIds = getLocal<string>('bk_deleted_admins');
    const deletedEmails = getLocal<string>('bk_deleted_emails');
    const adminsList = Array.from(mergedMap.values()).filter(adm => {
      if (adm.id && deletedIds.includes(adm.id)) return false;
      if (adm.email && deletedEmails.includes(adm.email.toLowerCase())) return false;
      return true;
    });
    cachedAdmins = adminsList;
    return adminsList;
  },

  async addAdmin(admin: { name: string; email: string; role: string; avatar: string; password?: string }) {
    let assignedId = `admin-${Date.now()}`;
    
    if (supabase && admin.password) {
      try {
        const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
        const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
        const secondarySupabase = createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: false } });
        const { data, error: signUpErr } = await secondarySupabase.auth.signUp({
          email: admin.email,
          password: admin.password,
        });
        if (signUpErr) {
          console.error('Sign up warning:', signUpErr.message);
        }
        if (data?.user?.id) {
          assignedId = data.user.id;
        }
      } catch (e: any) {
        console.error('Failed to create login credential:', e.message);
      }
    }

    const newAdmin = { id: assignedId, name: admin.name, email: admin.email, role: admin.role, avatar: admin.avatar };
    
    // Save to local storage first
    const localAdmins = getLocal<any>('bk_admins');
    const filteredLocal = localAdmins.filter((a: any) => a.email?.toLowerCase() !== admin.email.toLowerCase());
    filteredLocal.push(newAdmin);
    saveLocal('bk_admins', filteredLocal);

    // Remove from deleted lists
    const deletedIds = getLocal<string>('bk_deleted_admins');
    const deletedEmails = getLocal<string>('bk_deleted_emails');
    const emailLower = admin.email.toLowerCase();

    const nextDeletedIds = deletedIds.filter(id => id !== assignedId);
    saveLocal('bk_deleted_admins', nextDeletedIds);

    const nextDeletedEmails = deletedEmails.filter(e => e.toLowerCase() !== emailLower);
    saveLocal('bk_deleted_emails', nextDeletedEmails);

    if (supabase) {
      try {
        // Delete any existing first to prevent unique constraints
        await supabase.from('admins').delete().eq('email', admin.email);
        
        const { error } = await supabase.from('admins').insert([newAdmin]);
        if (error) {
          console.warn('Supabase insert failed (RLS), local fallback completed:', error.message);
        }
      } catch (dbErr) {
        console.warn('Supabase insert error:', dbErr);
      }
    }
    cachedAdmins = null;
    return newAdmin;
  },

  async updateAdmin(id: string, updates: { name: string; email: string; role: string; avatar: string; password?: string }) {
    // Save to local storage first
    const localAdmins = getLocal<any>('bk_admins');
    const idx = localAdmins.findIndex((a: any) => a.id === id);
    const updatedAdmin = { id, name: updates.name, email: updates.email, role: updates.role, avatar: updates.avatar };
    if (idx !== -1) {
      localAdmins[idx] = updatedAdmin;
    } else {
      localAdmins.push(updatedAdmin);
    }
    saveLocal('bk_admins', localAdmins);

    if (supabase) {
      if (updates.password) {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user && user.email === updates.email) {
            await supabase.auth.updateUser({ password: updates.password });
          }
        } catch (authErr) {
          console.warn('Auth password update failed:', authErr);
        }
      }
      try {
        const dbUpdates = {
          name: updates.name,
          email: updates.email,
          role: updates.role,
          avatar: updates.avatar,
        };
        const { error } = await supabase.from('admins').upsert(dbUpdates);
        if (error) {
          console.warn('Supabase admin update failed:', error.message);
        }
      } catch (dbErr) {
        console.warn('Supabase update failed:', dbErr);
      }
    }
    cachedAdmins = null;
  },

  async deleteAdmin(id: string) {
    const localAdmins = getLocal<any>('bk_admins');
    const targetAdmin = localAdmins.find((a: any) => a.id === id) || (cachedAdmins ? (cachedAdmins as any[]).find((a: any) => a.id === id) : null);
    
    const filtered = localAdmins.filter((a: any) => a.id !== id && (targetAdmin?.email ? a.email?.toLowerCase() !== targetAdmin.email.toLowerCase() : true));
    saveLocal('bk_admins', filtered);

    const deletedIds = getLocal<string>('bk_deleted_admins');
    if (!deletedIds.includes(id)) {
      deletedIds.push(id);
      saveLocal('bk_deleted_admins', deletedIds);
    }

    if (targetAdmin && targetAdmin.email) {
      const deletedEmails = getLocal<string>('bk_deleted_emails');
      const emailLower = targetAdmin.email.toLowerCase();
      if (!deletedEmails.includes(emailLower)) {
        deletedEmails.push(emailLower);
        saveLocal('bk_deleted_emails', deletedEmails);
      }
    }

    if (supabase) {
      if (targetAdmin && targetAdmin.email) {
        try {
          const { error: emailErr } = await supabase.from('admins').delete().eq('email', targetAdmin.email);
          if (emailErr) console.warn('Supabase admin delete by email failed:', emailErr.message);
        } catch (e) {
          console.warn('Supabase admin delete by email error:', e);
        }
      }
      try {
        const { error: idErr } = await supabase.from('admins').delete().eq('id', id);
        if (idErr) console.warn('Supabase admin delete by id failed:', idErr.message);
      } catch (e) {
        console.warn('Supabase admin delete by id error:', e);
      }
    }
    cachedAdmins = null;
  },

  // --- ANALYTICS / CHART DATA ---
  async getChartData() {
    const subs = await this.getSubmissions();
    const mockDates = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d;
    });
    return mockDates.map((d) => {
      const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const targetSubs = subs.filter(s => {
        const sd = new Date(s.timestamp);
        return sd.getFullYear() === d.getFullYear() && sd.getMonth() === d.getMonth() && sd.getDate() === d.getDate();
      });
      return {
        date: dateStr,
        submissions: targetSubs.length,
        resolved: targetSubs.filter((s:any) => s.status === 'resolved').length
      };
    });
  },

  // --- ARTICLES API ---
  async getArticles(): Promise<Article[]> {
    if (cachedArticles) return cachedArticles;
    
    let dbArticles: any[] = [];
    if (supabase) {
      try {
        const { data, error } = await supabase.from('articles').select('*').order('created_at', { ascending: false });
        if (!error && data) {
          dbArticles = data;
        }
      } catch (e) {
        console.error('Failed to select articles from Supabase:', e);
      }
    }

    // Map DB articles
    const mappedDb = dbArticles.map(dbArt => ({
      ...dbArt,
      author: {
        name: dbArt.author_name || 'Admin',
        role: dbArt.author_role || 'Author',
        avatar: dbArt.author_avatar || ''
      },
      readTime: dbArt.read_time || '5 min read',
      imageUrl: dbArt.image_url || ''
    }));

    // Local Storage fallback articles
    const localArticles = getLocal<Article>('bk_articles');

    // Merge them by id
    const mergedMap = new Map<string, Article>();
    localArticles.forEach(art => mergedMap.set(art.id, { ...art, isLocalOnly: true }));
    mappedDb.forEach(art => mergedMap.set(art.id, { ...art, isLocalOnly: false }));

    const deletedIds = getLocal<string>('bk_deleted_articles');
    deletedIds.forEach(id => mergedMap.delete(id));

    const finalArticles = Array.from(mergedMap.values()).sort((a, b) => {
      return b.id.localeCompare(a.id);
    });

    cachedArticles = finalArticles;
    return finalArticles;
  },

  async saveArticlesLocal(articlesList: Article[]): Promise<void> {
    // No longer supporting local storage mock
  },

  async addArticle(article: Omit<Article, 'id'>): Promise<Article> {
    const newArticle: Article = { ...article, id: `art-${Date.now()}` };
    
    // 1. Save to local storage
    const localArticles = getLocal<Article>('bk_articles');
    localArticles.unshift(newArticle);
    saveLocal('bk_articles', localArticles);

    // 2. Save to Supabase
    if (supabase) {
      try {
        const { error } = await supabase.from('articles').insert([{
          id: newArticle.id,
          title: newArticle.title,
          slug: newArticle.slug,
          category: newArticle.category,
          excerpt: newArticle.excerpt,
          content: newArticle.content,
          author_name: newArticle.author.name,
          author_role: newArticle.author.role,
          author_avatar: newArticle.author.avatar,
          date: newArticle.date,
          read_time: newArticle.readTime,
          tags: newArticle.tags,
          status: newArticle.status || 'draft',
          image_url: newArticle.imageUrl
        }]);
        if (error) {
          console.warn('Supabase articles insert failed. Local fallback used:', error.message);
          (newArticle as any).syncError = error.message;
        }
      } catch (dbErr: any) {
        console.warn('Supabase articles insert exception. Local fallback used:', dbErr);
        (newArticle as any).syncError = dbErr.message || 'Connection or schema error';
      }
    }
    cachedArticles = null;
    window.dispatchEvent(new CustomEvent('admin_articles_updated'));
    return newArticle;
  },

  async updateArticle(article: Article): Promise<void> {
    // 1. Update in local storage
    const localArticles = getLocal<Article>('bk_articles');
    const idx = localArticles.findIndex((art: Article) => art.id === article.id);
    if (idx !== -1) {
      localArticles[idx] = article;
    } else {
      localArticles.unshift(article);
    }
    saveLocal('bk_articles', localArticles);

    // 2. Update to Supabase
    if (supabase) {
      try {
        const { error } = await supabase.from('articles').update({
          title: article.title,
          slug: article.slug,
          category: article.category,
          excerpt: article.excerpt,
          content: article.content,
          author_name: article.author.name,
          author_role: article.author.role,
          author_avatar: article.author.avatar,
          date: article.date,
          read_time: article.readTime,
          tags: article.tags,
          status: article.status || 'draft',
          image_url: article.imageUrl
        }).eq('id', article.id);
        if (error) {
          console.warn('Supabase articles update failed. Local fallback used:', error.message);
          (article as any).syncError = error.message;
        }
      } catch (e: any) {
        console.warn('Supabase articles update exception. Local fallback used:', e);
        (article as any).syncError = e.message || 'Connection or schema error';
      }
    }
    cachedArticles = null;
    window.dispatchEvent(new CustomEvent('admin_articles_updated'));
  },

  async deleteArticle(id: string): Promise<void> {
    // 1. Delete from local storage
    const localArticles = getLocal<Article>('bk_articles');
    const filtered = localArticles.filter((art: Article) => art.id !== id);
    saveLocal('bk_articles', filtered);

    const deletedIds = getLocal<string>('bk_deleted_articles');
    if (!deletedIds.includes(id)) {
      deletedIds.push(id);
      saveLocal('bk_deleted_articles', deletedIds);
    }

    // 2. Delete from Supabase
    if (supabase) {
      try {
        const { error } = await supabase.from('articles').delete().eq('id', id);
        if (error) {
          console.warn('Supabase articles delete failed. Local fallback used:', error.message);
        }
      } catch (e: any) {
        console.warn('Supabase articles delete exception. Local fallback used:', e);
      }
    }
    cachedArticles = null;
    window.dispatchEvent(new CustomEvent('admin_articles_updated'));
  },

  // --- SUBMISSIONS API ---
  async getSubmissions(): Promise<FormSubmission[]> {
    if (cachedSubmissions) return cachedSubmissions;

    let dbSubmissions: any[] = [];
    if (supabase) {
      try {
        const { data, error } = await supabase.from('submissions').select('*').order('created_at', { ascending: false });
        if (!error && data) {
          dbSubmissions = data;
        }
      } catch (e) {
        console.error('Failed to select submissions from Supabase:', e);
      }
    }

    const mappedDb = dbSubmissions.map(dbSub => {
      let desc = dbSub.description || '';
      let details = dbSub.details || '';
      let addressStr = dbSub.address || '';

      const descAddrMatch = desc.match(/^\[Address:\s*([^\]]+)\]\n?/);
      if (descAddrMatch) {
        addressStr = descAddrMatch[1];
        desc = desc.substring(descAddrMatch[0].length);
      } else {
        const detailsAddrMatch = details.match(/^\[Address:\s*([^\]]+)\]\n?/);
        if (detailsAddrMatch) {
          addressStr = detailsAddrMatch[1];
          details = details.substring(detailsAddrMatch[0].length);
        }
      }

      return {
        ...dbSub,
        companyName: dbSub.company_name,
        serviceInterested: dbSub.service_interested,
        budgetRange: dbSub.budget_range,
        primaryService: dbSub.primary_service,
        additionalServices: dbSub.additional_services,
        ndaRequired: dbSub.nda_required,
        websiteUrl: dbSub.website_url,
        howHeard: dbSub.how_heard,
        meetingDate: dbSub.meeting_date,
        meetingTimeSlot: dbSub.meeting_time_slot,
        uploadedFilesCount: dbSub.uploaded_files_count,
        address: addressStr || undefined,
        description: desc,
        details: details
      };
    });

    const localSubmissions = getLocal<FormSubmission>('bk_submissions');

    const mergedMap = new Map<string, FormSubmission>();
    localSubmissions.forEach(sub => mergedMap.set(sub.id, sub));
    mappedDb.forEach(sub => mergedMap.set(sub.id, sub as FormSubmission));

    const deletedIds = getLocal<string>('bk_deleted_subs');
    deletedIds.forEach(id => mergedMap.delete(id));

    const finalSubmissions = Array.from(mergedMap.values()).sort((a, b) => {
      return b.timestamp.localeCompare(a.timestamp);
    });

    cachedSubmissions = finalSubmissions;
    return finalSubmissions;
  },

  async saveSubmissionsLocal(submissionsList: FormSubmission[]): Promise<void> {
    // No longer supporting local storage mock
  },

  async addSubmission(submission: Omit<FormSubmission, 'id' | 'timestamp' | 'status'> & { description?: string }): Promise<FormSubmission> {
    const newSub: FormSubmission = {
      ...submission,
      id: `sub-${Date.now()}`,
      timestamp: new Date().toISOString(),
      status: 'new'
    };

    // 1. Save to local storage
    const localSubmissions = getLocal<FormSubmission>('bk_submissions');
    localSubmissions.unshift(newSub);
    saveLocal('bk_submissions', localSubmissions);

    // 2. Save to Supabase
    if (supabase) {
      try {
        const finalDescription = newSub.address && newSub.type === 'booking'
          ? `[Address: ${newSub.address}]\n${newSub.description || ''}`
          : newSub.description;
        
        const finalDetails = newSub.address && newSub.type === 'contact'
          ? `[Address: ${newSub.address}]\n${newSub.details || ''}`
          : newSub.details;

        const { error } = await supabase.from('submissions').insert([{
          id: newSub.id,
          type: newSub.type,
          timestamp: newSub.timestamp,
          status: newSub.status,
          name: newSub.name,
          email: newSub.email,
          phone: newSub.phone,
          company_name: newSub.companyName,
          service_interested: newSub.serviceInterested,
          budget_range: newSub.budgetRange,
          details: finalDetails,
          primary_service: newSub.primaryService,
          additional_services: newSub.additionalServices,
          nda_required: newSub.ndaRequired,
          website_url: newSub.websiteUrl,
          how_heard: newSub.howHeard,
          meeting_date: newSub.meetingDate,
          meeting_time_slot: newSub.meetingTimeSlot,
          uploaded_files_count: newSub.uploadedFilesCount,
          description: finalDescription,
          notes: newSub.notes
        }]);
        if (error) {
          console.warn('Supabase submissions insert failed (RLS):', error.message);
        }
      } catch (dbErr) {
        console.warn('Supabase submissions insert failed:', dbErr);
      }
    }
    cachedSubmissions = null;
    window.dispatchEvent(new CustomEvent('admin_submissions_updated'));
    return newSub;
  },

  async updateSubmissionStatus(id: string, status: FormSubmission['status'], notes?: string): Promise<void> {
    // 1. Update in local storage
    const localSubmissions = getLocal<FormSubmission>('bk_submissions');
    const idx = localSubmissions.findIndex(sub => sub.id === id);
    if (idx !== -1) {
      localSubmissions[idx].status = status;
      if (notes !== undefined) localSubmissions[idx].notes = notes;
      saveLocal('bk_submissions', localSubmissions);
    }

    // 2. Update in Supabase
    if (supabase) {
      try {
        const updateData: any = { status };
        if (notes !== undefined) updateData.notes = notes;
        const { error } = await supabase.from('submissions').update(updateData).eq('id', id);
        if (error) {
          console.warn('Supabase submissions update failed:', error.message);
        }
      } catch (e) {
        console.warn('Supabase submissions update failed:', e);
      }
    }
    cachedSubmissions = null;
    window.dispatchEvent(new CustomEvent('admin_submissions_updated'));
  },

  async deleteSubmission(id: string): Promise<void> {
    // 1. Delete from local storage
    const localSubmissions = getLocal<FormSubmission>('bk_submissions');
    const filtered = localSubmissions.filter(sub => sub.id !== id);
    saveLocal('bk_submissions', filtered);

    const deletedIds = getLocal<string>('bk_deleted_subs');
    if (!deletedIds.includes(id)) {
      deletedIds.push(id);
      saveLocal('bk_deleted_subs', deletedIds);
    }

    // 2. Delete from Supabase
    if (supabase) {
      try {
        const { error } = await supabase.from('submissions').delete().eq('id', id);
        if (error) {
          console.warn('Supabase submissions delete failed:', error.message);
        }
      } catch (e) {
        console.warn('Supabase submissions delete failed:', e);
      }
    }
    cachedSubmissions = null;
    window.dispatchEvent(new CustomEvent('admin_submissions_updated'));
  },

  async syncOfflineArticles(): Promise<{ successCount: number; errors: string[] }> {
    if (!supabase) return { successCount: 0, errors: ['Supabase client not initialized'] };
    
    const localArticles = getLocal<Article>('bk_articles');
    let successCount = 0;
    const errors: string[] = [];
    
    // Fetch all current database article IDs
    let dbIds = new Set<string>();
    try {
      const { data, error } = await supabase.from('articles').select('id');
      if (!error && data) {
        dbIds = new Set(data.map(d => d.id));
      }
    } catch (e: any) {
      return { successCount: 0, errors: [e.message || 'Failed to fetch existing database article IDs'] };
    }
    
    // Find articles in localArticles that are not in dbIds
    const unsynced = localArticles.filter(art => !dbIds.has(art.id));
    
    for (const article of unsynced) {
      try {
        const { error } = await supabase.from('articles').insert([{
          id: article.id,
          title: article.title,
          slug: article.slug,
          category: article.category,
          excerpt: article.excerpt,
          content: article.content,
          author_name: article.author.name,
          author_role: article.author.role,
          author_avatar: article.author.avatar,
          date: article.date,
          read_time: article.readTime,
          tags: article.tags,
          status: article.status || 'draft',
          image_url: article.imageUrl
        }]);
        if (error) {
          errors.push(`Failed to sync "${article.title}": ${error.message}`);
        } else {
          successCount++;
        }
      } catch (err: any) {
        errors.push(`Error syncing "${article.title}": ${err.message || err}`);
      }
    }
    
    cachedArticles = null;
    window.dispatchEvent(new CustomEvent('admin_articles_updated'));
    return { successCount, errors };
  },

  async pruneOfflineArticles(): Promise<number> {
    let dbIds = new Set<string>();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('articles').select('id');
        if (!error && data) {
          dbIds = new Set(data.map(d => d.id));
        }
      } catch (e) {
        console.error('Failed to fetch existing database article IDs for pruning:', e);
      }
    }
    
    const localArticles = getLocal<Article>('bk_articles');
    
    // Compute list of articles to keep (only if they exist in DB)
    const filtered = localArticles.filter(art => dbIds.has(art.id));
    saveLocal('bk_articles', filtered);
    
    // Filter deleted ids list as well
    const deletedIds = getLocal<string>('bk_deleted_articles');
    const filteredDeleted = deletedIds.filter(id => dbIds.has(id));
    saveLocal('bk_deleted_articles', filteredDeleted);
    
    const countPruned = localArticles.length - filtered.length;
    
    cachedArticles = null;
    window.dispatchEvent(new CustomEvent('admin_articles_updated'));
    return countPruned;
  }
};

// Helper utilities for local storage fallback
function getLocal<T>(key: string): T[] {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : [];
  } catch (e) {
    return [];
  }
}

function saveLocal<T>(key: string, data: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error("Local storage save failed", e);
  }
}


