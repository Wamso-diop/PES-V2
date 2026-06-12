'use client';

import { useEffect, useState, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  TrendingUp, TrendingDown, Users, UserCheck,
  Activity, GraduationCap, BarChart2, Zap,
} from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL ?? '';

/* ── Types ── */
interface Inscription {
  id: string; statut: string; created_at: string;
  niveau_eleve?: string; classe_souhaitee?: string;
}
interface Candidature {
  id: string; statut: string; created_at: string;
  niveau_service?: string; poste_vise?: string;
}

/* ── Helpers ── */
function fmtPct(n: number, total: number) {
  return total > 0 ? `${((n / total) * 100).toFixed(1)}%` : '0%';
}

function calcTrend(arr: { created_at: string }[]): number | null {
  const now = new Date();
  const cur = arr.filter(x => {
    const d = new Date(x.created_at);
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  }).length;
  const prev = arr.filter(x => {
    const d = new Date(x.created_at);
    const pm = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    return d.getFullYear() === pm.getFullYear() && d.getMonth() === pm.getMonth();
  }).length;
  if (prev === 0) return cur > 0 ? 100 : null;
  return Math.round(((cur - prev) / prev) * 100);
}

function monthLabel(offset: number) {
  const d = new Date();
  d.setMonth(d.getMonth() - offset);
  return d.toLocaleDateString('fr-FR', { month: 'short' });
}

/* ── Sub-components ── */

