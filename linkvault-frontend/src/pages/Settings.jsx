import { useState } from 'react';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import toast from 'react-hot-toast';

export default function Settings() {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState({ name: user?.name || '', email: user?.email || '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      const res = await authAPI.updateProfile(profile);
      updateUser(res.data.user);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirm) {
      toast.error('Passwords do not match');
      return;
    }
    setPasswordLoading(true);
    try {
      await authAPI.updatePassword({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword });
      toast.success('Password updated!');
      setPasswords({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update password');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="bg-background min-h-screen" style={{ backgroundImage: 'radial-gradient(#1b1c1a 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
      <Sidebar />
      <main className="ml-64 p-10">
        <div className="max-w-5xl mx-auto space-y-10">
          <header>
            <h1 className="text-5xl font-black tracking-tighter">Vault <span className="text-primary underline decoration-primary-container decoration-8">Settings</span></h1>
            <p className="text-on-surface-variant font-medium mt-2">Manage your identity and security preferences.</p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Edit Profile */}
            <section className="bg-white border-4 border-black rounded-3xl p-8 neo-shadow-xl flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-4xl text-primary">person_edit</span>
                <h2 className="text-2xl font-black">Edit Profile</h2>
              </div>
              <div className="flex flex-col items-center gap-2 py-4">
                <div className="w-24 h-24 rounded-full border-4 border-black bg-primary-container flex items-center justify-center">
                  <span className="text-3xl font-black">{user?.name?.[0]?.toUpperCase()}</span>
                </div>
              </div>
              <form onSubmit={handleProfileSave} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-black uppercase tracking-tight">Full Name</label>
                  <input
                    className="w-full bg-surface-container border-2 border-black rounded-xl p-4 font-bold focus:ring-4 focus:ring-primary-fixed outline-none"
                    value={profile.name}
                    onChange={e => setProfile({ ...profile, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-black uppercase tracking-tight">Email Address</label>
                  <input
                    type="email"
                    className="w-full bg-surface-container border-2 border-black rounded-xl p-4 font-bold focus:ring-4 focus:ring-primary-fixed outline-none"
                    value={profile.email}
                    onChange={e => setProfile({ ...profile, email: e.target.value })}
                    required
                  />
                </div>
                <button type="submit" disabled={profileLoading}
                  className="mt-4 bg-primary-container border-4 border-black rounded-xl py-4 px-8 font-black neo-shadow neo-hover neo-active transition-all flex items-center gap-2">
                  {profileLoading ? <div className="w-5 h-5 border-4 border-black border-t-transparent rounded-full animate-spin" /> : <><span className="material-symbols-outlined">save</span> Save Changes</>}
                </button>
              </form>
            </section>

            {/* Security */}
            <section className="bg-white border-4 border-black rounded-3xl p-8 neo-shadow-xl flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-4xl text-primary">verified_user</span>
                <h2 className="text-2xl font-black">Security</h2>
              </div>
              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                {[
                  { label: 'Current Password', key: 'currentPassword' },
                  { label: 'New Password', key: 'newPassword' },
                  { label: 'Confirm Password', key: 'confirm' },
                ].map(field => (
                  <div key={field.key} className="space-y-2">
                    <label className="text-sm font-black uppercase tracking-tight">{field.label}</label>
                    <input
                      type="password"
                      className="w-full bg-surface-container border-2 border-black rounded-xl p-4 font-bold focus:ring-4 focus:ring-primary-fixed outline-none"
                      placeholder="••••••••"
                      value={passwords[field.key]}
                      onChange={e => setPasswords({ ...passwords, [field.key]: e.target.value })}
                      required
                    />
                  </div>
                ))}
                <div className="bg-secondary-container/30 border-2 border-black border-dashed rounded-xl p-4 flex gap-3 items-start">
                  <span className="material-symbols-outlined text-secondary">info</span>
                  <p className="text-xs font-bold leading-relaxed">Password must be at least 6 characters.</p>
                </div>
                <button type="submit" disabled={passwordLoading}
                  className="mt-auto bg-primary-container border-4 border-black rounded-xl py-4 px-8 font-black neo-shadow neo-hover neo-active transition-all flex items-center gap-2">
                  {passwordLoading ? <div className="w-5 h-5 border-4 border-black border-t-transparent rounded-full animate-spin" /> : <><span className="material-symbols-outlined">lock_reset</span> Update Password</>}
                </button>
              </form>
            </section>
          </div>

          <footer className="pt-10 pb-6 text-center">
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Handcrafted with care • LinkVault v1.0.0</p>
            <p className="text-xs font-bold text-on-surface-variant mt-1">This project is a part of a hackathon run by https://katomaran.com</p>
          </footer>
        </div>
      </main>
    </div>
  );
}