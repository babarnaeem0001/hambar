import React, { useState, useEffect } from 'react';
import { adminStore, FormSubmission } from '../lib/admin-store';
import { Article } from '../types';
import { 
  LayoutDashboard, FileText, MessageSquare, Plus, Save, 
  Trash2, Edit, CheckCircle2, AlertCircle, Clock, Eye, X,
  Search, ArrowUpRight, ListTodo, Archive, RefreshCw, Lock, UserPlus, ChevronDown, BarChart2, Activity, Users, LogOut
} from 'lucide-react';
import { motion } from 'motion/react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-css';
import 'prismjs/themes/prism.css';

export default function AdminView() {
  // Authentication
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | false>(false);

  // Tabs
  const [activeTab, setActiveTab] = useState<'dashboard' | 'submissions' | 'blogs' | 'admins' | 'account'>('dashboard');
  
  // Data
  const [chartType, setChartType] = useState<'area' | 'bar'>('area');
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [newAdminForm, setNewAdminForm] = useState({ name: '', email: '', role: 'Admin', avatar: '', password: '' });
  const [editingAdminId, setEditingAdminId] = useState<string | null>(null);
  const [editingAdminForm, setEditingAdminForm] = useState({ name: '', email: '', role: '', avatar: '' });
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [adminUsers, setAdminUsers] = useState<any[]>([]);
  const [currentAdmin, setCurrentAdmin] = useState<any>(null);
  const [accountForm, setAccountForm] = useState({ name: '', email: '', avatar: '', password: '' });
  
  // CRM Filters
  const [crmTypeFilter, setCrmTypeFilter] = useState<'all' | 'contact' | 'booking'>('all');
  const [crmStatusFilter, setCrmStatusFilter] = useState<'all' | 'new' | 'in_progress' | 'resolved'>('all');
  const [crmSearch, setCrmSearch] = useState('');
  const [selectedSub, setSelectedSub] = useState<FormSubmission | null>(null);
  const [subNotes, setSubNotes] = useState('');
  
  // Blog Editor
  const [isEditingBlog, setIsEditingBlog] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [blogForm, setBlogForm] = useState({
    title: '', slug: '', category: 'AI Automation', excerpt: '', content: '', imageUrl: '',
    authorName: 'Admin', authorRole: 'Content Manager', authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120',
    tags: '', readTime: '5 min read'
  });
  const [showPreview, setShowPreview] = useState(true);
  
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{
    title: string;
    message?: string;
    onConfirm: () => void;
    confirmText?: string;
    isDanger?: boolean;
  } | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    adminStore.isAuthenticated().then(setIsAuthenticated);
  }, []);

  const loadData = async () => {
    try {
      const [subs, arts, charts, admins, currAdmin] = await Promise.all([
        adminStore.getSubmissions().catch(err => { console.error("getSubmissions error:", err); return []; }),
        adminStore.getArticles().catch(err => { console.error("getArticles error:", err); return []; }),
        adminStore.getChartData().catch(err => { console.error("getChartData error:", err); return []; }),
        adminStore.getAdmins().catch(err => { console.error("getAdmins error:", err); return []; }),
        adminStore.getCurrentAdmin().catch(err => { console.error("getCurrentAdmin error:", err); return null; })
      ]);
      setSubmissions(subs || []);
      setArticles(arts || []);
      setChartData(charts || []);
      setAdminUsers(admins || []);
      setCurrentAdmin(currAdmin);
      if (currAdmin) {
        setAccountForm(prev => ({ ...prev, name: currAdmin.name || '', email: currAdmin.email || '', avatar: currAdmin.avatar || '' }));
      }
    } catch (e: any) {
      console.error("Critical error in loadData:", e);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    loadData();
    const handleUpd = () => { loadData(); };
    window.addEventListener('admin_submissions_updated', handleUpd);
    window.addEventListener('admin_articles_updated', handleUpd);
    return () => {
      window.removeEventListener('admin_submissions_updated', handleUpd);
      window.removeEventListener('admin_articles_updated', handleUpd);
    };
  }, [isAuthenticated]);

  const triggerToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await adminStore.login(email, password);
    if (result.success) {
      setIsAuthenticated(true);
      setLoginError(false);
    } else {
      setLoginError(result.error || 'Invalid credentials');
    }
  };

  const handleLogout = async () => {
    await adminStore.logout();
    setIsAuthenticated(false);
    setEmail('');
    setPassword('');
    setShowLogoutConfirm(false);
  };

  // Status Colors for Badge UI (Neutral / Brand theme)
  const getSubStatusBadge = (status: FormSubmission['status']) => {
    switch (status) {
      case 'new':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold leading-none text-neutral-900 bg-neutral-100 rounded border border-neutral-200 uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 animate-pulse"></span>
            New
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold leading-none text-neutral-600 bg-neutral-50 rounded border border-neutral-200 uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-500"></span>
            Review
          </span>
        );
      case 'resolved':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold leading-none text-brand bg-brand/10 rounded border border-brand/20 uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-brand"></span>
            Resolved
          </span>
        );
      default:
        return null;
    }
  };

  // Handlers
  const handleOpenSub = (sub: FormSubmission) => { setSelectedSub(sub); setSubNotes(sub.notes || ''); };
  const handleUpdateStatus = (id: string, status: FormSubmission['status']) => {
    setSelectedSub(prev => prev ? { ...prev, status, notes: subNotes } : null);
    const readableStatus = status === 'in_progress' ? 'Reviewing' : status === 'resolved' ? 'Resolved' : status;
    triggerToast(`Status changed to ${readableStatus}`);
    adminStore.updateSubmissionStatus(id, status, subNotes).then(() => {
      loadData();
    }).catch(err => {
      console.error("Failed to update status on server:", err);
      triggerToast("System updated locally, live sync failed", "error");
    });
  };
  const handleSaveNotes = () => { 
    if (selectedSub) { 
      setSelectedSub(prev => prev ? { ...prev, notes: subNotes } : null);
      triggerToast('Notes saved.'); 
      adminStore.updateSubmissionStatus(selectedSub.id, selectedSub.status, subNotes).then(() => {
        loadData();
      }).catch(err => {
        console.error("Failed to save notes on server:", err);
        triggerToast("System updated locally, live sync failed", "error");
      });
    }
  };
  const handleDeleteSub = async (id: string) => { 
    setConfirmModal({
      title: 'Delete Submission?',
      message: '',
      confirmText: 'Delete',
      isDanger: false,
      onConfirm: async () => {
        setConfirmModal(null);
        await adminStore.deleteSubmission(id);
        setSelectedSub(null);
        triggerToast('Deleted.');
        loadData();
      }
    });
  };

  const startCreateBlog = () => { 
    setEditingBlogId(null); 
    const isSuper = currentAdmin?.email === 'hambar0011@gmail.com' || currentAdmin?.role === 'Super Admin';
    const defaultAuthor = isSuper 
      ? (adminUsers.find(u => u.email !== 'hambar0011@gmail.com') || currentAdmin) 
      : currentAdmin;
    setBlogForm({
      ...blogForm, 
      title:'', slug:'', excerpt:'', content:'', imageUrl:'', 
      authorName: defaultAuthor?.name || '', 
      authorRole: defaultAuthor?.role || 'Author', 
      authorAvatar: defaultAuthor?.avatar || ''
    }); 
    setIsEditingBlog(true); 
  };
  const startEditBlog = (art: Article) => {
    setEditingBlogId(art.id);
    setBlogForm({
      title: art.title, slug: art.slug, category: art.category, excerpt: art.excerpt, content: art.content, imageUrl: art.imageUrl || '',
      authorName: art.author.name, authorRole: art.author.role, authorAvatar: art.author.avatar,
      tags: art.tags.join(', '), readTime: art.readTime
    });
    setIsEditingBlog(true);
  };
  const saveBlog = async (e: React.FormEvent, status: 'published' | 'draft' = 'published') => {
    e.preventDefault();
    if (!blogForm.title || !blogForm.slug || !blogForm.content) return triggerToast('Missing fields', 'error');
    
    const isSuper = currentAdmin?.email === 'hambar0011@gmail.com' || currentAdmin?.role === 'Super Admin';
    const existingArt = editingBlogId ? articles.find(a => a.id === editingBlogId) : null;
    
    if (existingArt) {
      const isOwner = existingArt.authorEmail?.toLowerCase() === currentAdmin?.email?.toLowerCase() || (!existingArt.authorEmail && existingArt.author?.name === currentAdmin?.name);
      if (!isSuper && !isOwner) {
        return triggerToast('You are not authorized to edit this article.', 'error');
      }
    }

    let authorEmail = currentAdmin?.email;
    if (existingArt) {
      if (isSuper) {
        const matched = adminUsers.find(u => u.name === blogForm.authorName);
        authorEmail = matched?.email || existingArt.authorEmail || currentAdmin?.email;
      } else {
        authorEmail = existingArt.authorEmail || currentAdmin?.email;
      }
    } else {
      if (isSuper) {
        const matched = adminUsers.find(u => u.name === blogForm.authorName);
        authorEmail = matched?.email || currentAdmin?.email;
      } else {
        authorEmail = currentAdmin?.email;
      }
    }

    const slugForm = blogForm.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const payload: Article = {
      id: editingBlogId || `art-${Date.now()}`,
      title: blogForm.title, slug: slugForm, category: blogForm.category, excerpt: blogForm.excerpt, content: blogForm.content, imageUrl: blogForm.imageUrl,
      author: { name: blogForm.authorName, role: blogForm.authorRole, avatar: blogForm.authorAvatar },
      authorEmail,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      readTime: blogForm.readTime, tags: blogForm.tags.split(',').map(t=>t.trim()).filter(Boolean),
      status
    };

    const performSave = async () => {
      try {
        if (editingBlogId) await adminStore.updateArticle(payload); else await adminStore.addArticle(payload);
        triggerToast(editingBlogId ? 'Updated!' : (status === 'draft' ? 'Saved as Draft' : 'Published!'));
        setIsEditingBlog(false);
        loadData();
      } catch (err: any) {
        triggerToast(err.message || 'Failed to save article', 'error');
      }
    };

    if (status === 'published') {
      setConfirmModal({
        title: editingBlogId ? 'Publish Changes?' : 'Publish Article?',
        message: '',
        confirmText: 'Publish Now',
        isDanger: false,
        onConfirm: () => {
          setConfirmModal(null);
          performSave();
        }
      });
    } else {
      performSave();
    }
  };
  const deleteBlog = async (id: string) => { 
    const art = articles.find(a => a.id === id);
    if (art) {
      const isSuper = currentAdmin?.email === 'hambar0011@gmail.com' || currentAdmin?.role === 'Super Admin';
      const isOwner = art.authorEmail?.toLowerCase() === currentAdmin?.email?.toLowerCase() || (!art.authorEmail && art.author?.name === currentAdmin?.name);
      if (!isSuper && !isOwner) {
        triggerToast('You are not authorized to delete this article.', 'error');
        return;
      }
    }
    setConfirmModal({
      title: 'Delete Article?',
      message: '',
      confirmText: 'Delete',
      isDanger: false,
      onConfirm: async () => {
        setConfirmModal(null);
        await adminStore.deleteArticle(id); 
        triggerToast('Deleted.'); 
        loadData();
      }
    });
  };


  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>, isNew: boolean) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        triggerToast('Image too large (max 2MB)', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (isNew) {
          setNewAdminForm({ ...newAdminForm, avatar: ev.target?.result as string });
        } else {
          setEditingAdminForm({ ...editingAdminForm, avatar: ev.target?.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminForm.name || !newAdminForm.email || !newAdminForm.password) {
      triggerToast('Full Name, Email, and Initial Password are required.', 'error');
      return;
    }
    try {
      await adminStore.addAdmin({ ...newAdminForm, role: 'Admin' });
      triggerToast('New admin added');
      setNewAdminForm({ ...newAdminForm, name: '', email: '', password: '', avatar: '' });
      loadData();
    } catch (err: any) {
      triggerToast(err.message || 'Failed to add admin', 'error');
    }
  };

  const handleUpdateAdmin = async (id: string) => {
    if (!editingAdminForm.name || !editingAdminForm.email) return;
    await adminStore.updateAdmin(id, editingAdminForm);
    setEditingAdminId(null);
    triggerToast('Admin updated');
    loadData();
  };

  const handleDeleteAdmin = async (id: string) => {
    setConfirmModal({
      title: 'Delete Admin Access?',
      message: '',
      confirmText: 'Remove',
      isDanger: false,
      onConfirm: async () => {
        setConfirmModal(null);
        await adminStore.deleteAdmin(id);
        triggerToast('Admin deleted');
        loadData();
      }
    });
  };

  const downloadCSV = (filterType: 'all' | 'contact' | 'booking' | 'today') => {
    let toExport = filteredSubs;
    if (filterType === 'contact') toExport = filteredSubs.filter(s => s.type === 'contact');
    if (filterType === 'booking') toExport = filteredSubs.filter(s => s.type === 'booking');
    if (filterType === 'today') {
      const today = new Date().toDateString();
      toExport = filteredSubs.filter(s => new Date(s.timestamp).toDateString() === today);
    }
    const headers = ['Client', 'Email', 'Type', 'Date', 'Status', 'Phone', 'Company', 'Details'];
    const rows = toExport.map(sub => [
      sub.name, sub.email, sub.type, new Date(sub.timestamp).toLocaleDateString(), sub.status,
      sub.phone || '', sub.companyName || '', (sub.details || '').replace(/\n/g, ' ')
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `submissions_${filterType}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    setShowDownloadMenu(false);
  };

  const filteredSubs = submissions.filter(s => {
    return (crmTypeFilter === 'all' || s.type === crmTypeFilter) &&
           (crmStatusFilter === 'all' || s.status === crmStatusFilter) &&
           (!crmSearch || s.name.toLowerCase().includes(crmSearch.toLowerCase()) || (s.email && s.email.toLowerCase().includes(crmSearch.toLowerCase())));
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-6 text-neutral-900 font-sans">
        <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-neutral-200 p-8">
          <h2 className="text-2xl font-bold text-center mb-6 tracking-tight">Admin Panel</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input 
                type="email" 
                placeholder="Email address"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 mb-4 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand"
              />
              <input 
                type="password" 
                placeholder="Password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand"
              />
              {loginError && <p className="text-rose-500 text-xs mt-2 font-medium">{loginError}</p>}
            </div>
            <button type="submit" className="w-full bg-neutral-900 hover:bg-black text-white font-medium py-3 rounded-lg text-sm transition-colors">
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-50 min-h-screen text-neutral-900 font-sans flex relative max-w-[100vw]">
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 text-center space-y-6">
            <h3 className="text-xl font-bold tracking-tight text-neutral-900">Sign Out?</h3>
            <div className="flex gap-3 pt-2">
              <button 
                type="button"
                onClick={() => setShowLogoutConfirm(false)} 
                className="flex-1 px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-sm font-bold rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={handleLogout} 
                className="flex-1 px-4 py-2.5 bg-neutral-900 hover:bg-black text-white text-sm font-bold rounded-lg transition-colors shadow-md shadow-neutral-900/20"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 text-center space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-bold tracking-tight text-neutral-900">{confirmModal.title}</h3>
              {confirmModal.message ? (
                <p className="text-xs text-neutral-500 leading-relaxed">{confirmModal.message}</p>
              ) : null}
            </div>
            <div className="flex gap-3 pt-2">
              <button 
                type="button"
                onClick={() => setConfirmModal(null)} 
                className="flex-1 px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={confirmModal.onConfirm} 
                className={`flex-1 px-4 py-2.5 text-white text-xs font-bold rounded-lg transition-colors shadow-md ${
                  confirmModal.isDanger 
                    ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20' 
                    : 'bg-neutral-900 hover:bg-black shadow-neutral-900/20'
                }`}
              >
                {confirmModal.confirmText || 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 z-[9999] flex items-center gap-2.5 px-5 py-3.5 bg-neutral-900 text-white rounded-lg shadow-xl animate-fade-in">
          {toast.type === 'success' ? <CheckCircle2 size={16} className="text-neutral-400" /> : <AlertCircle size={16} className="text-rose-400" />}
          <span className="text-xs font-medium tracking-wide">{toast.message}</span>
        </div>
      )}

      {/* Sticky Left Nav Column */}
      <div className="w-20 md:w-24 shrink-0 border-r border-neutral-200 bg-white/50 backdrop-blur min-h-screen hidden sm:block relative z-40">
        <div className="sticky top-24 w-full flex flex-col items-center py-6 gap-6">
          <div className="flex flex-col gap-3">
            {[
              { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard },
              { id: 'submissions', label: 'Form Submission', icon: MessageSquare },
              { id: 'blogs', label: 'Digital Magazine', icon: FileText },
              { id: 'account', label: 'Account Overview', icon: Users },
              ...((currentAdmin?.email === 'hambar0011@gmail.com' || currentAdmin?.role === 'Super Admin') ? [{ id: 'admins', label: 'Manage Admins', icon: UserPlus }] : [])
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id as any); setIsEditingBlog(false); }}
                className={`relative items-center justify-center w-11 h-11 md:w-12 md:h-12 rounded-full transition-all group flex mx-auto ${
                  activeTab === tab.id ? 'bg-neutral-900 text-white shadow-md' : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 bg-white border border-neutral-200'
                }`}
              >
                <tab.icon size={18} />
                <span className="absolute left-full ml-4 opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-900 text-white text-[10px] font-bold px-2 py-1 rounded whitespace-nowrap z-50 pointer-events-none">
                  {tab.label}
                </span>
              </button>
            ))}
          </div>
          <div className="w-8 h-px bg-neutral-200" />
          <button 
            onClick={() => setShowLogoutConfirm(true)} 
            className="relative items-center justify-center w-11 h-11 md:w-12 md:h-12 rounded-full text-neutral-400 hover:text-rose-600 transition-colors bg-white border border-neutral-200 hover:bg-rose-50 hover:border-rose-100 flex mx-auto group shadow-sm"
          >
            <LogOut size={18} />
            <span className="absolute left-full ml-4 opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-900 text-white text-[10px] font-bold px-2 py-1 rounded whitespace-nowrap z-50 pointer-events-none">
              Sign Out
            </span>
          </button>
        </div>
      </div>

      {/* Main Admin Contents Layout */}
      <div className="flex-1 w-full px-4 sm:px-8 lg:px-12 py-12 max-w-7xl mx-auto min-w-0">

        {/* TAB 1: COMMAND CENTER */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fade-in" id="admin-dashboard-tab">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <h2 className="text-lg font-bold tracking-tight">Overview</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Active Inquiries', val: submissions.length, icon: MessageSquare },
                { label: 'Published Articles', val: (() => {
                  const isSuper = currentAdmin?.email === 'hambar0011@gmail.com' || currentAdmin?.role === 'Super Admin';
                  return articles.filter(art => {
                    if (isSuper) return true;
                    if (!currentAdmin) return false;
                    const isAuthorEmailMatch = art.authorEmail?.toLowerCase() === currentAdmin.email.toLowerCase();
                    const isAuthorNameMatch = !art.authorEmail && art.author?.name === currentAdmin.name;
                    return isAuthorEmailMatch || isAuthorNameMatch;
                  }).length;
                })(), icon: FileText },
                { label: 'Resolution Rate', val: submissions.length ? `${Math.round((submissions.filter(s=>s.status==='resolved').length/submissions.length)*100)}%` : '100%', icon: CheckCircle2 }
              ].map((stat, i) => (
                <div key={i} className="p-6 bg-white rounded-xl border border-neutral-200 flex items-center justify-between shadow-sm">
                  <div>
                    <span className="text-xs font-medium text-neutral-500">{stat.label}</span>
                    <p className="text-3xl font-bold mt-1 text-neutral-900">{stat.val}</p>
                  </div>
                  <div className="text-neutral-400 bg-neutral-50 p-3 rounded-lg"><stat.icon size={20} /></div>
                </div>
              ))}
            </div>

            {/* Recharts Analytics Area */}
            <div className="bg-white p-6 border border-neutral-200 rounded-xl shadow-sm h-80">
              <div className="flex gap-2 items-center justify-between">
                <h3 className="text-sm font-bold tracking-tight">Recent Submissions Flow</h3>
                <div className="flex bg-neutral-100 rounded p-1">
                  <button onClick={() => setChartType('area')} className={`p-1.5 rounded text-neutral-500 hover:text-neutral-900 ${chartType === 'area' ? 'bg-white shadow' : ''}`}><Activity size={12} /></button>
                  <button onClick={() => setChartType('bar')} className={`p-1.5 rounded text-neutral-500 hover:text-neutral-900 ${chartType === 'bar' ? 'bg-white shadow' : ''}`}><BarChart2 size={12} /></button>
                </div>
              </div>
              <div className="mt-4 h-full">
                <ResponsiveContainer width="100%" height="85%">
                  {chartType === 'area' ? (
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorSubs" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#171717" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#171717" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#737373' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#737373' }} />
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5" />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E5E5E5', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Area type="monotone" dataKey="submissions" stroke="#171717" strokeWidth={2} fillOpacity={1} fill="url(#colorSubs)" />
                    </AreaChart>
                  ) : (
                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#737373' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#737373' }} />
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5" />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E5E5E5', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} cursor={{fill: '#F5F5F5'}} />
                      <Bar dataKey="submissions" fill="#171717" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FORM SUBMISSIONS */}
        {activeTab === 'submissions' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-between glass-panel p-4 bg-white border border-neutral-200 rounded-xl shadow-sm">
              <div className="relative w-full max-w-xs">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input 
                  type="text" value={crmSearch} onChange={e => setCrmSearch(e.target.value)} 
                  placeholder="Search entries..." className="w-full pl-9 pr-4 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg outline-none"
                />
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <button onClick={() => setShowDownloadMenu(!showDownloadMenu)} className="px-4 py-2 bg-white border border-neutral-200 text-neutral-900 text-xs font-medium rounded-lg hover:bg-neutral-50 flex items-center gap-2">
                    <Archive size={14} /> Download CSV <ChevronDown size={14} />
                  </button>
                  {showDownloadMenu && (
                    <div className="absolute top-full z-50 mt-1 w-48 bg-white border border-neutral-200 rounded-lg shadow-lg flex flex-col text-xs font-medium py-1">
                      <button onClick={() => downloadCSV('all')} className="text-left px-4 py-2 hover:bg-neutral-50">All Forms</button>
                      <button onClick={() => downloadCSV('contact')} className="text-left px-4 py-2 hover:bg-neutral-50">Contact Forms Only</button>
                      <button onClick={() => downloadCSV('booking')} className="text-left px-4 py-2 hover:bg-neutral-50">Booking Forms Only</button>
                      <button onClick={() => downloadCSV('today')} className="text-left px-4 py-2 hover:bg-neutral-50">Received Today</button>
                    </div>
                  )}
                </div>
                <select value={crmTypeFilter} onChange={e => setCrmTypeFilter(e.target.value as any)} className="bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-xs outline-none cursor-pointer">
                  <option value="all">All Types</option><option value="contact">Contact</option><option value="booking">Booking</option>
                </select>
                <select value={crmStatusFilter} onChange={e => setCrmStatusFilter(e.target.value as any)} className="bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-xs outline-none cursor-pointer">
                  <option value="all">All Status</option><option value="new">New</option><option value="in_progress">Reviewing</option><option value="resolved">Resolved</option>
                </select>
              </div>
            </div>

            <div className="bg-white border text-sm font-sans border-neutral-200 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-neutral-50 text-xs text-neutral-500 uppercase font-medium">
                  <tr>
                    <th className="px-6 py-4">Client</th><th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Date</th><th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 text-xs">
                  {filteredSubs.map(sub => (
                    <tr key={sub.id} className="hover:bg-neutral-50 cursor-pointer" onClick={() => handleOpenSub(sub)}>
                      <td className="px-6 py-4"><span className="font-bold text-neutral-900 block">{sub.name}</span><span className="text-neutral-500">{sub.email}</span></td>
                      <td className="px-6 py-4"><span className="uppercase text-[10px] font-bold bg-neutral-100 px-2 py-1 rounded">{sub.type}</span></td>
                      <td className="px-6 py-4 text-neutral-500">{new Date(sub.timestamp).toLocaleDateString()}</td>
                      <td className="px-6 py-4">{getSubStatusBadge(sub.status)}</td>
                      <td className="px-6 py-4 text-right" onClick={e=>e.stopPropagation()}>
                        <button onClick={()=>handleOpenSub(sub)} className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded"><Eye size={14}/></button>
                        <button onClick={()=>handleDeleteSub(sub.id)} className="p-1.5 text-neutral-400 hover:text-rose-600 rounded"><Trash2 size={14}/></button>
                      </td>
                    </tr>
                  ))}
                  {!filteredSubs.length && <tr><td colSpan={5} className="py-12 text-center text-neutral-500">No records found.</td></tr>}
                </tbody>
              </table>
            </div>

            {selectedSub && (
              <div className="fixed inset-0 z-50 flex justify-end bg-neutral-900/40 backdrop-blur-sm">
                <div className="absolute inset-0" onClick={() => setSelectedSub(null)} />
                <div className="relative w-full max-w-lg bg-white h-full shadow-2xl z-10 flex flex-col p-8 overflow-y-auto animate-slide-in">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-2xl font-bold tracking-tight">{selectedSub.name}</h2>
                    </div>
                    <button onClick={() => setSelectedSub(null)} className="p-2 bg-neutral-100 hover:bg-neutral-200 rounded-full cursor-pointer"><X size={14} /></button>
                  </div>
                  
                  {/* Common Contact Details Grid */}
                  <div className="grid grid-cols-2 gap-4 text-xs font-sans mb-6">
                    <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                      <span className="text-neutral-500 mb-1 block">Form Type</span>
                      <span className="font-bold uppercase tracking-wider text-[10px] bg-neutral-200 px-2 py-0.5 rounded text-neutral-850">
                        {selectedSub.type}
                      </span>
                    </div>
                    <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                      <span className="text-neutral-500 mb-1 block">Received At</span>
                      <span className="font-bold">{new Date(selectedSub.timestamp).toLocaleString()}</span>
                    </div>
                    <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                      <span className="text-neutral-500 mb-1 block">Email</span>
                      <span className="font-bold break-all">{selectedSub.email}</span>
                    </div>
                    <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                      <span className="text-neutral-500 mb-1 block">Phone</span>
                      <span className="font-bold">{selectedSub.phone || 'N/A'}</span>
                    </div>
                    <div className="col-span-2 p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                      <span className="text-neutral-500 mb-1 block">Company / Brand</span>
                      <span className="font-bold">{selectedSub.companyName || 'N/A'}</span>
                    </div>
                  </div>

                  {/* Booking Specific Information / Call Info */}
                  {selectedSub.type === 'booking' && (
                    <div className="mb-6 space-y-4">
                      <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest border-b border-neutral-100 pb-2">
                        Meeting & Call Information
                      </h4>
                      <div className="grid grid-cols-2 gap-4 text-xs font-sans">
                        <div className="p-3 bg-brand/5 rounded-xl border border-brand/10">
                          <span className="text-neutral-500 mb-1 block font-medium">Scheduled Date</span>
                          <span className="font-bold text-neutral-900">{selectedSub.meetingDate || 'Not Scheduled'}</span>
                        </div>
                        <div className="p-3 bg-brand/5 rounded-xl border border-brand/10">
                          <span className="text-neutral-500 mb-1 block font-medium">Time Slot</span>
                          <span className="font-bold text-neutral-900">{selectedSub.meetingTimeSlot || 'Not Scheduled'}</span>
                        </div>
                        <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                          <span className="text-neutral-500 mb-1 block font-medium">Primary Service</span>
                          <span className="font-bold text-neutral-900">{selectedSub.primaryService || 'N/A'}</span>
                        </div>
                        <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                          <span className="text-neutral-500 mb-1 block font-medium">Mutual NDA Status</span>
                          <span className="font-bold text-neutral-900">{selectedSub.ndaRequired === 'yes' ? 'Yes (NDA Requested)' : 'No NDA Needed'}</span>
                        </div>
                        {selectedSub.address && (
                          <div className="col-span-2 p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                            <span className="text-neutral-500 mb-1 block font-medium">Operational/Postal Address</span>
                            <span className="font-bold text-neutral-900">{selectedSub.address}</span>
                          </div>
                        )}
                        <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                          <span className="text-neutral-500 mb-1 block font-medium">Website / URL</span>
                          {selectedSub.websiteUrl ? (
                            <a 
                              href={selectedSub.websiteUrl.startsWith('http') ? selectedSub.websiteUrl : `https://${selectedSub.websiteUrl}`} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="font-bold text-neutral-900 hover:text-brand underline decoration-brand break-all"
                            >
                              {selectedSub.websiteUrl}
                            </a>
                          ) : (
                            <span className="font-bold text-neutral-400">N/A</span>
                          )}
                        </div>
                        <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                          <span className="text-neutral-500 mb-1 block font-medium">Files Uploaded</span>
                          <span className="font-bold text-neutral-900">{selectedSub.uploadedFilesCount ? `${selectedSub.uploadedFilesCount} file(s)` : 'None'}</span>
                        </div>
                        <div className="col-span-2 p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                          <span className="text-neutral-500 mb-1 block font-medium">How they heard about us</span>
                          <span className="font-bold text-neutral-900">{selectedSub.howHeard || 'N/A'}</span>
                        </div>
                        {selectedSub.additionalServices && selectedSub.additionalServices.length > 0 && (
                          <div className="col-span-2 p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                            <span className="text-neutral-500 mb-2 block font-medium">Additional Services Interested</span>
                            <div className="flex flex-wrap gap-1.5">
                              {selectedSub.additionalServices.map((as, idx) => (
                                <span key={idx} className="bg-neutral-200 text-neutral-800 text-[10px] font-bold px-2 py-0.5 rounded">
                                  {as}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Contact Specific Details */}
                  {selectedSub.type === 'contact' && (
                    <div className="mb-6 space-y-4">
                      <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest border-b border-neutral-100 pb-2">
                        Inquiry Details
                      </h4>
                      <div className="grid grid-cols-2 gap-4 text-xs font-sans">
                        <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100 col-span-2">
                          <span className="text-neutral-500 mb-1 block font-medium">Service Interested</span>
                          <span className="font-bold text-neutral-900">{selectedSub.serviceInterested || 'N/A'}</span>
                        </div>
                        <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100 col-span-2">
                          <span className="text-neutral-500 mb-1 block font-medium font-sans">Budget Range</span>
                          <span className="font-bold text-neutral-900">{selectedSub.budgetRange || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-100 text-sm leading-relaxed whitespace-pre-wrap mb-6 text-neutral-850">
                    <span className="text-xs text-neutral-500 font-bold uppercase block mb-2">Details / Remarks</span>
                    {selectedSub.details || (selectedSub as any).description || 'No additional details provided.'}
                  </div>

                  <div className="mt-auto space-y-4 pt-6 border-t border-neutral-100">
                    <div>
                      <label className="text-xs font-bold text-neutral-500 block mb-2">Admin Notes</label>
                      <textarea value={subNotes} onChange={e=>setSubNotes(e.target.value)} rows={3} className="w-full text-xs p-3 bg-neutral-50 border border-neutral-200 rounded-lg outline-none focus:border-neutral-900" />
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex gap-2">
                        <button 
                          type="button" 
                          onClick={() => setConfirmModal({
                            title: 'Mark as Reviewing?',
                            message: '',
                            confirmText: 'Confirm',
                            isDanger: false,
                            onConfirm: () => {
                              setConfirmModal(null);
                              handleUpdateStatus(selectedSub.id, 'in_progress');
                            }
                          })} 
                          className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-850 font-bold rounded-lg cursor-pointer transition-all duration-200 select-none animate-fade-in"
                        >
                          Mark Reviewing
                        </button>
                        <button 
                          type="button" 
                          onClick={() => setConfirmModal({
                            title: 'Resolve this Entry?',
                            message: '',
                            confirmText: 'Resolve',
                            isDanger: false,
                            onConfirm: () => {
                              setConfirmModal(null);
                              handleUpdateStatus(selectedSub.id, 'resolved');
                            }
                          })} 
                          className="px-4 py-2 bg-neutral-900 hover:bg-black text-white font-bold rounded-lg cursor-pointer transition-all duration-200 select-none animate-fade-in"
                        >
                          Resolve Entry
                        </button>
                      </div>
                      <button type="button" onClick={handleSaveNotes} className="px-4 py-2 border border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50 text-neutral-600 font-bold rounded-lg cursor-pointer transition-all duration-200 select-none">Save Notes</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: DIGITAL MAGAZINE */}
        {activeTab === 'blogs' && (
          <div className="space-y-6 animate-fade-in">
            {!isEditingBlog ? (
              <>
                <div className="flex justify-end mb-4">
                  <button onClick={startCreateBlog} className="px-4 py-2 bg-neutral-900 text-white text-xs font-medium rounded-lg hover:bg-black transition-colors flex items-center gap-2">
                    <Plus size={14} /> New Post
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(() => {
                    const isSuper = currentAdmin?.email === 'hambar0011@gmail.com' || currentAdmin?.role === 'Super Admin';
                    const visibleArticles = articles.filter(art => {
                      if (isSuper) return true;
                      if (!currentAdmin) return false;
                      const isAuthorEmailMatch = art.authorEmail?.toLowerCase() === currentAdmin.email.toLowerCase();
                      const isAuthorNameMatch = !art.authorEmail && art.author?.name === currentAdmin.name;
                      return isAuthorEmailMatch || isAuthorNameMatch;
                    });
                    
                    if (!visibleArticles.length) {
                      return <div className="col-span-full py-12 text-center text-neutral-500 text-sm">No articles published yet.</div>;
                    }

                    return visibleArticles.map(art => (
                      <div key={art.id} className="bg-white border border-neutral-200 rounded-xl p-5 hover:shadow-md transition-shadow flex flex-col">
                        <h3 className="font-bold text-sm tracking-tight mb-2 line-clamp-2">
                          {art.status === 'draft' && <span className="mr-2 text-[10px] font-bold bg-neutral-100 text-neutral-500 uppercase tracking-widest px-2 py-0.5 rounded">Draft</span>}
                          {art.title}
                        </h3>
                        <p className="text-xs text-neutral-500 line-clamp-3 mb-4">{art.excerpt}</p>
                        <div className="mt-auto pt-4 border-t border-neutral-100 flex justify-between items-center text-xs">
                          <span className="text-neutral-400 font-medium">{art.date}</span>
                          <div className="flex gap-2">
                            <button onClick={()=>startEditBlog(art)} className="p-1 hover:text-neutral-900 text-neutral-400"><Edit size={14}/></button>
                            <button onClick={()=>deleteBlog(art.id)} className="p-1 hover:text-rose-600 text-neutral-400"><Trash2 size={14}/></button>
                          </div>
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </>
            ) : (
              <div className="bg-white border border-neutral-200 rounded-xl p-6 sm:p-8 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-lg">{editingBlogId ? 'Edit Article' : 'Draft Article'}</h3>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setShowPreview(!showPreview)} className="px-3 py-1.5 text-xs font-medium text-neutral-600 bg-neutral-100 hover:bg-neutral-200 rounded-md transition-colors">
                      {showPreview ? 'Hide Preview' : 'Show Preview'}
                    </button>
                    <button onClick={()=>setIsEditingBlog(false)} className="p-1 bg-neutral-100 hover:bg-neutral-200 rounded-md"><X size={16}/></button>
                  </div>
                </div>
                <div className={`grid grid-cols-1 ${showPreview ? 'lg:grid-cols-2' : ''} gap-8`}>
                  {/* Left Column: Editor Form */}
                  <form onSubmit={(e) => saveBlog(e, 'published')} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                      <div className="space-y-4">
                        <div className="space-y-1"><label className="text-xs font-medium text-neutral-500">Title</label><input required value={blogForm.title} onChange={e=>setBlogForm({...blogForm, title:e.target.value})} className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg outline-none focus:border-neutral-900" /></div>
                        <div className="space-y-1"><label className="text-xs font-medium text-neutral-500">URL Slug</label><input required value={blogForm.slug} onChange={e=>setBlogForm({...blogForm, slug:e.target.value})} className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg outline-none focus:border-neutral-900 font-mono text-xs" /></div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-neutral-500">Author</label>
                           <select 
                            className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg outline-none focus:border-neutral-900 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            value={blogForm.authorName}
                            disabled={!(currentAdmin?.email === 'hambar0011@gmail.com' || currentAdmin?.role === 'Super Admin')}
                            onChange={e => {
                              const admin = adminUsers.find(a => a.name === e.target.value);
                              if (admin) {
                                setBlogForm({ ...blogForm, authorName: admin.name, authorRole: admin.role, authorAvatar: admin.avatar });
                              }
                            }}
                          >
                            <option value="" disabled>Select Author</option>
                            {(currentAdmin?.email === 'hambar0011@gmail.com' || currentAdmin?.role === 'Super Admin') ? (
                              adminUsers.map(u => <option key={u.id} value={u.name}>{u.name}</option>)
                            ) : (
                              currentAdmin && <option value={currentAdmin.name}>{currentAdmin.name}</option>
                            )}
                          </select>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-1"><label className="text-xs font-medium text-neutral-500">Thumbnail Image URL</label><input value={blogForm.imageUrl} onChange={e=>setBlogForm({...blogForm, imageUrl:e.target.value})} className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg outline-none focus:border-neutral-900" placeholder="https://..." /></div>
                        <div className="space-y-1"><label className="text-xs font-medium text-neutral-500">Author Role</label><input disabled value={blogForm.authorRole} className="w-full px-3 py-2 bg-neutral-200 border border-neutral-300 rounded-lg text-neutral-500 cursor-not-allowed" /></div>
                        <div className="space-y-1"><label className="text-xs font-medium text-neutral-500">Author Avatar URL</label><input disabled value={blogForm.authorAvatar} className="w-full px-3 py-2 bg-neutral-200 border border-neutral-300 rounded-lg text-neutral-500 cursor-not-allowed font-mono text-xs" /></div>
                        <div className="space-y-1"><label className="text-xs font-medium text-neutral-500">Category</label><input value={blogForm.category} onChange={e=>setBlogForm({...blogForm, category:e.target.value})} className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg outline-none focus:border-neutral-900" /></div>
                      </div>
                    </div>
                    <div className="space-y-1"><label className="text-xs font-medium text-neutral-500">Excerpt / Summary</label><textarea required rows={2} value={blogForm.excerpt} onChange={e=>setBlogForm({...blogForm, excerpt:e.target.value})} className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg outline-none focus:border-neutral-900 text-sm" /></div>
                    <div className="space-y-1">
                      <div className="flex justify-between items-end mb-1">
                        <label className="text-xs font-medium text-neutral-500">Body Content (HTML / CSS)</label>
                        <label className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest cursor-pointer hover:text-neutral-900 border border-neutral-200 px-2 py-1 rounded bg-neutral-50 transition-colors">
                          Upload Code File
                          <input type="file" accept=".html,.css,.md,.txt" className="hidden" onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => setBlogForm({ ...blogForm, content: event.target?.result as string });
                              reader.readAsText(file);
                            }
                          }} />
                        </label>
                      </div>
                      <div className="w-full bg-white border border-neutral-200 rounded-lg outline-none focus-within:border-neutral-900 overflow-hidden font-mono text-xs">
                        <Editor
                          value={blogForm.content}
                          onValueChange={code => setBlogForm({ ...blogForm, content: code })}
                          highlight={code => Prism.highlight(code, Prism.languages.markup, 'markup')}
                          padding={16}
                          style={{
                            fontFamily: '"JetBrains Mono", monospace',
                            fontSize: 12,
                            minHeight: '200px'
                          }}
                          className="min-h-[200px]"
                        />
                      </div>
                    </div>
                    <div className="flex justify-start gap-3 pt-4 border-t border-neutral-100">
                      <button type="button" onClick={()=>setIsEditingBlog(false)} className="px-4 py-2 border border-neutral-200 text-neutral-600 text-xs font-medium rounded-lg">Cancel</button>
                      <button type="button" onClick={(e) => saveBlog(e as any, 'draft')} className="px-4 py-2 border border-neutral-200 bg-neutral-100 text-neutral-900 text-xs font-medium rounded-lg hover:bg-neutral-200 transition-colors">Save as Draft</button>
                      <button type="submit" disabled={!blogForm.authorName} className="px-4 py-2 bg-neutral-900 text-white text-xs font-medium rounded-lg hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed">{editingBlogId ? 'Save Changes' : 'Publish Article'}</button>
                    </div>
                  </form>
                  {/* Right Column: Live Preview */}
                  {showPreview && (
                    <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-6 max-h-[800px] overflow-y-auto w-full">
                      <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-4 block">Live Preview</span>
                      {blogForm.title ? <h1 className="text-3xl font-bold tracking-tight mb-4">{blogForm.title}</h1> : <h1 className="text-3xl font-bold tracking-tight mb-4 text-neutral-300">Article Title</h1>}
                      {blogForm.imageUrl && <img src={blogForm.imageUrl} alt="Thumbnail preview" className="w-full h-auto max-h-64 object-cover rounded-xl mb-8 shadow-sm" />}
                      <div className="flex items-center gap-3 mb-8 pb-8 border-b border-neutral-200">
                        <img src={blogForm.authorAvatar} alt="Author" className="w-10 h-10 rounded-full object-cover bg-neutral-200" />
                        <div>
                          <p className="text-sm font-bold text-neutral-900">{blogForm.authorName || 'Author Name'}</p>
                          <p className="text-xs text-neutral-500">{blogForm.authorRole || 'Author Role'}</p>
                        </div>
                      </div>
                      {blogForm.content ? (
                        <div 
                          className="prose prose-sm max-w-none prose-slate leading-relaxed space-y-4 text-sm text-neutral-800"
                          dangerouslySetInnerHTML={{ __html: blogForm.content }} 
                        />
                      ) : (
                        <p className="text-sm text-neutral-400 italic">Typing body content will reflect here...</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
        {/* TAB 5: ACCOUNT */}
        {activeTab === 'account' && currentAdmin && (
          <div className="space-y-8 animate-fade-in" id="account-tab">
            <h2 className="text-lg font-bold tracking-tight">Account Overview</h2>
            <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm max-w-xl">
              <h3 className="text-sm font-bold mb-4 tracking-tight">My Profile</h3>
              <div className="flex items-start gap-6">
                <div className="flex flex-col gap-2 relative group flex-shrink-0">
                  {accountForm.avatar ? (
                    <img src={accountForm.avatar} alt="My Profile" className="w-20 h-20 rounded-full object-cover border border-neutral-200" />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center border border-neutral-200">
                      <span className="text-neutral-400 font-bold text-xl">{accountForm.name ? accountForm.name.charAt(0).toUpperCase() : '?'}</span>
                    </div>
                  )}
                  <label className="absolute inset-0 flex items-center justify-center bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[10px] font-bold">
                    Edit
                    <input type="file" accept="image/*" onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (ev) => setAccountForm({...accountForm, avatar: ev.target?.result as string});
                        reader.readAsDataURL(file);
                      }
                    }} className="hidden" />
                  </label>
                </div>
                <div className="flex-1 space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-neutral-500">Name</label>
                    <input type="text" value={accountForm.name} onChange={e => setAccountForm({...accountForm, name: e.target.value})} className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg outline-none focus:border-neutral-900" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-neutral-500">Email (Read Only)</label>
                    <input type="email" value={accountForm.email} readOnly className="w-full px-3 py-2 text-sm bg-neutral-100 border border-neutral-200 rounded-lg outline-none focus:border-neutral-900 opacity-70" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-neutral-500">New Password <span className="text-neutral-400 font-normal">(Optional)</span></label>
                    <input type="password" placeholder="Enter new password" value={accountForm.password} onChange={e => setAccountForm({...accountForm, password: e.target.value})} className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg outline-none focus:border-neutral-900" />
                  </div>
                  <button onClick={async () => {
                    try {
                      await adminStore.updateAdmin(currentAdmin.id, { ...currentAdmin, name: accountForm.name, avatar: accountForm.avatar, password: accountForm.password });
                      triggerToast('Profile updated' + (accountForm.password ? ' & Password changed' : ''));
                      setAccountForm({...accountForm, password: ''});
                      loadData();
                    } catch (e: any) {
                      triggerToast(e.message || 'Update failed', 'error');
                    }
                  }} className="px-4 py-2 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-black transition-colors w-full">Save Changes</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: MANAGE ADMINS */}
        {activeTab === 'admins' && (currentAdmin?.email === 'hambar0011@gmail.com' || currentAdmin?.role === 'Super Admin') && (
          <div className="space-y-8 animate-fade-in" id="admin-management-tab">
            <h2 className="text-lg font-bold tracking-tight">Super Admin: Manage Access</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Existing Admins List */}
              <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-sm font-bold mb-4 tracking-tight">Authorized Personnel</h3>
                <div className="space-y-4">
                  {adminUsers.map(admin => (
                    <div key={admin.id} className="flex flex-col gap-2 p-3 bg-neutral-50 border border-neutral-100 rounded-lg">
                      {editingAdminId === admin.id ? (
                        <div className="space-y-2 text-sm">
                          <input required value={editingAdminForm.name} onChange={e=>setEditingAdminForm({...editingAdminForm, name: e.target.value})} placeholder="Name" className="w-full px-2 py-1 border border-neutral-200 rounded outline-none focus:border-neutral-900" />
                          <input required type="email" value={editingAdminForm.email} onChange={e=>setEditingAdminForm({...editingAdminForm, email: e.target.value})} placeholder="Email" className="w-full px-2 py-1 border border-neutral-200 rounded outline-none focus:border-neutral-900" />
                          <input required value={editingAdminForm.role} onChange={e=>setEditingAdminForm({...editingAdminForm, role: e.target.value})} placeholder="Role" className="w-full px-2 py-1 border border-neutral-200 rounded outline-none focus:border-neutral-900" />
                          <input type="password" value={(editingAdminForm as any).password || ''} onChange={e=>setEditingAdminForm({...editingAdminForm, password: e.target.value} as any)} placeholder="New Password (optional)" className="w-full px-2 py-1 border border-neutral-200 rounded outline-none focus:border-neutral-900" />
                          <div className="flex items-center gap-2">
                            {editingAdminForm.avatar && <img src={editingAdminForm.avatar} className="w-8 h-8 rounded-full object-cover" alt="Avatar" />}
                            <input type="file" accept="image/*" onChange={(e) => handleAvatarUpload(e, false)} className="flex-1 text-[10px] file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:bg-neutral-100 file:text-neutral-700 cursor-pointer" />
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => handleUpdateAdmin(admin.id)} className="px-3 py-1 bg-neutral-900 text-white rounded text-xs">Save</button>
                            <button onClick={() => setEditingAdminId(null)} className="px-3 py-1 bg-neutral-200 text-neutral-800 rounded text-xs">Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="relative w-10 h-10 flex-shrink-0">
                              {admin.avatar ? (
                                <img 
                                  src={admin.avatar} 
                                  alt={admin.name} 
                                  className="w-10 h-10 rounded-full object-cover border border-neutral-100 bg-neutral-100" 
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    const fb = document.getElementById(`avatar-fb-${admin.id}`);
                                    if (fb) fb.style.display = 'flex';
                                  }}
                                />
                              ) : null}
                              {(!admin.avatar || admin.avatar === '') ? (
                                <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center border border-neutral-200 flex-shrink-0 text-neutral-500 font-bold text-sm">
                                  {admin.name ? admin.name.charAt(0).toUpperCase() : '?'}
                                </div>
                              ) : (
                                <div id={`avatar-fb-${admin.id}`} style={{ display: 'none' }} className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center border border-neutral-200 flex-shrink-0 text-neutral-500 font-bold text-sm">
                                  {admin.name ? admin.name.charAt(0).toUpperCase() : '?'}
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-neutral-900">{admin.name}</p>
                              <p className="text-xs text-neutral-500">{admin.role} • {admin.email}</p>
                            </div>
                          </div>
                          <div className="flex gap-2 text-neutral-400">
                            <button onClick={() => { setEditingAdminId(admin.id); setEditingAdminForm(admin); }} className="hover:text-black transition-colors"><Edit size={16} /></button>
                            {admin.email !== 'hambar0011@gmail.com' && admin.role !== 'Super Admin' && (
                              <button onClick={() => handleDeleteAdmin(admin.id)} className="hover:text-rose-600 transition-colors"><Trash2 size={16} /></button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Add New Admin Form */}
              <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm flex flex-col h-full">
                <h3 className="text-sm font-bold mb-4 tracking-tight">Provision New Administrator</h3>
                <form onSubmit={handleAddAdmin} className="space-y-4 text-sm flex-1 flex flex-col">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-neutral-500 block mb-1">Full Name</label>
                      <input required value={newAdminForm.name} onChange={e=>setNewAdminForm({...newAdminForm, name: e.target.value})} placeholder="Jane Doe" className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg outline-none focus:border-neutral-900" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-neutral-500 block mb-1">Email Address</label>
                      <input required type="email" value={newAdminForm.email} onChange={e=>setNewAdminForm({...newAdminForm, email: e.target.value})} placeholder="jane@example.com" className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg outline-none focus:border-neutral-900" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-neutral-500 block mb-1">Initial Password</label>
                    <input required type="text" value={newAdminForm.password} onChange={e=>setNewAdminForm({...newAdminForm, password: e.target.value})} placeholder="Set initial password" className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg outline-none focus:border-neutral-900" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-neutral-500 block mb-1">Profile Photo</label>
                    <div className="flex items-center gap-3">
                      {newAdminForm.avatar && <img src={newAdminForm.avatar} className="w-10 h-10 rounded-full object-cover border border-neutral-200" alt="Preview" />}
                      <input type="file" accept="image/*" onChange={(e) => handleAvatarUpload(e, true)} className="flex-1 text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-neutral-100 file:text-neutral-700 hover:file:bg-neutral-200 cursor-pointer" />
                    </div>
                  </div>
                  <div className="pt-2 mt-auto border-t border-neutral-100">
                    <button type="submit" className="w-full flex items-center justify-center gap-2 bg-neutral-900 text-white font-medium py-2.5 rounded-lg hover:bg-black transition-colors">
                      <UserPlus size={16} /> Grant Admin Access
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
