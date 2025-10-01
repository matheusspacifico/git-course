// Types
import type { Attrs, Card } from "_types/arena";

type MiniCardProps = {
  card: Card | null;
  highlight: boolean;
  attr: keyof Attrs;
  labelPrefix?: string;
};

export default function MiniCard({
  card,
  highlight,
  attr,
  labelPrefix,
}: MiniCardProps) {
  if (!card)
    return (
      <article className="rounded-xl border border-neutral-200 p-3 bg-white text-neutral-500">
        Carta não encontrada
      </article>
    );
  const val = Number(card.attributes?.[attr] ?? 0);
  return (
    <article
      className={`rounded-xl border p-3 bg-white ${
        highlight ? "border-emerald-500 shadow" : "border-neutral-200"
      }`}
    >
      <div className="aspect-[4/3] bg-neutral-100 overflow-hidden rounded-lg">
        <img
          src={card.image}
          alt={card.teacher}
          className="h-full w-full object-cover object-center"
        />
      </div>
      <div className="mt-2">
        <h4 className="font-medium leading-tight flex items-center gap-2">
          {labelPrefix && (
            <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-neutral-900 text-white">
              {labelPrefix}
            </span>
          )}
          {card.teacher}
        </h4>
        {card.nickname && (
          <p className="text-xs text-neutral-600">{card.nickname}</p>
        )}
        <p className="text-xs text-neutral-600 mt-1">
          Valor em <strong>{attr}</strong>: {val}
        </p>
      </div>
    </article>
  );
}
