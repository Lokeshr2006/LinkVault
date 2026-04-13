import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { analyticsAPI } from '../services/api';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

export default function PublicStats() {
  const { shortCode } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const res = await analyticsAPI.getPublicStats(shortCode);
      setData(res.data);
    } catch {
      toast.error('Stats not found');
    } finally {
      setLoading(false);
    }
  }, [shortCode]);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  const share = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Stats link copied!');
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-10 h-10 border-4 border-black border-t-primary-container rounded-full animate-spin"></div>
    </div>
  );

  const totalDevices = (data?.deviceBreakdown || []).reduce((a, b) => a + b._count.device, 0);

  return (
    <div className="bg-surface text-on-background min-h-screen pb-24 md:pb-12">
      <header className="bg-background flex justify-between items-center w-full px-6 py-4 border-b-4 border-black sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-black tracking-tighter text-black uppercase">LinkVault</span>
          <span className="material-symbols-outlined text-primary">auto_awesome</span>
        </div>
        <div className="flex gap-4">
          <Link
            to="/dashboard"
            className="font-bold text-sm px-4 py-2 border-4 border-black rounded-xl bg-white neo-shadow neo-hover neo-active transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">dashboard</span>
            Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-12">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase">Public Stats</span>
              <span className="text-sm font-medium text-black/50">{shortCode}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none">
              Link <span className="text-primary underline decoration-primary-container decoration-8">Analytics</span>
            </h1>
          </div>
          <button onClick={share} className="p-3 border-4 border-black bg-white neo-shadow neo-active flex items-center gap-2 font-bold">
            <span className="material-symbols-outlined">share</span> Share
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Total Clicks */}
          <div className="md:col-span-4 bg-white border-4 border-black rounded-xl p-8 neo-shadow relative overflow-hidden flex flex-col justify-between min-h-[280px]">
            <div className="relative z-10">
              <p className="text-sm font-bold uppercase tracking-widest text-black/60 mb-1">Total Clicks</p>
              <h2 className="text-7xl font-black text-black">{data?.totalClicks?.toLocaleString()}</h2>
              <div className="flex items-center gap-2 mt-4 text-secondary font-bold">
                <span className="material-symbols-outlined">trending_up</span>
                <span>Since {new Date(data?.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <span className="material-symbols-outlined text-[160px]">gesture</span>
            </div>
          </div>

          {/* Daily Traffic Chart */}
          <div className="md:col-span-8 bg-white border-4 border-black rounded-xl p-8 neo-shadow">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-xl font-black uppercase">Daily Traffic</h3>
                <p className="text-sm font-medium text-black/50">Last 14 days</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={data?.dailyClicks || []}>
                <defs>
                  <linearGradient id="pubGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 10, fontWeight: 700 }} tickFormatter={d => d.slice(5)} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ border: '2px solid black', borderRadius: '8px', fontWeight: 700 }} />
                <Area type="monotone" dataKey="clicks" stroke="#8b5cf6" strokeWidth={3} fill="url(#pubGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Top Countries */}
          <div className="md:col-span-6 bg-white border-4 border-black rounded-xl p-8 neo-shadow">
            <h3 className="text-xl font-black uppercase mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">public</span> Top Countries
            </h3>
            <div className="space-y-3">
              {(data?.countryBreakdown || []).length === 0 ? (
                <p className="text-on-surface-variant font-medium">No data yet</p>
              ) : (data?.countryBreakdown || []).map(c => (
                <div key={c.country} className="flex items-center justify-between p-4 bg-surface-container rounded-xl border-2 border-black">
                  <span className="font-bold">{c.country || 'Unknown'}</span>
                  <span className="font-black text-lg">{c._count.country}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Device Usage */}
          <div className="md:col-span-6 bg-white border-4 border-black rounded-xl p-8 neo-shadow">
            <h3 className="text-xl font-black uppercase mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">devices</span> Device Usage
            </h3>
            <div className="space-y-4">
              {(data?.deviceBreakdown || []).length === 0 ? (
                <p className="text-on-surface-variant font-medium">No data yet</p>
              ) : (data?.deviceBreakdown || []).map(d => (
                <div key={d.device} className="flex items-center gap-3">
                  <span className="text-sm font-bold w-20 capitalize">{d.device || 'desktop'}</span>
                  <div className="flex-1 h-3 bg-surface-container rounded-full overflow-hidden border border-black">
                    <div className="h-full bg-primary-container rounded-full border-r border-black"
                      style={{ width: `${(d._count.device / totalDevices) * 100}%` }}></div>
                  </div>
                  <span className="text-sm font-black">{Math.round((d._count.device / totalDevices) * 100)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-20 mb-12 text-center opacity-40">
          <span className="material-symbols-outlined text-4xl">signature</span>
          <p className="text-xs font-bold uppercase tracking-widest mt-2">Verified LinkVault Analytics Engine</p>
        </div>
      </main>
    </div>
  );
}