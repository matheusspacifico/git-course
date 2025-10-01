// Types
import type { Attrs } from "_types/arena";

type StatBarProp = {
  label: keyof Attrs;
  value: number;
  small?: boolean;
};

export default function StatBar({ label, value, small }: StatBarProp) {
  const pct = Math.max(0, Math.min(100, Number(value) || 0));
  return (
    <div className={small ? "text-[11px]" : "text-sm"}>
      <div className="flex items-center justify-between">
        <span className="capitalize text-neutral-700">{label}</span>
        <span className="font-semibold">{pct}</span>
      </div>
      <div className="h-2 rounded-full bg-neutral-200 overflow-hidden mt-1">
        <div className="h-full bg-black/80" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
