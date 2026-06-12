'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  LayoutDashboard, Users, BarChart2, FolderOpen,
  Settings, LogOut, Bell,
} from 'lucide-react';

const NAV = [
  { seg: 'admin',             label: 'Dashboard',     Icon: LayoutDashboard, exact: true  },
  { seg: 'admin/utilisateurs',label: 'Utilisateurs',  Icon: Users,           dot: true    },
  { seg: 'admin/stats',       label: 'Stats',         Icon: BarChart2                      },
  { seg: 'admin/gestion',     label: 'Gestion',       Icon: FolderOpen,      dot: true    },
  { seg: 'admin/parametres',  label: 'Paramètres',    Icon: Settings                       },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname  = usePathname();
  const router    = useRouter();
  const [ready, setReady]           = useState(false);
  const [adminEmail, setAdminEmail] = useState('admin@pes-douala.cm');

  const locale      = pathname.split('/')[1] || 'fr';
  const isLoginPage = pathname.includes('/admin/login');

  useEffect(() => {
    if (isLoginPage) { setReady(true); return; }
    const token = localStorage.getItem('pes_token');
    if (!token) { router.replace(`/${locale}/admin/login`); return; }
    const email = localStorage.getItem('pes_admin_email');
    if (email) setAdminEmail(email);
    setReady(true);
  }, [isLoginPage, locale, router]);

  /* ── login page: no sidebar ── */
  if (isLoginPage) return <>{children}</>;

  /* ── auth loading spinner ── */
  if (!ready) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#f8faff' }}>
      <div className="w-9 h-9 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
    </div>
  );

  /* ── helpers ── */
  function isActive(seg: string, exact = false) {
    const full = `/${locale}/${seg}`;
    return exact ? pathname === full : pathname.startsWith(full);
  }

  function logout() {
    localStorage.removeItem('pes_token');
    localStorage.removeItem('pes_admin_email');
    router.push(`/${locale}/admin/login`);
  }

  const pageLabel = NAV.find(n => isActive(n.seg, n.exact))?.label ?? 'Admin';

  /* ── initials from email ── */
  const initials = adminEmail.slice(0, 2).toUpperCase();

  return (
    <div className="flex min-h-screen" style={{ background: '#f0f4fc' }}>

      {/* ══ SIDEBAR ══ */}
      <aside
        className="w-[220px] flex-shrink-0 fixed inset-y-0 left-0 flex flex-col z-30"
        style={{ background: 'linear-gradient(180deg, #07111f 0%, #0c1a3a 100%)' }}
      >
        {/* Logo */}
        <div className="px-5 pt-6 pb-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0 bg-white">
              <Image
                src="/images/logo-pes.png"
                alt="PES"
                width={36}
                height={36}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <p className="text-white font-extrabold text-[13px] leading-none">PES</p>
              <p className="text-[10px] mt-0.5 leading-none" style={{ color: 'rgba(147,197,253,0.50)' }}>
                Administration
              </p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 pt-5 space-y-0.5">
          <p
            className="text-[9.5px] font-bold uppercase tracking-[0.18em] px-3 mb-3"
            style={{ color: 'rgba(147,197,253,0.35)' }}
          >
            Menu
          </p>
          {NAV.map(({ seg, label, Icon, exact, dot }) => {
            const active = isActive(seg, exact);
            return (
              <Link
                key={seg}
                href={`/${locale}/${seg}`}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium
                           transition-all duration-150 relative group"
                style={{
                  background:   active ? 'rgba(59,130,246,0.18)' : 'transparent',
                  color:        active ? '#ffffff' : 'rgba(147,197,253,0.65)',
                  borderLeft:   active ? '3px solid #3b82f6' : '3px solid transparent',
                }}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{label}</span>
                {dot && !active && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Admin user */}
        <div className="px-4 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs
                         text-white flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)' }}
            >
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-[12px] font-semibold leading-none">Admin</p>
              <p className="text-[10px] mt-0.5 truncate" style={{ color: 'rgba(147,197,253,0.45)' }}>
                {adminEmail}
              </p>
            </div>
            <button
              onClick={logout}
              className="flex-shrink-0 transition-colors hover:text-white"
              style={{ color: 'rgba(147,197,253,0.40)' }}
              title="Déconnexion"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ══ MAIN CONTENT ══ */}
      <div className="ml-[220px] flex-1 flex flex-col min-h-screen">

        {/* Top bar */}
        <header
          className="bg-white flex-shrink-0 sticky top-0 z-20 px-7 py-3.5
                     flex items-center justify-between"
          style={{ borderBottom: '1px solid #e8eef8', boxShadow: '0 1px 4px rgba(15,23,42,0.05)' }}
        >
          <h1 className="font-bold text-slate-800 text-[15px]">{pageLabel}</h1>
          <div className="flex items-center gap-3">
            <button
              className="relative w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-slate-100"
              style={{ color: '#94a3b8' }}
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500" />
            </button>
            <span
              className="text-[11px] font-bold px-2.5 py-1 rounded-lg border border-slate-200 text-slate-500"
            >
              FR
            </span>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white"
              style={{ background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)' }}
            >
              {initials}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 lg:p-8 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
