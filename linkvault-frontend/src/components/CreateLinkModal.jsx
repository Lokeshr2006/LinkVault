import { useState } from 'react';
import { urlAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function CreateLinkModal({ onClose, onCreated }) {
  const [form, setForm] = useState({ originalUrl: '', customAlias: '', expiresAt: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = { originalUrl: form.originalUrl };
      if (form.customAlias) data.customAlias = form.customAlias;
      if (form.expiresAt) data.expiresAt = form.expiresAt;
      const res = await urlAPI.create(data);
      toast.success('Short URL created!');
      onCreated(res.data.url);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create URL');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-md z-50 flex items-center justify-center p-6">
      <div className="bg-white border-4 border-black rounded-2xl p-8 neo-shadow w-full max-w-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black">Create New Link</h2>
          <button onClick={onClose} className="p-2 hover:bg-surface-container rounded-full">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest">Long URL *</label>
            <input
              type="url"
              required
              placeholder="https://your-long-url.com/..."
              value={form.originalUrl}
              onChange={e => setForm({ ...form, originalUrl: e.target.value })}
              className="w-full border-4 border-black rounded-xl p-4 font-bold focus:ring-4 focus:ring-primary-fixed outline-none bg-surface-container-low"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest">Custom Alias (optional)</label>
            <div className="flex items-center border-4 border-black rounded-xl overflow-hidden">
              <span className="bg-surface-container px-4 py-4 font-bold text-on-surface-variant border-r-4 border-black text-sm">lvlt.sh/</span>
              <input
                type="text"
                placeholder="my-custom-link"
                value={form.customAlias}
                onChange={e => setForm({ ...form, customAlias: e.target.value })}
                className="flex-1 p-4 font-bold focus:outline-none bg-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest">Expiry Date (optional)</label>
            <input
              type="datetime-local"
              value={form.expiresAt}
              onChange={e => setForm({ ...form, expiresAt: e.target.value })}
              className="w-full border-4 border-black rounded-xl p-4 font-bold focus:ring-4 focus:ring-primary-fixed outline-none bg-surface-container-low"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-container border-4 border-black rounded-xl py-4 font-black text-lg neo-shadow neo-hover neo-active transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-6 h-6 border-4 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span className="material-symbols-outlined">add_link</span>
                Shorten URL
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}