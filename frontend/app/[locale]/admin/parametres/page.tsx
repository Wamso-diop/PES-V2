'use client';

import { useEffect, useState, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Save, Eye, EyeOff, CheckCircle2, Globe, Bell,
  Shield, Mail, User, Phone, Target, Search,
  AlertCircle, Loader2, Lock, Building2, Calendar,
} from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL ?? '';
const FETCH_TIMEOUT = 12000; // 12s max

/* ── Fetch avec timeout ── */
async function fetchWithTimeout(url: string, opts: RequestInit = {}): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
  try {
    const res = await fetch(url, { ...opts, signal: controller.signal });
    clearTimeout(id);
    return res;
  } catch (err) {
    clearTimeout(id);
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error('Délai dépassé — vérifiez que le serveur backend est démarré.');
    }
    throw err;
  }
}

/* ── Types ── */
interface AdminProfile { id: string; email: string; nom: string; prenom: string; created_at: string; }
interface SiteSettings {
  site_name: string; contact_email: string; whatsapp: string; inscription_goal: number;
  meta_title: string; meta_description: string; site_url: string;
}

/* ── Sub-components ── */
const inputCls = `w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm
  placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100
  focus:border-blue-400 bg-white transition-all`;

function Card({ title, icon: Icon, accent, children }: {
  title: string; icon: React.ElementType; accent: string; children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden"
      style={{ border: '1.5px solid #e8eef8', boxShadow: '0 2px 16px rgba(15,23,42,0.05)' }}>
      <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl" style={{ background: accent }} />
      <div className="px-6 py-4 flex items-center gap-3"
        style={{ borderBottom: '1px solid #f1f5f9', background: '#fafbff' }}>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${accent.slice(0, 7)}18` }}>
          <Icon className="w-4 h-4" style={{ color: accent }} />
        </div>
        <h2 className="font-bold text-slate-800 text-sm">{title}</h2>
      </div>
      <div className="relative overflow-hidden px-6 py-5">{children}</div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="mb-4 last:mb-0">
      <label className="block text-xs font-bold text-slate-700 mb-1.5">{label}</label>
      {hint && <p className="text-[11px] text-slate-400 mb-1.5 leading-relaxed">{hint}</p>}
      {children}
    </div>
  );
}

function Btn({ loading, onClick, label = 'Enregistrer', color = '#1e40af' }: {
  loading: boolean; onClick: () => void; label?: string; color?: string;
}) {
  return (
    <button onClick={onClick} disabled={loading}
      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-60"
      style={{ background: `linear-gradient(135deg,${color},${color}cc)`, boxShadow: `0 4px 14px ${color}33` }}>
      {loading
        ? <><Loader2 className="w-4 h-4 animate-spin" /> Enregistrement...</>
        : <><Save className="w-4 h-4" /> {label}</>}
    </button>
  );
}

function Toggle({ value, onChange }: { value: boolean; onChange: () => void }) {
  return (
    <button type="button" onClick={onChange}
      className="w-11 h-6 rounded-full relative transition-all duration-200 flex-shrink-0"
      style={{ background: value ? '#2563eb' : '#e2e8f0' }}>
      <span className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-200"
        style={{ left: value ? '1.375rem' : '0.125rem' }} />
    </button>
  );
}

/* ── Toast (coin haut-droit) ── */
function Toast({ type, msg, onClose }: { type: 'success' | 'error'; msg: string; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 5000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className="fixed top-6 right-6 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-semibold shadow-2xl"
      style={{
        background: type === 'success' ? '#f0fdf4' : '#fef2f2',
        border: `1.5px solid ${type === 'success' ? '#bbf7d0' : '#fecaca'}`,
        color: type === 'success' ? '#15803d' : '#dc2626',
        minWidth: 260,
      }}>
      {type === 'success'
        ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
        : <AlertCircle   className="w-4 h-4 flex-shrink-0" />}
      <span className="flex-1">{msg}</span>
      <button onClick={onClose} className="ml-2 opacity-50 hover:opacity-100 text-lg leading-none">×</button>
    </div>
  );
}

/* ══════════════ PAGE ══════════════ */
export default function ParametresPage() {
  const pathname = usePathname();
  const router   = useRouter();
  const locale   = pathname.split('/')[1] || 'fr';

  const [token, setToken] = useState('');
  const [toast,  setToast]  = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const showToast = useCallback((type: 'success' | 'error', msg: string) => setToast({ type, msg }), []);

  useEffect(() => {
    const t = localStorage.getItem('pes_token');
    if (!t) { router.replace(`/${locale}/admin/login`); return; }
    setToken(t);
  }, [locale, router]);

  /* ─────────── PROFIL ─────────── */
  const [profile,  setProfile]  = useState<AdminProfile | null>(null);
  const [pForm,    setPForm]    = useState({ nom: '', prenom: '', email: '' });
  const [pLoading, setPLoading] = useState(false);

  useEffect(() => {
    if (!token) return;
    fetchWithTimeout(`${API}/api/admin/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) {
          setProfile(data);
          setPForm({ nom: data.nom ?? '', prenom: data.prenom ?? '', email: data.email ?? '' });
        }
      })
      .catch(() => {});
  }, [token]);

  async function saveProfile() {
    setPLoading(true);
    try {
      const res = await fetchWithTimeout(`${API}/api/admin/me`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom:    pForm.nom.trim()    || undefined,
          prenom: pForm.prenom.trim() || undefined,
          email:  pForm.email.trim()  || undefined,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        showToast('error', err.detail ?? 'Erreur lors de la mise à jour du profil');
      } else {
        const updated = await res.json();
        setProfile(p => ({ ...p!, ...updated }));
        localStorage.setItem('pes_admin_email', updated.email);
        showToast('success', 'Profil mis à jour avec succès');
      }
    } catch (e: unknown) {
      showToast('error', e instanceof Error ? e.message : 'Erreur réseau');
    } finally {
      setPLoading(false);
    }
  }

  /* ─────────── MOT DE PASSE ─────────── */
  const [pwForm,    setPwForm]    = useState({ current: '', next: '', confirm: '' });
  const [showPwd,   setShowPwd]   = useState({ current: false, next: false });
  const [pwLoading, setPwLoading] = useState(false);

  async function changePassword() {
    if (!pwForm.current.trim()) { showToast('error', 'Saisissez votre mot de passe actuel'); return; }
    if (pwForm.next.length < 8)  { showToast('error', 'Le nouveau mot de passe doit faire au moins 8 caractères'); return; }
    if (pwForm.next !== pwForm.confirm) { showToast('error', 'Les mots de passe ne correspondent pas'); return; }
    setPwLoading(true);
    try {
      const res = await fetchWithTimeout(`${API}/api/admin/change-password`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ current_password: pwForm.current, new_password: pwForm.next }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        showToast('error', err.detail ?? 'Erreur lors du changement de mot de passe');
      } else {
        showToast('success', 'Mot de passe modifié avec succès');
        setPwForm({ current: '', next: '', confirm: '' });
      }
    } catch (e: unknown) {
      showToast('error', e instanceof Error ? e.message : 'Erreur réseau');
    } finally {
      setPwLoading(false);
    }
  }

  /* ─────────── SITE SETTINGS ─────────── */
  const [site,       setSite]       = useState<SiteSettings>({
    site_name: 'Pôle d\'Excellence Scolaire',
    contact_email: 'contact@pes-douala.cm',
    whatsapp: '+237 6XX XXX XXX',
    inscription_goal: 200,
    meta_title: 'PES — Pôle d\'Excellence Scolaire Douala',
    meta_description: 'Soutien scolaire à Douala. Cours à domicile, coaching pédagogique.',
    site_url: 'https://pes-douala.cm',
  });
  const [siteLoading, setSiteLoading] = useState(false);
  const [siteReady,   setSiteReady]   = useState(false);

  useEffect(() => {
    if (!token) return;
    fetchWithTimeout(`${API}/api/admin/settings`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data && Object.keys(data).length > 0) setSite(prev => ({ ...prev, ...data }));
        setSiteReady(true);
      })
      .catch(() => setSiteReady(true));
  }, [token]);

  async function saveSiteSettings() {
    setSiteLoading(true);
    try {
      const res = await fetchWithTimeout(`${API}/api/admin/settings`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(site),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        showToast('error', err.detail ?? 'Erreur lors de la sauvegarde');
      } else {
        const updated = await res.json();
        setSite(prev => ({ ...prev, ...updated }));
        showToast('success', 'Paramètres du site enregistrés');
      }
    } catch (e: unknown) {
      showToast('error', e instanceof Error ? e.message : 'Erreur réseau');
    } finally {
      setSiteLoading(false);
    }
  }

  /* ─────────── NOTIFICATIONS (localStorage) ─────────── */
  const [notifs, setNotifs] = useState({ email: true, inscription: true, candidature: true });
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('pes_notifs') || '{}');
      setNotifs(p => ({ ...p, ...saved }));
    } catch { /* ignore */ }
  }, []);
  function toggleNotif(key: keyof typeof notifs) {
    const updated = { ...notifs, [key]: !notifs[key] };
    setNotifs(updated);
    localStorage.setItem('pes_notifs', JSON.stringify(updated));
    showToast('success', 'Préférence mise à jour');
  }

  /* ── Strength ── */
  const pwStrength = pwForm.next.length === 0 ? null
    : pwForm.next.length < 8 ? { label: 'Faible', color: '#dc2626', pct: 33 }
    : pwForm.next.length < 12 ? { label: 'Moyen',  color: '#b45309', pct: 66 }
    : { label: 'Fort',  color: '#15803d', pct: 100 };

  /* ══════════ RENDER ══════════ */
  return (
    <div className="w-full space-y-5">

      {toast && <Toast type={toast.type} msg={toast.msg} onClose={() => setToast(null)} />}

      {/* ══ ROW 1 : Profil | Sécurité ══ */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

        {/* Profil */}
        <div className="relative">
          <Card title="Profil administrateur" icon={User} accent="#2563eb">
            <div className="grid grid-cols-2 gap-3 mb-3">
              <Field label="Prénom">
                <input type="text" className={inputCls} placeholder="Prénom"
                  value={pForm.prenom}
                  onChange={e => setPForm(p => ({ ...p, prenom: e.target.value }))} />
              </Field>
              <Field label="Nom">
                <input type="text" className={inputCls} placeholder="Nom de famille"
                  value={pForm.nom}
                  onChange={e => setPForm(p => ({ ...p, nom: e.target.value }))} />
              </Field>
            </div>
            <Field label="Adresse email" hint="Utilisée pour la connexion à l'espace admin.">
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="email" className={`${inputCls} pl-10`} placeholder="admin@pes-douala.cm"
                  value={pForm.email}
                  onChange={e => setPForm(p => ({ ...p, email: e.target.value }))} />
              </div>
            </Field>
            {profile?.created_at && (
              <p className="text-[11px] text-slate-400 flex items-center gap-1 mb-4">
                <Calendar className="w-3 h-3" />
                Compte créé le {new Date(profile.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
              </p>
            )}
            <div className="flex justify-end">
              <Btn loading={pLoading} onClick={saveProfile} label="Mettre à jour le profil" color="#1e40af" />
            </div>
          </Card>
        </div>

        {/* Sécurité */}
        <div className="relative">
          <Card title="Changer le mot de passe" icon={Lock} accent="#7c3aed">
            <Field label="Mot de passe actuel">
              <div className="relative">
                <Shield className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type={showPwd.current ? 'text' : 'password'}
                  className={`${inputCls} pl-10 pr-11`} placeholder="••••••••"
                  value={pwForm.current}
                  onChange={e => setPwForm(p => ({ ...p, current: e.target.value }))} />
                <button type="button"
                  onClick={() => setShowPwd(p => ({ ...p, current: !p.current }))}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors">
                  {showPwd.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Nouveau mot de passe" hint="Min. 8 caractères.">
                <div className="relative">
                  <input type={showPwd.next ? 'text' : 'password'}
                    className={`${inputCls} pr-11`} placeholder="••••••••"
                    value={pwForm.next}
                    onChange={e => setPwForm(p => ({ ...p, next: e.target.value }))} />
                  <button type="button"
                    onClick={() => setShowPwd(p => ({ ...p, next: !p.next }))}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors">
                    {showPwd.next ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </Field>
              <Field label="Confirmer">
                <input type="password"
                  className={`${inputCls} ${pwForm.confirm && pwForm.next !== pwForm.confirm ? 'border-red-300 focus:border-red-400' : ''}`}
                  placeholder="••••••••"
                  value={pwForm.confirm}
                  onChange={e => setPwForm(p => ({ ...p, confirm: e.target.value }))} />
                {pwForm.confirm && pwForm.next !== pwForm.confirm && (
                  <p className="text-[11px] text-red-500 mt-1">Ne correspond pas</p>
                )}
              </Field>
            </div>
            {pwStrength && (
              <div className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="text-[11px] text-slate-400">Force</span>
                  <span className="text-[11px] font-bold" style={{ color: pwStrength.color }}>{pwStrength.label}</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${pwStrength.pct}%`, background: pwStrength.color }} />
                </div>
              </div>
            )}
            <div className="flex justify-end">
              <Btn loading={pwLoading} onClick={changePassword} label="Changer le mot de passe" color="#7c3aed" />
            </div>
          </Card>
        </div>
      </div>

      {/* ══ ROW 2 : Config site | SEO ══ */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

        {/* Config site */}
        <div className="relative">
          <Card title="Configuration du site" icon={Building2} accent="#b45309">
            {!siteReady ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-slate-300" />
              </div>
            ) : (
              <>
                <Field label="Nom du site">
                  <input type="text" className={inputCls} placeholder="Pôle d'Excellence Scolaire"
                    value={site.site_name}
                    onChange={e => setSite(p => ({ ...p, site_name: e.target.value }))} />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Email de contact public">
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input type="email" className={`${inputCls} pl-10`} placeholder="contact@pes-douala.cm"
                        value={site.contact_email}
                        onChange={e => setSite(p => ({ ...p, contact_email: e.target.value }))} />
                    </div>
                  </Field>
                  <Field label="WhatsApp">
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input type="tel" className={`${inputCls} pl-10`} placeholder="+237 6XX XXX XXX"
                        value={site.whatsapp}
                        onChange={e => setSite(p => ({ ...p, whatsapp: e.target.value }))} />
                    </div>
                  </Field>
                </div>
                <Field label="Objectif inscriptions" hint="Barre de progression sur le dashboard.">
                  <div className="relative">
                    <Target className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="number" min={1} className={`${inputCls} pl-10`}
                      value={site.inscription_goal}
                      onChange={e => setSite(p => ({ ...p, inscription_goal: parseInt(e.target.value) || 200 }))} />
                  </div>
                </Field>
                <div className="flex justify-end">
                  <Btn loading={siteLoading} onClick={saveSiteSettings} label="Enregistrer" color="#b45309" />
                </div>
              </>
            )}
          </Card>
        </div>

        {/* SEO */}
        <div className="relative">
          <Card title="SEO & Métadonnées" icon={Search} accent="#1d4ed8">
            {!siteReady ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-slate-300" />
              </div>
            ) : (
              <>
                <Field label="Titre meta">
                  <input type="text" className={inputCls} placeholder="PES — Pôle d'Excellence Scolaire Douala"
                    value={site.meta_title}
                    onChange={e => setSite(p => ({ ...p, meta_title: e.target.value }))} />
                  <p className="text-[11px] mt-1" style={{ color: site.meta_title.length > 60 ? '#dc2626' : '#94a3b8' }}>
                    {site.meta_title.length}/60 caractères
                  </p>
                </Field>
                <Field label="Description meta">
                  <textarea rows={4} className={`${inputCls} resize-none`}
                    placeholder="Soutien scolaire à Douala. Cours à domicile, coaching pédagogique."
                    value={site.meta_description}
                    onChange={e => setSite(p => ({ ...p, meta_description: e.target.value }))} />
                  <p className="text-[11px] mt-1" style={{ color: site.meta_description.length > 160 ? '#dc2626' : '#94a3b8' }}>
                    {site.meta_description.length}/160 caractères
                  </p>
                </Field>
                <Field label="URL du site">
                  <div className="relative">
                    <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="url" className={`${inputCls} pl-10`} placeholder="https://pes-douala.cm"
                      value={site.site_url}
                      onChange={e => setSite(p => ({ ...p, site_url: e.target.value }))} />
                  </div>
                </Field>
                <div className="flex justify-end">
                  <Btn loading={siteLoading} onClick={saveSiteSettings} label="Enregistrer le SEO" color="#1d4ed8" />
                </div>
              </>
            )}
          </Card>
        </div>
      </div>

      {/* ══ ROW 3 : Notifications pleine largeur ══ */}
      <div className="relative">
        <Card title="Notifications" icon={Bell} accent="#059669">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-slate-50">
            {([
              { key: 'email',       label: 'Notifications activées',  sub: 'Activer ou désactiver toutes les alertes' },
              { key: 'inscription', label: 'Nouvelle inscription',     sub: 'Alerte quand un parent s\'inscrit'        },
              { key: 'candidature', label: 'Nouvelle candidature',     sub: 'Alerte quand un enseignant postule'       },
            ] as const).map(({ key, label, sub }) => (
              <div key={key} className="flex items-center justify-between px-4 py-4 gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-700 truncate">{label}</p>
                  <p className="text-xs text-slate-400 mt-0.5 truncate">{sub}</p>
                </div>
                <Toggle value={notifs[key]} onChange={() => toggleNotif(key)} />
              </div>
            ))}
          </div>
          <p className="text-[11px] text-slate-400 pt-3 mt-3 italic"
            style={{ borderTop: '1px solid #f1f5f9' }}>
            Préférences sauvegardées dans ce navigateur uniquement.
          </p>
        </Card>
      </div>

      {/* ══ NOTE MIGRATION SQL ══ */}
      {!siteReady && (
        <div className="flex items-start gap-3 px-5 py-4 rounded-2xl text-sm"
          style={{ background: '#fffbeb', border: '1.5px solid #fcd34d', color: '#b45309' }}>
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Migration SQL requise</p>
            <p className="text-xs mt-0.5 opacity-80">
              Exécutez <code className="bg-amber-100 px-1 rounded">backend/migration_settings.sql</code> dans Supabase → SQL Editor pour activer la sauvegarde des paramètres du site.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
