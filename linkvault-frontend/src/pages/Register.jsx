import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const res = await authAPI.register({ name: form.name, email: form.email, password: form.password });
      login(res.data.token, res.data.user);
      toast.success('Account created!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background font-sans text-on-background min-h-screen">
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-8 py-6 bg-transparent">
        <div className="text-2xl font-black text-slate-900 tracking-tighter">LinkVault</div>
        <Link to="/login" className="text-xs font-bold uppercase tracking-widest text-slate-600 hover:text-yellow-500">Back</Link>
      </header>

      <main className="flex min-h-screen w-full flex-col md:flex-row">
        <section className="hidden md:flex md:w-1/2 bg-inverse-surface relative overflow-hidden flex-col justify-center items-center p-12 dotted-pattern">
          <div className="z-10 text-center space-y-8 max-w-md">
            <h1 className="text-6xl font-black text-white tracking-tighter leading-none italic">
              Shorten.<br />Share.<br />Track.
            </h1>
            <p className="text-white/60 font-medium tracking-wide">The digital artisan's vault for premium link management.</p>
          </div>
        </section>

        <section className="flex-1 flex items-center justify-center p-6 md:p-12 bg-background">
          <div className="w-full max-w-md bg-white border-4 border-on-background rounded-[2rem] p-8 md:p-12 neo-shadow">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-black tracking-tighter mb-2">Create Account</h2>
              <p className="text-on-surface-variant font-medium text-sm">Join the next generation of link creators.</p>
            </div>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface">Full Name</label>
                <input
                  className="w-full px-5 py-4 bg-white border-4 border-on-background rounded-xl focus:ring-8 focus:ring-primary-fixed/30 focus:outline-none font-medium"
                  placeholder="John Doe"
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface">Email Address</label>
                <input
                  className="w-full px-5 py-4 bg-white border-4 border-on-background rounded-xl focus:ring-8 focus:ring-primary-fixed/30 focus:outline-none font-medium"
                  placeholder="john@vault.com"
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface">Password</label>
                  <input
                    className="w-full px-5 py-4 bg-white border-4 border-on-background rounded-xl focus:ring-8 focus:ring-primary-fixed/30 focus:outline-none font-medium"
                    placeholder="••••••••"
                    type="password"
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface">Confirm</label>
                  <input
                    className="w-full px-5 py-4 bg-white border-4 border-on-background rounded-xl focus:ring-8 focus:ring-primary-fixed/30 focus:outline-none font-medium"
                    placeholder="••••••••"
                    type="password"
                    value={form.confirm}
                    onChange={e => setForm({ ...form, confirm: e.target.value })}
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-primary-container text-on-primary-container border-4 border-on-background rounded-xl font-black text-lg neo-hover neo-active transition-all flex items-center justify-center gap-3 mt-4"
              >
                {loading ? <div className="w-6 h-6 border-4 border-black border-t-transparent rounded-full animate-spin" /> : <>Create Account <span className="material-symbols-outlined">arrow_forward</span></>}
              </button>
            </form>
            <div className="mt-10 text-center">
              <p className="text-sm font-medium text-on-surface-variant">
                Already have an account?{' '}
                <Link to="/login" className="text-on-background font-black underline decoration-4 decoration-primary-container underline-offset-4">Log In</Link>
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}