import React, { useState, useEffect } from 'react';
import { adminStore, FormSubmission } from '../lib/admin-store';
import { Article } from '../types';
import { 
  LayoutDashboard, FileText, MessageSquare, Plus, Save, 
  Trash2, Edit, CheckCircle2, AlertCircle, Clock, Eye, X,
  Search, ArrowUpRight, ListTodo, Archive, RefreshCw, Lock, UserPlus, ChevronDown, BarChart2, Activity, Users
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
  const [activeTab, setActiveTab] = useState<'dashboard' | 'submissions' | 'blogs' | 'admins'>('dashboard');
  
  // Data
  const [chartType, setChartType] = useState<'area' | 'bar'>('area');
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [newAdminForm, setNewAdminForm] = useState({ name: '', email: '', role: 'Admin', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120', password: '' });
  const [editingAdminId, setEditingAdminId] = useState<string | null>(null);
  const [editingAdminForm, setEditingAdminForm] = useState({ name: '', email: '', role: '', avatar: '' });
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [adminUsers, setAdminUsers] = useState<any[]>([]);
  const [currentAdmin, setCurrentAdmin] = useState<any>(null);
  const [profilePfpLink, setProfilePfpLink] = useState('');
  
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
  
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    adminStore.isAuthenticated().then(setIsAuthenticated);
  }, []);

  const loadData = async () => {
    const [subs, arts, charts, admins, currAdmin] = await Promise.all([
      adminStore.getSubmissions(),
      adminStore.getArticles(),
      adminStore.getChartData(),
      adminStore.getAdmins(),
      adminStore.getCurrentAdmin()
    ]);
    setSubmissions(subs);
    setArticles(arts);
    setChartData(charts);
    setAdminUsers(admins);
    setCurrentAdmin(currAdmin);
    if (currAdmin && !profilePfpLink) {
      setProfilePfpLink(currAdmin.avatar || '');
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
  const handleUpdateStatus = async (id: string, status: FormSubmission['status']) => {
    await adminStore.updateSubmissionStatus(id, status, subNotes);
    if (selectedSub?.id === id) setSelectedSub(prev => prev ? { ...prev, status } : null);
    triggerToast(`Status set to ${status}`);
  };
  const handleSaveNotes = async () => { 
    if (selectedSub) { await adminStore.updateSubmissionStatus(selectedSub.id, selectedSub.status, subNotes); triggerToast('Notes saved.'); }
  };
  const handleDeleteSub = async (id: string) => { 
    if (window.confirm('Delete this submission?')) { await adminStore.deleteSubmission(id); setSelectedSub(null); triggerToast('Deleted.'); }
  };

  const startCreateBlog = () => { setEditingBlogId(null); setBlogForm({...blogForm, title:'', slug:'', excerpt:'', content:'', imageUrl:''}); setIsEditingBlog(true); };
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
    const slugForm = blogForm.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const payload: Article = {
      id: editingBlogId || `art-${Date.now()}`,
      title: blogForm.title, slug: slugForm, category: blogForm.category, excerpt: blogForm.excerpt, content: blogForm.content, imageUrl: blogForm.imageUrl,
      author: { name: blogForm.authorName, role: blogForm.authorRole, avatar: blogForm.authorAvatar },
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      readTime: blogForm.readTime, tags: blogForm.tags.split(',').map(t=>t.trim()).filter(Boolean),
      status
    };
    if (editingBlogId) await adminStore.updateArticle(payload); else await adminStore.addArticle(payload);
    triggerToast(editingBlogId ? 'Updated!' : (status === 'draft' ? 'Saved as Draft' : 'Published!'));
    setIsEditingBlog(false);
  };
  const deleteBlog = async (id: string) => { if (window.confirm('Delete article?')) { await adminStore.deleteArticle(id); triggerToast('Deleted.'); } };
  const mockLead = async () => {
    await adminStore.addSubmission({ name:'Jane Doe', email:'jane@acme.com', type:'contact', serviceInterested:'SEO', budgetRange:'$10k+', details:'Test.' });
    triggerToast('Mock lead added.');
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
    if (!newAdminForm.name || !newAdminForm.email) return;
    try {
      await adminStore.addAdmin(newAdminForm);
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
    if (window.confirm('Are you sure you want to delete this admin?')) {
      await adminStore.deleteAdmin(id);
      triggerToast('Admin deleted');
      loadData();
    }
  };

  const handleUpdateMyProfile = async () => {
    if (!currentAdmin) return;
    try {
      await adminStore.updateAdmin(currentAdmin.id, { ...currentAdmin, avatar: profilePfpLink });
      triggerToast('Profile updated successfully');
      loadData();
    } catch (err: any) {
      triggerToast(err.message || 'Failed to update profile', 'error');
    }
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
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-5 py-3.5 bg-neutral-900 text-white rounded-lg shadow-xl animate-fade-in">
          {toast.type === 'success' ? <CheckCircle2 size={16} className="text-neutral-400" /> : <AlertCircle size={16} className="text-rose-400" />}
          <span className="text-xs font-medium tracking-wide">{toast.message}</span>
        </div>
      )}

      {/* Sticky Left Nav Column */}
      <div className="w-20 md:w-24 shrink-0 border-r border-neutral-200 bg-white/50 backdrop-blur min-h-screen hidden sm:block relative z-40">
        <div className="sticky top-24 w-full flex flex-col items-center py-6 gap-6">
          <div className="flex flex-col gap-3">
            {[
              { id: 'blogs', label: 'Digital Magazine', icon: FileText },
              { id: 'submissions', label: 'Form Submission', icon: MessageSquare },
              { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard },
              { id: 'admins', label: 'Manage Admins', icon: Users }
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
            onClick={handleLogout} 
            className="relative items-center justify-center w-11 h-11 md:w-12 md:h-12 rounded-full text-neutral-400 hover:text-rose-600 transition-colors bg-white border border-neutral-200 hover:bg-rose-50 hover:border-rose-100 flex mx-auto group shadow-sm"
          >
            <Lock size={18} />
            <span className="absolute left-full ml-4 opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-900 text-white text-[10px] font-bold px-2 py-1 rounded whitespace-nowrap z-50 pointer-events-none">
              End Session
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
              <button onClick={mockLead} className="px-3 py-1.5 bg-white border border-neutral-200 hover:bg-neutral-50 text-xs font-medium rounded-md transition-all flex items-center gap-2">
                <RefreshCw size={12} /> Gen Mock Lead
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Active Inquiries', val: submissions.length, icon: MessageSquare },
                { label: 'Published Articles', val: articles.length, icon: FileText },
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
                    <button onClick={() => setSelectedSub(null)} className="p-2 bg-neutral-100 hover:bg-neutral-200 rounded-full"><X size={14} /></button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-xs font-sans mb-6">
                    <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100"><span className="text-neutral-500 mb-1 block">Email</span><span className="font-bold">{selectedSub.email}</span></div>
                    <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100"><span className="text-neutral-500 mb-1 block">Phone</span><span className="font-bold">{selectedSub.phone || 'N/A'}</span></div>
                    <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100"><span className="text-neutral-500 mb-1 block">Company</span><span className="font-bold">{selectedSub.companyName || 'N/A'}</span></div>
                  </div>
                  
                  <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-100 text-sm leading-relaxed whitespace-pre-wrap mb-6 text-neutral-800">
                    <span className="text-xs text-neutral-500 font-bold uppercase block mb-2">Details / Remarks</span>
                    {selectedSub.details || (selectedSub as any).description || 'No additional details provided.'}
                  </div>

                  <div className="mt-auto space-y-4 pt-6 border-t border-neutral-100">
                    <div>
                      <label className="text-xs font-bold text-neutral-500 block mb-2">Admin Notes</label>
                      <textarea value={subNotes} onChange={e=>setSubNotes(e.target.value)} rows={3} className="w-full text-xs p-3 bg-neutral-50 border border-neutral-200 rounded-lg outline-none focus:border-neutral-900" />
                    </div>
                    <div className="flex gap-2 text-xs">
                      <button onClick={()=>handleUpdateStatus(selectedSub.id, 'in_progress')} className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 font-medium rounded-lg">Mark Reviewing</button>
                      <button onClick={()=>handleUpdateStatus(selectedSub.id, 'resolved')} className="px-4 py-2 bg-neutral-900 hover:bg-black text-white font-medium rounded-lg">Resolve Entry</button>
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
                  {articles.map(art => (
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
                  ))}
                  {!articles.length && <div className="col-span-full py-12 text-center text-neutral-500 text-sm">No articles published yet.</div>}
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
                            className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg outline-none focus:border-neutral-900 text-sm"
                            value={blogForm.authorName}
                            onChange={e => {
                              const admin = adminUsers.find(a => a.name === e.target.value);
                              if (admin) {
                                setBlogForm({ ...blogForm, authorName: admin.name, authorRole: admin.role, authorAvatar: admin.avatar });
                              }
                            }}
                          >
                            <option value="" disabled>Select Author</option>
                            {adminUsers.map(u => <option key={u.id} value={u.name}>{u.name}</option>)}
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
                      <button type="submit" className="px-4 py-2 bg-neutral-900 text-white text-xs font-medium rounded-lg hover:bg-black transition-colors">{editingBlogId ? 'Save Changes' : 'Publish Article'}</button>
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
        {/* TAB 4: MANAGE ADMINS */}
        {activeTab === 'admins' && (
          <div className="space-y-8 animate-fade-in" id="admin-management-tab">
            <h2 className="text-lg font-bold tracking-tight">Super Admin: Manage Access</h2>
            
            {currentAdmin && (
              <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-sm font-bold mb-4 tracking-tight">My Profile Picture</h3>
                <div className="flex items-center gap-4">
                  <img src={currentAdmin.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120'} alt="My Profile" className="w-16 h-16 rounded-full object-cover border border-neutral-200" />
                  <div className="flex-1 max-w-md flex gap-2">
                    <input 
                      type="url" 
                      placeholder="Paste image URL here..." 
                      value={profilePfpLink} 
                      onChange={e => setProfilePfpLink(e.target.value)} 
                      className="flex-1 px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg outline-none focus:border-neutral-900" 
                    />
                    <button 
                      onClick={handleUpdateMyProfile} 
                      className="px-4 py-2 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-black transition-colors whitespace-nowrap"
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>
            )}

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
                            <img src={admin.avatar} alt={admin.name} className="w-10 h-10 rounded-full object-cover" />
                            <div>
                              <p className="text-sm font-bold">{admin.name}</p>
                              <p className="text-xs text-neutral-500">{admin.role} • {admin.email}</p>
                            </div>
                          </div>
                          <div className="flex gap-2 text-neutral-400">
                            <button onClick={() => { setEditingAdminId(admin.id); setEditingAdminForm(admin); }} className="hover:text-black transition-colors"><Edit size={16} /></button>
                            <button onClick={() => handleDeleteAdmin(admin.id)} className="hover:text-rose-600 transition-colors"><Trash2 size={16} /></button>
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
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-neutral-500 block mb-1">Role Title</label>
                      <input required value={newAdminForm.role} onChange={e=>setNewAdminForm({...newAdminForm, role: e.target.value})} placeholder="Content Editor" className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg outline-none focus:border-neutral-900" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-neutral-500 block mb-1">Initial Password <span className="text-[10px] text-neutral-400 font-normal">(Optional)</span></label>
                      <input type="text" value={newAdminForm.password} onChange={e=>setNewAdminForm({...newAdminForm, password: e.target.value})} placeholder="Temporary password" className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg outline-none focus:border-neutral-900" />
                    </div>
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
