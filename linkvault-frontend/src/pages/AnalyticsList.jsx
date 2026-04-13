import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { urlAPI } from '../services/api';
import Sidebar from '../components/Sidebar';
import toast from 'react-hot-toast';

export default function AnalyticsList() {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const fetchUrls = useCallback(async () => {
    try {
      const res = await urlAPI.getAll({ limit: 50 });
      setUrls(res.data.urls);
    } catch {
      toast.error('Failed to load links');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUrls(); }, [fetchUrls]);

  const filtered = urls.filter(u => {
  const s = search.toLowerCase();
  return (
    u.shortCode.toLowerCase().includes(s) ||
    u.originalUrl.toLowerCase().includes(s) ||
    (u.customAlias && u.customAlias.toLowerCase().includes(s))
  );
});

  return (
    <div className="bg-background min-h-screen">
      <Sidebar />

      <header className="fixed top-0 right-0 left-64 h-20 flex justify-between items-center px-8 z-40 bg-background/80 backdrop-blur-md border-b-4 border-black">
        <div className="relative w-full max-w-xl">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-black">search</span>
          <input
            className="w-full bg-white border-4 border-black rounded-xl py-2 pl-12 pr-4 focus:ring-4 focus:ring-primary-container outline-none font-medium"
            placeholder="Search links..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </header>

      <main className="ml-64 mt-20 p-8">
        <div className="max-w-5xl mx-auto space-y-8">
          <div>
            <h1 className="text-4xl font-black tracking-tighter">Analytics</h1>
            <p className="text-on-surface-variant font-medium mt-1">Select a link to view detailed analytics</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-black border-t-primary-container rounded-full animate-spin"></div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="bento-card p-12 text-center text-on-surface-variant font-bold">
              No links found. Create some links first!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filtered.map(url => (
                <div
                  key={url.id}
                  onClick={() => navigate(`/analytics/${url.id}`)}
                  className="bento-card p-6 cursor-pointer hover:bg-surface-container-low transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0 mr-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="pulse-dot flex-shrink-0"></span>
                        <p className="font-black text-primary truncate text-lg">
                          {url.customAlias || url.shortCode}
                        </p>
                      </div>
                      <p className="text-xs text-on-surface-variant truncate">{url.originalUrl}</p>
                    </div>
                    <span className="material-symbols-outlined text-on-surface-variant flex-shrink-0">chevron_right</span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t-2 border-black/10">
                    <div className="text-center">
                      <p className="text-2xl font-black">{url.totalClicks}</p>
                      <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Clicks</p>
                    </div>
                    <div className="text-center border-x-2 border-black/10">
                      <p className="text-sm font-black">{new Date(url.createdAt).toLocaleDateString()}</p>
                      <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Created</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-black">{url.lastVisited ? new Date(url.lastVisited).toLocaleDateString() : 'Never'}</p>
                      <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Last Visit</p>
                    </div>
                  </div>

                  {url.expiresAt && (
                    <div className="mt-3 flex items-center gap-1 text-error text-xs font-bold">
                      <span className="material-symbols-outlined text-sm">schedule</span>
                      Expires {new Date(url.expiresAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}