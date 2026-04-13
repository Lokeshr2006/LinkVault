import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Flags = {
  US: () => <svg className="w-5 h-4" viewBox="0 0 640 480"><path fill="#bd3d44" d="M0 0h640v480H0z"/><path stroke="#fff" strokeWidth="37" d="M0 55.4h640M0 129.2h640M0 203h640M0 277h640M0 350.8h640M0 424.6h640"/><path fill="#192f5d" d="M0 0h256v221.5H0z"/><circle cx="128" cy="110" r="80" fill="#fff"/></svg>,
  UK: () => <svg className="w-5 h-4" viewBox="0 0 640 480"><path fill="#012169" d="M0 0h640v480H0z"/><path fill="#fff" d="M0 0l640 480M640 0L0 480" stroke="#fff" strokeWidth="60"/><path stroke="#c8102e" strokeWidth="40" d="M0 0l640 480M640 0L0 480"/><path fill="#fff" d="M320 0v480M0 240h640" stroke="#fff" strokeWidth="100"/><path stroke="#c8102e" strokeWidth="60" d="M320 0v480M0 240h640"/></svg>,
  DE: () => <svg className="w-5 h-4" viewBox="0 0 640 480"><path d="M0 0h640v160H0z"/><path fill="#d00" d="M0 160h640v160H0z"/><path fill="#ffce00" d="M0 320h640v160H0z"/></svg>,
  FR: () => <svg className="w-5 h-4" viewBox="0 0 640 480"><path fill="#fff" d="M0 0h640v480H0z"/><path fill="#002395" d="M0 0h213.3v480H0z"/><path fill="#ed2939" d="M426.7 0H640v480H426.7z"/></svg>
};

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!form.email || !form.password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await authAPI.login(form);
      login(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err) {
      const message = err.response?.data?.error || 'Invalid email or password';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col overflow-x-hidden">
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-8 py-6 bg-transparent">
        <div className="text-2xl font-black text-white tracking-tighter">LinkVault</div>
        <div className="hidden md:flex gap-8 items-center font-bold text-base">
          <Link to="/login" className="text-yellow-700 font-bold underline decoration-4 underline-offset-4">Login</Link>
          <Link to="/register" className="bg-primary text-on-primary px-6 py-2 rounded-xl">Sign Up</Link>
        </div>
      </nav>

      <main className="flex-grow flex flex-col md:flex-row min-h-screen">
        <section className="w-full md:w-1/2 bg-on-background relative flex flex-col justify-center items-center p-12 overflow-hidden">
          <div className="absolute inset-0 dotted-pattern opacity-20"></div>
          <div className="relative z-10 max-w-lg text-center md:text-left">
            <h1 className="text-surface font-black text-5xl md:text-7xl mb-8 tracking-tighter leading-tight">
              Shorten.<br />Share.<br />Track.
            </h1>
            <div className="relative mt-12">
              <div className="w-full h-80 bg-surface-container-low rounded-3xl border-4 border-black relative flex items-center justify-center p-8 overflow-hidden">
                <div className="w-4/5 h-3/5 border-4 border-black rounded-xl bg-white relative">
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[110%] h-4 bg-black rounded-full"></div>
                  <div className="absolute -top-6 -left-6 bg-secondary-container px-4 py-2 rounded-full border-4 border-black font-bold flex items-center gap-2 transform -rotate-12">
                    <Flags.US /> <span className="text-sm">USA</span>
                  </div>
                  <div className="absolute top-10 -right-8 bg-primary-container px-4 py-2 rounded-full border-4 border-black font-bold flex items-center gap-2 transform rotate-6">
                    <Flags.UK /> <span className="text-sm">UK</span>
                  </div>
                  <div className="absolute -bottom-2 -left-4 bg-outline-variant px-4 py-2 rounded-full border-4 border-black font-bold flex items-center gap-2 transform rotate-12">
                    <Flags.DE /> <span className="text-sm">DE</span>
                  </div>
                  <div className="absolute bottom-12 -right-10 bg-secondary-fixed-dim px-4 py-2 rounded-full border-4 border-black font-bold flex items-center gap-2 transform -rotate-6">
                    <Flags.FR /> <span className="text-sm">FR</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full md:w-1/2 bg-background flex items-center justify-center p-8 md:p-24">
          <div className="w-full max-w-md bg-white border-4 border-on-background rounded-[24px] p-8 md:p-12 neo-shadow">
            <header className="mb-10">
              <h2 className="text-3xl font-black text-on-background mb-2">Welcome Back</h2>
              <p className="text-on-surface-variant font-medium">Secure access to your link vault.</p>
            </header>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold uppercase tracking-widest text-on-surface">Email Address</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">mail</span>
                  <input
                    className="w-full bg-surface-container-low border-4 border-on-background rounded-xl py-4 pl-12 pr-4 focus:ring-4 focus:ring-primary-fixed outline-none font-medium"
                    placeholder="name@company.com"
                    type="email"
                    value={form.email}
                    onChange={e => { setForm({ ...form, email: e.target.value }); setError(''); }}
                    onKeyDown={handleKeyDown}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold uppercase tracking-widest text-on-surface">Password</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">lock</span>
                  <input
                    className="w-full bg-surface-container-low border-4 border-on-background rounded-xl py-4 pl-12 pr-4 focus:ring-4 focus:ring-primary-fixed outline-none font-medium"
                    placeholder="••••••••"
                    type="password"
                    value={form.password}
                    onChange={e => { setForm({ ...form, password: e.target.value }); setError(''); }}
                    onKeyDown={handleKeyDown}
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-3 p-4 bg-error-container border-4 border-error rounded-xl">
                  <span className="material-symbols-outlined text-error">error</span>
                  <p className="font-bold text-error text-sm">{error}</p>
                </div>
              )}

              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-[#FDE047] text-on-background border-4 border-on-background rounded-xl py-5 text-lg font-black tracking-tight flex items-center justify-center gap-2 neo-hover neo-active transition-all"
              >
                {loading
                  ? <div className="w-6 h-6 border-4 border-black border-t-transparent rounded-full animate-spin" />
                  : <>Sign In <span className="material-symbols-outlined">arrow_forward</span></>
                }
              </button>
            </div>

            <div className="mt-10 text-center">
              <p className="text-on-surface-variant font-bold">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary underline decoration-2 underline-offset-4">Sign Up</Link>
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
