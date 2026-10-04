import { formatTime } from '../../utils/format';

export default function SlotGrid({ slots, selected, onSelect }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {slots.map((s) => {
        const isSelected = selected === s.startTime;
        return (
          <button
            type="button"
            key={`${s.availabilityId}-${s.startTime}`}
            disabled={!s.available}
            onClick={() => onSelect(s)}
            data-testid={`slot-${s.startTime}`}
            className={`rounded-lg border px-3 py-3 text-sm font-medium transition ${
              !s.available
                ? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400 line-through'
                : isSelected
                  ? 'border-brand-600 bg-brand-600 text-white'
                  : 'border-brand-200 bg-brand-50 text-brand-800 hover:border-brand-500'
            }`}
          >
            {formatTime(s.startTime)}
            <span className="block text-xs font-normal opacity-70">{s.available ? 'Available' : 'Unavailable'}</span>
          </button>
        );
      })}
    </div>
  );
}
