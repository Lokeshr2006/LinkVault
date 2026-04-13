import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { icon: 'dashboard', label: 'Dashboard', path: '/dashboard' },
  { icon: 'analytics', label: 'Analytics', path: '/analytics' },
  { icon: 'settings', label: 'Settings', path: '/settings' },
];

export default function Sidebar() {
  const { pathname } = useLocation();
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path, label) => {
    if (label === 'Analytics') return pathname.startsWith('/analytics');
    return pathname === path;
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-background border-r-4 border-black flex flex-col p-6 z-40">
      <div className="mb-10">
        <h1 className="text-xl font-black text-black">LinkVault</h1>
        <p className="text-xs font-bold text-primary opacity-70 uppercase tracking-widest">
          The Digital Artisan
        </p>
      </div>

      <nav className="flex-1 flex flex-col gap-2">
        {navItems.map(item => (
          <Link
            key={item.label}
            to={item.path}
            className={`flex items-center gap-3 p-3 rounded-xl font-bold transition-all
              ${isActive(item.path, item.label)
                ? 'bg-primary-container border-2 border-black neo-shadow'
                : 'hover:bg-surface-container hover:translate-x-1'
              }`}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="pt-6 border-t-2 border-black/10 space-y-2">
        <div className="p-3 font-bold text-sm truncate text-on-surface-variant">
          {user?.name}
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full p-3 rounded-xl font-bold hover:bg-error-container transition-all text-error"
        >
          <span className="material-symbols-outlined">logout</span>
          Logout
        </button>
      </div>
    </aside>
  );
}