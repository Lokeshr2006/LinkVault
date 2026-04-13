import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { analyticsAPI } from '../services/api';
import Sidebar from '../components/Sidebar';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import QRModal from '../components/QRModal';
import toast from 'react-hot-toast';

export default function Analytics() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);
  const [showQR, setShowQR] = useState(false);

  const fetchAnalytics = useCallback(async () => {
    try {
      const res = await analyticsAPI.getUrlAnalytics(id, days);
      setData(res.data);
    } catch {
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  }, [id, days]);

  useEffect(() => { fetchAnalytics(); }, [fetchAnalytics]);

  const copyLink = () => {
    navigator.clipboard.writeText(data?.url?.shortUrl || '');
    toast.success('Copied!');
  };

  if (loading) return (
    <div className="ml-64 flex items-center justify-center h-screen bg-background">
      <div className="w-10 h-10 border-4 border-black border-t-primary-container rounded-full animate-spin"></div>
    </div>
  );

  const deviceData = data?.deviceBreakdown || [];
  const totalDeviceClicks = deviceData.reduce((a, b) => a + b._count.device, 0);

  return (
    <div className="bg-background min-h-screen">
      <Sidebar />
      <main className="ml-64 min-h-screen">
        <header className="flex justify-between items-center px-8 py-4 sticky top-0 z-50 bg-background border-b-4 border-black">
          <div className="flex items-center gap-2 text-sm font-bold text-black/40">
            <button onClick={() => navigate('/dashboard')} className="hover:text-black">Dashboard</button>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-primary underline decoration-2 underline-offset-4">{data?.url?.shortCode}</span>
          </div>
          <div className="flex gap-2">
            <button onClick={copyLink} className="p-2 hover:bg-primary-container rounded-lg transition-colors border-2 border-black">
              <span className="material-symbols-outlined">content_copy</span>
            </button>
            <button onClick={() => setShowQR(true)} className="p-2 hover:bg-primary-container rounded-lg transition-colors border-2 border-black">
              <span className="material-symbols-outlined">qr_code_2</span>
            </button>
          </div>
        </header>

        <div className="p-8 max-w-[1400px] mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 flex flex-col gap-8">

              {/* Daily Clicks Chart */}
              <div className="bento-card p-8">
                <div className="flex justify-between items-end mb-8">
                  <div>
                    <h2 className="text-2xl font-black mb-1">Daily Clicks</h2>
                    <p className="text-on-surface-variant text-sm font-semibold italic">Last {days} days</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-4xl font-black text-primary">{data?.totalClicks?.toLocaleString()}</span>
                      <p className="text-xs font-bold text-secondary">total clicks</p>
                    </div>
                    <div className="flex gap-1 border-2 border-black rounded-lg overflow-hidden">
                      {[7, 14, 30].map(d => (
                        <button key={d} onClick={() => setDays(d)}
                          className={`px-3 py-1 text-xs font-bold transition-colors ${days === d ? 'bg-primary-container' : 'hover:bg-surface-container'}`}>
                          {d}D
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={data?.dailyClicks || []}>
                    <defs>
                      <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" tick={{ fontSize: 10, fontWeight: 700 }} tickFormatter={d => d.slice(5)} />
                    <YAxis tick={{ fontSize: 10, fontWeight: 700 }} />
                    <Tooltip contentStyle={{ border: '2px solid black', borderRadius: '8px', fontWeight: 700 }} />
                    <Area type="monotone" dataKey="clicks" stroke="#8b5cf6" strokeWidth={3} fill="url(#colorClicks)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Device + Country */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bento-card p-6">
                  <h3 className="text-lg font-black mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined">devices</span> Device Breakdown
                  </h3>
                  <div className="space-y-3">
                    {deviceData.map(d => (
                      <div key={d.device} className="flex items-center gap-3">
                        <span className="text-sm font-bold w-20 capitalize">{d.device || 'desktop'}</span>
                        <div className="flex-1 h-3 bg-surface-container rounded-full overflow-hidden border border-black">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${(d._count.device / totalDeviceClicks) * 100}%` }}></div>
                        </div>
                        <span className="text-sm font-black w-10 text-right">{Math.round((d._count.device / totalDeviceClicks) * 100)}%</span>
                      </div>
                    ))}
                    {deviceData.length === 0 && <p className="text-sm text-on-surface-variant">No data yet</p>}
                  </div>
                </div>

                <div className="bento-card p-6">
                  <h3 className="text-lg font-black mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined">public</span> Top Countries
                  </h3>
                  <div className="space-y-2">
                    {(data?.countryBreakdown || []).slice(0, 5).map(c => (
                      <div key={c.country} className="flex items-center justify-between p-2 bg-surface rounded-lg border border-black/10">
                        <span className="text-sm font-bold">{c.country || 'Unknown'}</span>
                        <span className="text-sm font-black">{c._count.country}</span>
                      </div>
                    ))}
                    {(data?.countryBreakdown || []).length === 0 && <p className="text-sm text-on-surface-variant">No data yet</p>}
                  </div>
                </div>
              </div>

              {/* Visit History */}
              <div className="bento-card overflow-hidden">
                <div className="p-6 border-b-4 border-black flex justify-between items-center">
                  <h3 className="text-lg font-black">Recent Visit History</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-surface-container border-b-2 border-black">
                      <tr>
                        {['Timestamp', 'Device', 'Browser', 'Country'].map(h => (
                        <th key={h} className="px-6 py-4 text-xs font-black uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5 font-semibold text-sm">
                      {(data?.recentVisits || []).map((visit, i) => (
                        <tr key={i} className="hover:bg-primary-container/20 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">{new Date(visit.timestamp).toLocaleString()}</td>
                        <td className="px-6 py-4 capitalize">{visit.device || 'desktop'}</td>
                        <td className="px-6 py-4">{visit.browser || 'unknown'}</td>
                        <td className="px-6 py-4">{visit.country || 'unknown'}</td>
                        </tr>
                      ))}
                      {(data?.recentVisits || []).length === 0 && (
                        <tr><td colSpan={5} className="px-6 py-8 text-center text-on-surface-variant">No visits yet</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Panel */}
            <aside className="w-full lg:w-80 flex flex-col gap-6">
              <div className="bento-card p-6 bg-primary-container">
                <h4 className="text-sm font-black uppercase tracking-tighter mb-6 opacity-80">Vital Stats</h4>
                <div className="flex flex-col gap-4">
                  <div>
                    <p className="text-xs font-bold opacity-60">Total Clicks</p>
                    <p className="text-4xl font-black">{data?.totalClicks?.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold opacity-60">Last Visited</p>
                    <p className="text-lg font-black">{data?.lastVisited ? new Date(data.lastVisited).toLocaleDateString() : 'Never'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold opacity-60">Created</p>
                    <p className="text-lg font-black">{new Date(data?.url?.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <div className="bento-card p-6">
                <h4 className="text-sm font-black mb-2">Original URL</h4>
                <p className="text-xs text-on-surface-variant break-all">{data?.url?.originalUrl}</p>
              </div>

              <div className="bento-card p-6">
                <h4 className="text-sm font-black mb-2">Short URL</h4>
                <p className="text-primary font-black">{data?.url?.shortUrl}</p>
                {data?.url?.expiresAt && (
                  <p className="text-xs text-error mt-2">Expires: {new Date(data.url.expiresAt).toLocaleDateString()}</p>
                )}
              </div>

              <a href={`/stats/${data?.url?.customAlias || data?.url?.shortCode}`} target="_blank" rel="noreferrer"
                className="bento-card p-4 flex items-center justify-center gap-2 font-black hover:bg-secondary-container transition-colors">
                <span className="material-symbols-outlined">open_in_new</span>
                View Public Stats
              </a>
            </aside>
          </div>
        </div>
      </main>
      {showQR && data?.url && <QRModal url={data.url} onClose={() => setShowQR(false)} />}
    </div>
  );
}