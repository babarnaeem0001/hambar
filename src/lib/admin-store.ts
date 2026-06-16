import { Article } from '../types';
import { supabase } from './supabase';

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
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    }
    return { success: false, error: 'Database not connected' };
  },
  async logout(): Promise<void> {
    if (supabase) {
      await supabase.auth.signOut();
    }
  },

  // --- ADMIN USERS ---
  async getAdmins() {
    if (cachedAdmins) return cachedAdmins;
    if (supabase) {
      const { data, error } = await supabase.from('admins').select('*').order('created_at', { ascending: true });
      if (!error && data) {
        cachedAdmins = data;
        return data;
      }
    }
    return [];
  },
  async addAdmin(admin: { name: string; email: string; role: string; avatar: string }) {
    const newAdmin = { ...admin, id: `admin-${Date.now()}` };
    if (supabase) {
      await supabase.from('admins').insert([newAdmin]);
      cachedAdmins = null;
      return newAdmin;
    }
    return newAdmin;
  },
  async updateAdmin(id: string, updates: { name: string; email: string; role: string; avatar: string }) {
    if (supabase) {
      await supabase.from('admins').update(updates).eq('id', id);
      cachedAdmins = null;
    }
  },
  async deleteAdmin(id: string) {
    if (supabase) {
      await supabase.from('admins').delete().eq('id', id);
      cachedAdmins = null;
    }
  },

  // --- ANALYTICS / CHART DATA ---
  async getChartData() {
    const subs = await this.getSubmissions();
    const mockDates = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });
    return mockDates.map((date, index) => {
      return {
        date,
        submissions: (index < 6) ? Math.floor(Math.random() * 5) + 1 : subs.length,
        resolved: (index < 6) ? Math.floor(Math.random() * 4) : subs.filter((s:any) => s.status === 'resolved').length
      };
    });
  },

  // --- ARTICLES API ---
  async getArticles(): Promise<Article[]> {
    if (cachedArticles) return cachedArticles;
    
    if (supabase) {
      const { data, error } = await supabase.from('articles').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        // Map snake_case to camelCase
        const mapped = data.map(dbArt => ({
          ...dbArt,
          author: {
            name: dbArt.author_name,
            role: dbArt.author_role,
            avatar: dbArt.author_avatar
          },
          readTime: dbArt.read_time,
          imageUrl: dbArt.image_url
        }));
        cachedArticles = mapped as Article[];
        return cachedArticles;
      }
    }

    return [];
  },

  async saveArticlesLocal(articlesList: Article[]): Promise<void> {
    // No longer supporting local storage mock
  },

  async addArticle(article: Omit<Article, 'id'>): Promise<Article> {
    const newArticle: Article = { ...article, id: `art-${Date.now()}` };
    if (supabase) {
      await supabase.from('articles').insert([{
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
      cachedArticles = null;
      window.dispatchEvent(new CustomEvent('admin_articles_updated'));
      return newArticle;
    }
    return newArticle;
  },

  async updateArticle(article: Article): Promise<void> {
    if (supabase) {
      await supabase.from('articles').update({
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
      cachedArticles = null;
      window.dispatchEvent(new CustomEvent('admin_articles_updated'));
      return;
    }
  },

  async deleteArticle(id: string): Promise<void> {
    if (supabase) {
      await supabase.from('articles').delete().eq('id', id);
      cachedArticles = null;
      window.dispatchEvent(new CustomEvent('admin_articles_updated'));
      return;
    }
  },

  // --- SUBMISSIONS API ---
  async getSubmissions(): Promise<FormSubmission[]> {
    if (cachedSubmissions) return cachedSubmissions;

    if (supabase) {
      const { data, error } = await supabase.from('submissions').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        const mapped = data.map(dbSub => ({
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
          uploadedFilesCount: dbSub.uploaded_files_count
        }));
        cachedSubmissions = mapped as FormSubmission[];
        return cachedSubmissions;
      }
    }

    return [];
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
    if (supabase) {
      await supabase.from('submissions').insert([{
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
        details: newSub.details,
        primary_service: newSub.primaryService,
        additional_services: newSub.additionalServices,
        nda_required: newSub.ndaRequired,
        website_url: newSub.websiteUrl,
        how_heard: newSub.howHeard,
        meeting_date: newSub.meetingDate,
        meeting_time_slot: newSub.meetingTimeSlot,
        uploaded_files_count: newSub.uploadedFilesCount,
        description: newSub.description,
        notes: newSub.notes
      }]);
      cachedSubmissions = null;
      window.dispatchEvent(new CustomEvent('admin_submissions_updated'));
      return newSub;
    }
    return newSub;
  },

  async updateSubmissionStatus(id: string, status: FormSubmission['status'], notes?: string): Promise<void> {
    if (supabase) {
      const updateData: any = { status };
      if (notes !== undefined) updateData.notes = notes;
      await supabase.from('submissions').update(updateData).eq('id', id);
      cachedSubmissions = null;
      window.dispatchEvent(new CustomEvent('admin_submissions_updated'));
      return;
    }
  },

  async deleteSubmission(id: string): Promise<void> {
    if (supabase) {
      await supabase.from('submissions').delete().eq('id', id);
      cachedSubmissions = null;
      window.dispatchEvent(new CustomEvent('admin_submissions_updated'));
      return;
    }
  }
};

