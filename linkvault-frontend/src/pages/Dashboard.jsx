import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { urlAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import QRModal from '../components/QRModal';
import CreateLinkModal from '../components/CreateLinkModal';
import toast from 'react-hot-toast';
import BulkUploadModal from '../components/BulkUploadModal';

// Simple SVG Flag Components for consistent cross-platform rendering
const Flags = {
  IN: () => <svg className="w-4 h-3" viewBox="0 0 640 480"><path fill="#f4c430" d="M0 0h640v160H0z"/><path fill="#fff" d="M0 160h640v160H0z"/><path fill="#198837" d="M0 320h640v160H0z"/><circle cx="320" cy="240" r="40" fill="none" stroke="#000080" strokeWidth="4"/><path fill="#000080" d="M320 210L314 240H326L320 210z"/></svg>,
  US: () => <svg className="w-4 h-3" viewBox="0 0 640 480"><path fill="#bd3d44" d="M0 0h640v480H0z"/><path stroke="#fff" strokeWidth="37" d="M0 55.4h640M0 129.2h640M0 203h640M0 277h640M0 350.8h640M0 424.6h640"/><path fill="#192f5d" d="M0 0h256v221.5H0z"/><circle cx="128" cy="110" r="80" fill="#fff"/></svg>,
  UK: () => <svg className="w-4 h-3" viewBox="0 0 640 480"><path fill="#012169" d="M0 0h640v480H0z"/><path fill="#fff" d="M0 0l640 480M640 0L0 480" stroke="#fff" strokeWidth="60"/><path stroke="#c8102e" strokeWidth="40" d="M0 0l640 480M640 0L0 480"/><path fill="#fff" d="M320 0v480M0 240h640" stroke="#fff" strokeWidth="100"/><path stroke="#c8102e" strokeWidth="60" d="M320 0v480M0 240h640"/></svg>,
  DE: () => <svg className="w-4 h-3" viewBox="0 0 640 480"><path d="M0 0h640v160H0z"/><path fill="#d00" d="M0 160h640v160H0z"/><path fill="#ffce00" d="M0 320h640v160H0z"/></svg>
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalLinks: 0, totalClicks: 0, growth: 0 });
  const [recentUrls, setRecentUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qrUrl, setQrUrl] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showBulk, setShowBulk] = useState(false);

  const fetchDashboard = useCallback(async () => {
    try {
      const res = await urlAPI.getDashboard();
      setStats(res.data.stats);
      setRecentUrls(res.data.recentUrls);
    } catch {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this link?')) return;
    try {
      await urlAPI.delete(id);
      toast.success('Link deleted');
      fetchDashboard();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const copyLink = (shortUrl) => {
    navigator.clipboard.writeText(shortUrl);
    toast.success('Copied!');
  };

  return (
    <div className="bg-background min-h-screen overflow-hidden">
      <Sidebar />

      <header className="fixed top-0 right-0 left-64 h-20 flex justify-end items-center px-8 z-40 bg-background/80 backdrop-blur-md border-b-4 border-black">
        <div className="relative ml-6 flex-shrink-0">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-3 px-4 py-2 border-4 border-black rounded-xl font-black bg-white neo-shadow neo-hover neo-active transition-all"
          >
            <div className="w-8 h-8 rounded-full bg-primary-container border-2 border-black flex items-center justify-center font-black text-sm">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <span className="hidden md:block">{user?.name}</span>
            <span className="material-symbols-outlined text-sm">
              {showProfile ? 'expand_less' : 'expand_more'}
            </span>
          </button>

          {showProfile && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowProfile(false)} />
              <div className="absolute right-0 top-16 w-80 bg-white border-4 border-black rounded-2xl neo-shadow-xl z-50 overflow-hidden">
                <div className="bg-primary-container p-6 flex flex-col items-center gap-3 border-b-4 border-black">
                  <div className="w-16 h-16 rounded-full bg-white border-4 border-black flex items-center justify-center text-2xl font-black">
                    {user?.name?.[0]?.toUpperCase()}
                  </div>
                  <div className="text-center">
                    <p className="font-black text-lg">{user?.name}</p>
                    <p className="text-sm font-medium text-on-surface-variant">{user?.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 border-b-4 border-black">
                  <div className="p-4 text-center border-r-2 border-black">
                    <p className="text-2xl font-black">{stats.totalLinks}</p>
                    <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Links</p>
                  </div>
                  <div className="p-4 text-center">
                    <p className="text-2xl font-black">{stats.totalClicks}</p>
                    <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Clicks</p>
                  </div>
                </div>

                <div className="p-4 space-y-3 border-b-4 border-black">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">calendar_today</span>
                    <div>
                      <p className="text-xs font-bold text-on-surface-variant uppercase">Member Since</p>
                      <p className="font-bold text-sm">
                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">mail</span>
                    <div>
                      <p className="text-xs font-bold text-on-surface-variant uppercase">Email</p>
                      <p className="font-bold text-sm truncate">{user?.email}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 flex flex-col gap-2">
                  <button onClick={() => { navigate('/settings'); setShowProfile(false); }} className="w-full flex items-center gap-3 p-3 rounded-xl font-bold hover:bg-surface-container transition-all border-2 border-black">
                    <span className="material-symbols-outlined text-sm">settings</span>
                    Edit Profile & Settings
                  </button>
                  <button onClick={() => { logout(); navigate('/login'); }} className="w-full flex items-center gap-3 p-3 rounded-xl font-bold hover:bg-error-container transition-all text-error border-2 border-black">
                    <span className="material-symbols-outlined text-sm">logout</span>
                    Logout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </header>

      <main className="ml-64 mt-20 p-8 h-[calc(100vh-5rem)] overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'Total Links', value: stats.totalLinks, icon: 'link', bg: 'bg-primary-container' },
              { label: 'Total Clicks', value: stats.totalClicks.toLocaleString(), icon: 'ads_click', bg: 'bg-secondary-container' },
              { label: 'Growth', value: `${stats.growth > 0 ? '+' : ''}${stats.growth}%`, icon: 'trending_up', bg: 'bg-surface-container' },
            ].map(card => (
              <div key={card.label} className="bento-card p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">{card.label}</p>
                  <h3 className="text-3xl font-black">{loading ? '...' : card.value}</h3>
                </div>
                <div className={`w-12 h-12 rounded-full ${card.bg} border-2 border-black flex items-center justify-center`}>
                  <span className="material-symbols-outlined">{card.icon}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Hero Card */}
          <div className="bento-card p-8 flex flex-col md:flex-row items-center gap-8 bg-white">
            <div className="flex-1">
              <h2 className="text-4xl font-black mb-6 leading-tight">Shorten. Share. Track.</h2>
              <button
                onClick={() => setShowCreate(true)}
                className="bg-primary-container px-8 py-4 rounded-xl font-bold text-xl border-4 border-black neo-shadow neo-hover neo-active transition-all"
              >
                + Create New Link
              </button>
            </div>
            <div className="flex gap-2 flex-wrap justify-center">
              {[
                { code: 'IN', label: 'IN' },
                { code: 'US', label: 'USA' },
                { code: 'UK', label: 'UK' },
                { code: 'DE', label: 'DE' }
              ].map((flag, i) => {
                const FlagIcon = Flags[flag.code];
                return (
                  <div key={i} className="bg-white border-2 border-black px-3 py-1 rounded-full text-[10px] font-black neo-shadow animate-bounce flex items-center gap-2"
                    style={{ animationDelay: `${i * 0.3}s` }}>
                    <FlagIcon />
                    {flag.label}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Links Table */}
          <div className="bento-card overflow-hidden">
            <div className="p-6 border-b-4 border-black flex justify-between items-center">
              <h3 className="text-lg font-black">Recent Links</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowBulk(true)}
                  className="bg-surface-container border-2 border-black px-4 py-2 rounded-xl font-bold text-sm neo-shadow neo-hover transition-all flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">upload_file</span>
                  Bulk CSV
                </button>
                <button
                  onClick={() => setShowCreate(true)}
                  className="bg-secondary-container border-2 border-black px-4 py-2 rounded-xl font-bold text-sm neo-shadow neo-hover transition-all flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">add</span> New Link
                </button>
              </div>
            </div>

            {loading ? (
              <div className="p-12 text-center">
                <div className="w-8 h-8 border-4 border-black border-t-primary-container rounded-full animate-spin mx-auto"></div>
              </div>
            ) : recentUrls.length === 0 ? (
              <div className="p-12 text-center text-on-surface-variant font-bold">
                No links yet. Create your first one!
              </div>
            ) : (
              <div className="divide-y-2 divide-black/10">
                {recentUrls.map(url => (
                  <div key={url.id} className="flex items-center gap-4 p-4 hover:bg-surface-container-low transition-colors">
                    <span className="pulse-dot flex-shrink-0"></span>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-primary truncate">{url.customAlias || url.shortCode}</p>
                      <p className="text-xs text-gray-400 truncate">{url.originalUrl}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs font-black">{url.totalClicks} <span className="text-gray-400 font-normal">clicks</span></p>
                      <p className="text-xs text-gray-400">{new Date(url.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <button onClick={() => copyLink(url.shortUrl)} className="p-2 hover:bg-white rounded border border-transparent hover:border-black transition-all" title="Copy link">
                        <span className="material-symbols-outlined text-[18px]">content_copy</span>
                      </button>
                      <button onClick={() => setQrUrl(url)} className="p-2 hover:bg-white rounded border border-transparent hover:border-black transition-all" title="QR Code">
                        <span className="material-symbols-outlined text-[18px]">qr_code_2</span>
                      </button>
                      <button onClick={() => navigate(`/analytics/${url.id}`)} className="p-2 hover:bg-white rounded border border-transparent hover:border-black transition-all" title="Analytics">
                        <span className="material-symbols-outlined text-[18px]">analytics</span>
                      </button>
                      <button onClick={() => window.open(`/stats/${url.customAlias || url.shortCode}`, '_blank')} className="p-2 hover:bg-white rounded border border-transparent hover:border-black transition-all" title="Public Stats">
                        <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                      </button>
                      <button onClick={() => handleDelete(url.id)} className="p-2 hover:bg-error-container rounded border border-transparent hover:border-black transition-all text-error" title="Delete">
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {qrUrl && <QRModal url={qrUrl} onClose={() => setQrUrl(null)} />}
      {showCreate && <CreateLinkModal onClose={() => setShowCreate(false)} onCreated={fetchDashboard} />}
      {showBulk && <BulkUploadModal onClose={() => setShowBulk(false)} onCreated={fetchDashboard} />}
    </div>
  );
}