function TrendChip({ value }: { value: number | null }) {
  if (value === null) return null;
  const up = value >= 0;
  return (
    <div className="flex items-center gap-1 text-[11px] font-bold"
      style={{ color: up ? '#15803d' : '#dc2626' }}>
      {up ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
      {up ? '+' : ''}{value}% vs mois préc.
    </div>
  );
}

function KpiCard({
  label, value, sub, Icon, grad, light, textColor, trend,
}: {
  label: string; value: string | number; sub: string;
  Icon: React.ElementType; grad: string; light: string; textColor: string;
  trend: number | null;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 relative overflow-hidden"
      style={{ border: '1.5px solid #e8eef8', boxShadow: '0 2px 16px rgba(15,23,42,0.05)' }}>
      <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl" style={{ background: grad }} />
      <div className="flex items-start justify-between mt-1 mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: light }}>
          <Icon className="w-5 h-5" style={{ color: textColor }} />
        </div>
        <TrendChip value={trend} />
      </div>
      <p className="font-extrabold text-[28px] text-slate-900 leading-none">{value}</p>
      <p className="text-slate-500 text-xs font-semibold mt-1">{label}</p>
      <p className="text-[11px] mt-1.5" style={{ color: textColor }}>{sub}</p>
    </div>
  );
}

function FunnelRow({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
  const pct = total > 0 ? (value / total) * 100 : 0;
  return (
    <div className="mb-4 last:mb-0">
      <div className="flex justify-between text-xs mb-1.5">
        <span className="font-semibold text-slate-700">{label}</span>
        <span className="font-bold" style={{ color }}>{value}
          <span className="text-slate-400 font-normal ml-1">({pct.toFixed(0)}%)</span>
        </span>
      </div>
      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-2.5 rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

function PipelineRow({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
  const pct = total > 0 ? (value / total) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 w-28 flex-shrink-0">
        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
        <span className="text-xs font-medium text-slate-600 truncate">{label}</span>
      </div>
      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-2 rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-xs font-bold text-slate-700 w-6 text-right flex-shrink-0">{value}</span>
    </div>
  );
}

function GroupedBarChart({
  labels, series,
}: {
  labels: string[];
  series: { label: string; color: string; data: number[] }[];
}) {
  const max = Math.max(...series.flatMap(s => s.data), 1);
  const H = 100;
  return (
    <div>
      {/* Legend */}
      <div className="flex items-center gap-4 mb-4">
        {series.map(s => (
          <div key={s.label} className="flex items-center gap-1.5">
            <div className="w-3 h-1.5 rounded-full" style={{ background: s.color }} />
            <span className="text-[11px] text-slate-500 font-medium">{s.label}</span>
          </div>
        ))}
      </div>
      <div className="flex items-end gap-2" style={{ height: `${H + 24}px` }}>
        {labels.map((lbl, i) => (
          <div key={lbl} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full flex items-end gap-0.5">
              {series.map(s => (
                <div key={s.label} className="flex-1 rounded-t-md transition-all duration-700"
                  style={{
                    height: `${Math.max(Math.round((s.data[i] / max) * H), s.data[i] > 0 ? 4 : 0)}px`,
                    background: s.color,
                  }} />
              ))}
            </div>
            <span className="text-[9px] text-slate-400 mt-1">{lbl}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Page ── */
export default function StatsPage() {
  const pathname = usePathname();
  const router   = useRouter();
  const locale   = pathname.split('/')[1] || 'fr';

  const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
  const [candidatures, setCandidatures] = useState<Candidature[]>([]);
  const [loaded,       setLoaded]       = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('pes_token');
    if (!token) { router.replace(`/${locale}/admin/login`); return; }
    const h = { Authorization: `Bearer ${token}` };
    Promise.all([
      fetch(`${API}/api/inscriptions`, { headers: h }).then(r => r.json()).catch(() => []),
      fetch(`${API}/api/candidatures`, { headers: h }).then(r => r.json()).catch(() => []),
    ]).then(([i, c]) => {
      setInscriptions(Array.isArray(i) ? i : []);
      setCandidatures(Array.isArray(c) ? c : []);
      setLoaded(true);
    });
  }, [locale, router]);

  /* ── Derived ── */
  const insc = inscriptions;
  const cand = candidatures;
  const total = insc.length + cand.length;

  const inscConverti = insc.filter(x => x.statut === 'converti').length;
  const inscContacte = insc.filter(x => x.statut === 'contacté').length;
  const inscNouv     = insc.filter(x => x.statut === 'nouveau').length;
  const inscArchive  = insc.filter(x => x.statut === 'archivé').length;

  const candAccepte = cand.filter(x => x.statut === 'accepté').length;
  const candRefuse  = cand.filter(x => x.statut === 'refusé').length;
  const candEnCours = cand.filter(x => !['accepté','refusé'].includes(x.statut)).length;

  const inscTrend  = useMemo(() => calcTrend(insc), [insc]);
  const candTrend  = useMemo(() => calcTrend(cand), [cand]);
  const convRate   = insc.length > 0 ? ((inscConverti / insc.length) * 100).toFixed(1) : '0';

  /* Monthly chart — last 6 months */
  const { labels: monthLabels, inscSeries, candSeries } = useMemo(() => {
    const now = new Date();
    const labels: string[] = [];
    const inscS: number[]  = [];
    const candS: number[]  = [];
    for (let k = 5; k >= 0; k--) {
      const d = new Date(now.getFullYear(), now.getMonth() - k, 1);
      labels.push(d.toLocaleDateString('fr-FR', { month: 'short' }));
      inscS.push(insc.filter(x => {
        const c = new Date(x.created_at);
        return c.getFullYear() === d.getFullYear() && c.getMonth() === d.getMonth();
      }).length);
      candS.push(cand.filter(x => {
        const c = new Date(x.created_at);
        return c.getFullYear() === d.getFullYear() && c.getMonth() === d.getMonth();
      }).length);
    }
    return { labels, inscSeries: inscS, candSeries: candS };
  }, [insc, cand]);

  /* Plans (niveau_service on candidatures) */
  const planData = useMemo(() => [
    { label: 'Elite',    value: cand.filter(x => x.niveau_service?.toLowerCase() === 'elite').length,    color: '#b45309' },
    { label: 'Premium',  value: cand.filter(x => x.niveau_service?.toLowerCase() === 'premium').length,  color: '#1d4ed8' },
    { label: 'Standard', value: cand.filter(x => x.niveau_service?.toLowerCase() === 'standard').length, color: '#7c3aed' },
    { label: 'Social',   value: cand.filter(x => x.niveau_service?.toLowerCase() === 'social').length,   color: '#15803d' },
  ], [cand]);

  /* Niveaux élèves (top 5) */
  const niveauData = useMemo(() => {
    const counts: Record<string, number> = {};
    insc.forEach(x => {
      const n = x.niveau_eleve?.trim() || 'Non précisé';
      counts[n] = (counts[n] ?? 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([label, value]) => ({ label, value }));
  }, [insc]);

  /* ── Loading ── */
  if (!loaded) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-9 h-9 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="w-full space-y-5">

      {/* ══ KPI CARDS ══ */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard
          label="Inscriptions totales" value={insc.length}
          sub={`${inscConverti} converties · ${inscNouv} nouvelles`}
          Icon={Users} trend={inscTrend}
          grad="linear-gradient(135deg,#1e40af,#2563eb)" light="#eff6ff" textColor="#1d4ed8"
        />
        <KpiCard
          label="Taux de conversion" value={`${convRate}%`}
          sub={`${inscConverti} sur ${insc.length} inscriptions`}
          Icon={TrendingUp} trend={null}
          grad="linear-gradient(135deg,#15803d,#16a34a)" light="#f0fdf4" textColor="#15803d"
        />
        <KpiCard
          label="Candidatures enseignants" value={cand.length}
          sub={`${candEnCours} en cours · ${candAccepte} acceptés`}
          Icon={UserCheck} trend={candTrend}
          grad="linear-gradient(135deg,#5b21b6,#7c3aed)" light="#f5f3ff" textColor="#7c3aed"
        />
        <KpiCard
          label="Total utilisateurs" value={total}
          sub={`${insc.length} parents + ${cand.length} enseignants`}
          Icon={Activity} trend={null}
          grad="linear-gradient(135deg,#b45309,#d97706)" light="#fffbeb" textColor="#b45309"
        />
      </div>

      {/* ══ ROW 2 : Monthly chart + Funnel ══ */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

        {/* Monthly activity — 3/5 */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-6"
          style={{ border: '1.5px solid #e8eef8', boxShadow: '0 2px 16px rgba(15,23,42,0.05)' }}>
          <div className="flex items-start justify-between mb-5">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Activité mensuelle</h3>
              <p className="text-slate-400 text-xs mt-0.5">Inscriptions & candidatures — 6 derniers mois</p>
            </div>
            <BarChart2 className="w-4 h-4 text-slate-300" />
          </div>
          <GroupedBarChart
            labels={monthLabels}
            series={[
              { label: 'Inscriptions', color: '#3b82f6', data: inscSeries },
              { label: 'Candidatures', color: '#8b5cf6', data: candSeries },
            ]}
          />
        </div>

        {/* Conversion funnel — 2/5 */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6"
          style={{ border: '1.5px solid #e8eef8', boxShadow: '0 2px 16px rgba(15,23,42,0.05)' }}>
          <div className="flex items-start justify-between mb-5">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Entonnoir inscriptions</h3>
              <p className="text-slate-400 text-xs mt-0.5">{insc.length} demandes au total</p>
            </div>
            <TrendingUp className="w-4 h-4 text-slate-300" />
          </div>
          <FunnelRow label="Reçues"     value={insc.length} total={insc.length} color="#3b82f6" />
          <FunnelRow label="Contactées" value={inscContacte} total={insc.length} color="#8b5cf6" />
          <FunnelRow label="Converties" value={inscConverti} total={insc.length} color="#10b981" />
          <FunnelRow label="Archivées"  value={inscArchive}  total={insc.length} color="#94a3b8" />

          {/* Taux d'acceptation candidatures */}
          <div className="mt-5 pt-4 border-t border-slate-100">
            <p className="text-xs font-bold text-slate-600 mb-3">Candidatures enseignants</p>
            <FunnelRow label="Acceptés" value={candAccepte} total={cand.length} color="#10b981" />
            <FunnelRow label="Refusés"  value={candRefuse}  total={cand.length} color="#ef4444" />
            <FunnelRow label="En cours" value={candEnCours} total={cand.length} color="#f59e0b" />
          </div>
        </div>
      </div>

      {/* ══ ROW 3 : Pipeline + Plans + Niveaux ══ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Pipeline candidatures */}
        <div className="bg-white rounded-2xl p-6"
          style={{ border: '1.5px solid #e8eef8', boxShadow: '0 2px 16px rgba(15,23,42,0.05)' }}>
          <div className="mb-5">
            <h3 className="font-bold text-slate-800 text-sm">Pipeline candidatures</h3>
            <p className="text-slate-400 text-xs mt-0.5">{cand.length} candidats au total</p>
          </div>
          <div className="space-y-3.5">
            {[
              { label: 'Nouveaux',   value: cand.filter(x => x.statut === 'nouveau').length,    color: '#3b82f6' },
              { label: 'En étude',   value: cand.filter(x => x.statut === 'en_etude').length,   color: '#f59e0b' },
              { label: 'Entretien',  value: cand.filter(x => x.statut === 'entretien').length,  color: '#8b5cf6' },
              { label: 'Acceptés',   value: candAccepte,                                         color: '#10b981' },
              { label: 'Refusés',    value: candRefuse,                                          color: '#ef4444' },
            ].map(item => <PipelineRow key={item.label} {...item} total={cand.length} />)}
          </div>

          {cand.length > 0 && (
            <div className="mt-5 pt-4 border-t border-slate-100">
              <p className="text-[11px] text-slate-400">
                Taux d'acceptation :{' '}
                <span className="font-bold text-emerald-600">{fmtPct(candAccepte, cand.length)}</span>
              </p>
            </div>
          )}
        </div>

        {/* Plans / abonnements */}
        <div className="bg-white rounded-2xl p-6"
          style={{ border: '1.5px solid #e8eef8', boxShadow: '0 2px 16px rgba(15,23,42,0.05)' }}>
          <div className="mb-5">
            <h3 className="font-bold text-slate-800 text-sm">Abonnements demandés</h3>
            <p className="text-slate-400 text-xs mt-0.5">Niveau de service souhaité</p>
          </div>

          {/* Stacked visual bar */}
          {cand.length > 0 && (
            <div className="flex h-3 rounded-full overflow-hidden mb-4 gap-0.5">
              {planData.filter(p => p.value > 0).map(p => (
                <div key={p.label} className="transition-all duration-700 rounded-full"
                  style={{ flex: p.value, background: p.color }} />
              ))}
            </div>
          )}

          <div className="space-y-4">
            {planData.map(({ label, value, color }) => {
              const pct = cand.length > 0 ? Math.round((value / cand.length) * 100) : 0;
              return (
                <div key={label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                      <span className="text-xs font-bold text-slate-700">{label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold" style={{ color }}>{value}</span>
                      <span className="text-[10px] text-slate-400 w-9 text-right">{pct}%</span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-1.5 rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, background: color }} />
                  </div>
                </div>
              );
            })}
          </div>

          {cand.filter(x => !x.niveau_service).length > 0 && (
            <p className="text-[10px] text-slate-300 mt-4 italic">
              {cand.filter(x => !x.niveau_service).length} candidats sans abonnement précisé
            </p>
          )}
        </div>

        {/* Niveaux élèves */}
        <div className="bg-white rounded-2xl p-6"
          style={{ border: '1.5px solid #e8eef8', boxShadow: '0 2px 16px rgba(15,23,42,0.05)' }}>
          <div className="flex items-start justify-between mb-5">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Niveaux des élèves</h3>
              <p className="text-slate-400 text-xs mt-0.5">Top 5 niveaux demandés</p>
            </div>
            <GraduationCap className="w-4 h-4 text-slate-300" />
          </div>

          {niveauData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <GraduationCap className="w-8 h-8 text-slate-200 mb-2" />
              <p className="text-slate-400 text-xs">Aucune donnée</p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {niveauData.map(({ label, value }, idx) => {
                const colors = ['#3b82f6','#8b5cf6','#10b981','#f59e0b','#ef4444'];
                return (
                  <div key={label}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold text-slate-700 truncate max-w-[130px]">{label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold" style={{ color: colors[idx] }}>{value}</span>
                        <span className="text-[10px] text-slate-400 w-9 text-right">
                          {fmtPct(value, insc.length)}
                        </span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-1.5 rounded-full transition-all duration-700"
                        style={{
                          width: fmtPct(value, insc.length),
                          background: colors[idx],
                        }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ══ PLACEHOLDER ADS ══ */}
      <div className="rounded-2xl p-6"
        style={{ background: 'linear-gradient(135deg,#eff6ff,#f5f3ff)', border: '1.5px dashed #bfdbfe' }}>
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: '#dbeafe' }}>
            <Zap className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-slate-800 text-sm mb-1">Performance publicitaire</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Connectez vos campagnes Facebook Ads & Google Ads pour afficher ici
              impressions, clics, coût par acquisition et retour sur investissement en temps réel.
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              {['Impressions: —', 'Clics: —', 'CPA: —', 'ROI: —', 'CTR: —'].map(t => (
                <span key={t} className="text-[11px] font-semibold px-3 py-1.5 rounded-lg
                              border border-blue-200 text-blue-400 bg-white">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
