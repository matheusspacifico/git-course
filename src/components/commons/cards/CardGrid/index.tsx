// Components
import CardView from "../CardView";

// Types
import type { Card } from "_types/arena";

type CardGridProps = {
  cards: Card[] | null;
  emptyHint: string;
};

export default function CardsGrid({ cards, emptyHint }: CardGridProps) {
  if (cards === null)
    return (
      <div className="py-10 text-center text-neutral-500">Carregando…</div>
    );
  if (cards.length === 0)
    return (
      <div className="rounded-xl border border-dashed border-neutral-300 bg-white p-6 text-neutral-600">
        {emptyHint}
      </div>
    );
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-3">
      {cards.map((c) => (
        <li key={c.id}>
          <CardView item={c} />
        </li>
      ))}
    </ul>
  );
}
