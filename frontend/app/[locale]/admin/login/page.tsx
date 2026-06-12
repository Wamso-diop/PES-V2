'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye, EyeOff, Lock, Mail, CheckCircle, User,
  ArrowRight, Shield, BarChart2, Users, FolderOpen,
} from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL ?? '';

const FEATURES = [
  { Icon: Users,      label: 'Suivi des inscriptions en temps réel'       },
  { Icon: FolderOpen, label: 'Gestion des candidatures enseignants'       },
  { Icon: BarChart2,  label: 'Tableaux de bord et statistiques'           },
  { Icon: Shield,     label: 'Accès sécurisé et journalisé'               },
];

type Tab = 'login' | 'register';

export default function AdminLoginPage() {
  const [tab, setTab]           = useState<Tab>('login');
  const [showPwd, setShowPwd]   = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');
  const router   = useRouter();
  const pathname = usePathname();
  const locale   = pathname.split('/')[1] || 'fr';

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true); setError(''); setSuccess('');
    const form     = e.currentTarget;
    const email    = (form.elements.namedItem('email')    as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) { setError('Email ou mot de passe incorrect.'); return; }
      const { access_token } = await res.json();
      localStorage.setItem('pes_token', access_token);
      localStorage.setItem('pes_admin_email', email);
      router.push(`/${locale}/admin`);
    } catch {
      setError('Erreur de connexion. Vérifiez que le serveur est démarré.');
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true); setError(''); setSuccess('');
    const form        = e.currentTarget;
    const nom         = (form.elements.namedItem('nom')          as HTMLInputElement).value;
    const prenom      = (form.elements.namedItem('prenom')       as HTMLInputElement).value;
    const email       = (form.elements.namedItem('email')        as HTMLInputElement).value;
    const password    = (form.elements.namedItem('password')     as HTMLInputElement).value;
    const code_secret = (form.elements.namedItem('code_secret')  as HTMLInputElement).value;
    try {
      const res = await fetch(`${API}/api/auth/register`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom, prenom, email, password, code_secret }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { setError(data.detail ?? 'Erreur lors de la création du compte.'); return; }
      const { access_token } = data;
      localStorage.setItem('pes_token', access_token);
      localStorage.setItem('pes_admin_email', email);
      router.push(`/${locale}/admin`);
    } catch {
      setError('Erreur de connexion. Vérifiez que le serveur est démarré.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">

      {/* ══ LEFT PANEL ══ */}
      <div
        className="hidden lg:flex lg:w-[460px] flex-col justify-between p-12 relative overflow-hidden flex-shrink-0"
        style={{ background: 'linear-gradient(160deg, #07111f 0%, #0c1a3a 60%, #0f2057 100%)' }}
      >
        {/* Orbs décoratifs */}
        <div className="absolute top-[-80px] right-[-80px] w-[320px] h-[320px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-60px] left-[-60px] w-[280px] h-[280px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.14) 0%, transparent 70%)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.06) 0%, transparent 65%)' }} />

        {/* Logo */}
        <div className="relative">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-4 inline-block border border-white/10">
            <Image src="/images/logo-pes.png" alt="Pôle d'Excellence Scolaire"
              width={160} height={64} className="h-12 w-auto object-contain" priority />
          </div>
        </div>

        {/* Texte central */}
        <div className="relative space-y-6">
          <div>
            <h2 className="font-display font-extrabold text-white leading-tight mb-3"
              style={{ fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)' }}>
              Espace<br />Administration
            </h2>
            <p className="text-blue-200/60 text-sm leading-relaxed max-w-xs">
              Gérez inscriptions, candidatures, contenu et statistiques depuis un seul tableau de bord.
            </p>
          </div>

          {/* Features */}
          <ul className="space-y-3">
            {FEATURES.map(({ Icon, label }) => (
              <li key={label} className="flex items-center gap-3 text-sm"
                style={{ color: 'rgba(147,197,253,0.80)' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.2)' }}>
                  <Icon className="w-3.5 h-3.5 text-blue-400" />
                </div>
                {label}
              </li>
            ))}
          </ul>

          {/* Stats pill */}
          <div className="flex items-center gap-3 pt-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)' }}>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 text-xs font-semibold">Système opérationnel</span>
            </div>
          </div>
        </div>

        <p className="relative text-[11px]" style={{ color: 'rgba(147,197,253,0.25)' }}>
          © {new Date().getFullYear()} Pôle d&apos;Excellence Scolaire — Douala, Cameroun
        </p>
      </div>

      {/* ══ RIGHT PANEL ══ */}
      <div className="flex-1 flex items-center justify-center px-6 py-12" style={{ background: '#f0f4fc' }}>
        <div className="w-full max-w-[420px]">

          {/* Mobile logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <div className="bg-white rounded-2xl px-5 py-4 shadow-lg">
              <Image src="/images/logo-pes.png" alt="PES"
                width={140} height={56} className="h-10 w-auto object-contain" priority />
            </div>
          </div>

          {/* Card */}
          <div className="bg-white rounded-3xl overflow-hidden"
            style={{ boxShadow: '0 8px 48px rgba(15,23,42,0.12), 0 0 0 1px rgba(15,23,42,0.05)' }}>

            {/* Tabs */}
            <div className="flex" style={{ borderBottom: '1.5px solid #f1f5f9' }}>
              {(['login', 'register'] as Tab[]).map(t => (
                <button key={t} onClick={() => { setTab(t); setError(''); setSuccess(''); }}
                  className="flex-1 py-4 text-sm font-bold transition-all relative"
                  style={{ color: tab === t ? '#1d4ed8' : '#94a3b8' }}>
                  {t === 'login' ? 'Connexion' : 'Créer un compte'}
                  {tab === t && (
                    <motion.div layoutId="tab-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                      style={{ background: 'linear-gradient(90deg,#1e40af,#7c3aed)' }} />
                  )}
                </button>
              ))}
            </div>

            <div className="p-8 lg:p-10">

              {/* Error / Success */}
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div key="err"
                    initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="flex items-center gap-2.5 text-sm px-4 py-3 rounded-xl mb-5"
                    style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}>
                    <Lock className="w-4 h-4 flex-shrink-0" />
                    {error}
                  </motion.div>
                )}
                {success && (
                  <motion.div key="ok"
                    initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="flex items-center gap-2.5 text-sm px-4 py-3 rounded-xl mb-5"
                    style={{ background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0' }}>
                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                    {success}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── LOGIN FORM ── */}
              <AnimatePresence mode="wait">
                {tab === 'login' && (
                  <motion.div key="login"
                    initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 16 }} transition={{ duration: 0.2 }}>
                    <div className="mb-7">
                      <h1 className="font-display font-extrabold text-2xl text-slate-900 mb-1">Bon retour 👋</h1>
                      <p className="text-slate-400 text-sm">Connectez-vous à votre espace administrateur.</p>
                    </div>
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div>
                        <label htmlFor="login-email" className="block text-sm font-semibold text-slate-700 mb-1.5">
                          Adresse email
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input id="login-email" name="email" type="email" autoComplete="email" required
                            placeholder="admin@pes-douala.cm"
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-slate-900
                                       placeholder:text-slate-300 focus:outline-none focus:ring-2
                                       focus:ring-blue-400 focus:border-transparent text-sm transition" />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="login-password" className="block text-sm font-semibold text-slate-700 mb-1.5">
                          Mot de passe
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input id="login-password" name="password"
                            type={showPwd ? 'text' : 'password'}
                            autoComplete="current-password" required placeholder="••••••••"
                            className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-slate-900
                                       placeholder:text-slate-300 focus:outline-none focus:ring-2
                                       focus:ring-blue-400 focus:border-transparent text-sm transition" />
                          <button type="button" onClick={() => setShowPwd(!showPwd)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors">
                            {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      <button type="submit" disabled={loading}
                        className="w-full flex items-center justify-center gap-2 text-white font-bold
                                   py-3.5 rounded-xl transition-all hover:opacity-90 disabled:opacity-60 mt-2"
                        style={{ background: 'linear-gradient(135deg,#1e40af,#2563eb)', boxShadow: '0 6px 22px rgba(37,99,235,0.38)' }}>
                        {loading
                          ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          : <ArrowRight className="w-4 h-4" />}
                        {loading ? 'Connexion...' : 'Se connecter'}
                      </button>
                    </form>
                    <p className="text-center text-xs text-slate-400 mt-5">
                      Pas encore de compte ?{' '}
                      <button onClick={() => setTab('register')} className="text-blue-600 font-semibold hover:underline">
                        Créer un compte
                      </button>
                    </p>
                  </motion.div>
                )}

                {/* ── REGISTER FORM ── */}
                {tab === 'register' && (
                  <motion.div key="register"
                    initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }}>
                    <div className="mb-7">
                      <h1 className="font-display font-extrabold text-2xl text-slate-900 mb-1">Créer un compte</h1>
                      <p className="text-slate-400 text-sm">Un code secret est requis pour accéder à l&apos;administration.</p>
                    </div>
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label htmlFor="reg-prenom" className="block text-xs font-semibold text-slate-700 mb-1.5">Prénom</label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                            <input id="reg-prenom" name="prenom" type="text" required placeholder="Marie"
                              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-slate-900
                                         placeholder:text-slate-300 focus:outline-none focus:ring-2
                                         focus:ring-blue-400 focus:border-transparent text-sm transition" />
                          </div>
                        </div>
                        <div>
                          <label htmlFor="reg-nom" className="block text-xs font-semibold text-slate-700 mb-1.5">Nom</label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                            <input id="reg-nom" name="nom" type="text" required placeholder="Dupont"
                              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-slate-900
                                         placeholder:text-slate-300 focus:outline-none focus:ring-2
                                         focus:ring-blue-400 focus:border-transparent text-sm transition" />
                          </div>
                        </div>
                      </div>
                      <div>
                        <label htmlFor="reg-email" className="block text-sm font-semibold text-slate-700 mb-1.5">Adresse email</label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input id="reg-email" name="email" type="email" required placeholder="admin@pes-douala.cm"
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-slate-900
                                       placeholder:text-slate-300 focus:outline-none focus:ring-2
                                       focus:ring-blue-400 focus:border-transparent text-sm transition" />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="reg-password" className="block text-sm font-semibold text-slate-700 mb-1.5">Mot de passe</label>
                        <div className="relative">
                          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input id="reg-password" name="password"
                            type={showPwd ? 'text' : 'password'} required placeholder="Min. 8 caractères"
                            minLength={8}
                            className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-slate-900
                                       placeholder:text-slate-300 focus:outline-none focus:ring-2
                                       focus:ring-blue-400 focus:border-transparent text-sm transition" />
                          <button type="button" onClick={() => setShowPwd(!showPwd)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors">
                            {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label htmlFor="reg-code" className="block text-sm font-semibold text-slate-700 mb-1.5">
                          Code secret
                          <span className="ml-2 text-[10px] font-normal text-slate-400">(fourni par l&apos;équipe PES)</span>
                        </label>
                        <div className="relative">
                          <Shield className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input id="reg-code" name="code_secret" type="password" required placeholder="••••••••••••"
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-slate-900
                                       placeholder:text-slate-300 focus:outline-none focus:ring-2
                                       focus:ring-blue-400 focus:border-transparent text-sm transition" />
                        </div>
                      </div>
                      <button type="submit" disabled={loading}
                        className="w-full flex items-center justify-center gap-2 text-white font-bold
                                   py-3.5 rounded-xl transition-all hover:opacity-90 disabled:opacity-60 mt-2"
                        style={{ background: 'linear-gradient(135deg,#7c3aed,#2563eb)', boxShadow: '0 6px 22px rgba(124,58,237,0.35)' }}>
                        {loading
                          ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          : <CheckCircle className="w-4 h-4" />}
                        {loading ? 'Création...' : 'Créer mon compte'}
                      </button>
                    </form>
                    <p className="text-center text-xs text-slate-400 mt-5">
                      Déjà un compte ?{' '}
                      <button onClick={() => setTab('login')} className="text-blue-600 font-semibold hover:underline">
                        Se connecter
                      </button>
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <p className="text-center text-xs text-slate-400 mt-6">
            Accès réservé aux administrateurs PES
          </p>
        </div>
      </div>
    </div>
  );
}
