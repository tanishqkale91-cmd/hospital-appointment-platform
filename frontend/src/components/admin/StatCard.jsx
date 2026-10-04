export default function StatCard({ label, value, hint, tone = 'brand' }) {
  const tones = {
    brand: 'bg-brand-50 text-brand-700',
    sky: 'bg-sky-50 text-sky-700',
    amber: 'bg-amber-50 text-amber-700',
    emerald: 'bg-emerald-50 text-emerald-700',
    slate: 'bg-slate-100 text-slate-700',
  };
  return (
    <div className="card">
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`mt-2 inline-block rounded-lg px-3 py-1 text-2xl font-semibold ${tones[tone]}`}>{value ?? '-'}</p>
      {hint && <p className="mt-2 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}
