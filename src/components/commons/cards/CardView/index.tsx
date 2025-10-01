// Components
import StatBar from "../../StatusBar";

// Types
import type { Attrs, Card } from "_types/arena";

type CardViewProps = {
  item: Card;
};

export default function CardView({ item }: CardViewProps) {
  const ATTRS: Array<keyof Attrs> = [
    "didatica",
    "carisma",
    "rigor",
    "prazos",
    "humor",
  ];

  return (
    <article
      className={`overflow-hidden rounded-2xl border bg-white shadow-sm hover:shadow-md transition-shadow border-neutral-200`}
    >
      <div className="aspect-[4/3] bg-neutral-100 overflow-hidden">
        <img
          src={item.image}
          alt={item.teacher}
          loading="lazy"
          className="h-full w-full object-cover object-center"
        />
      </div>
      <div className="p-3">
        <h3 className="text-base font-semibold leading-tight">
          {item.teacher}
        </h3>
        {item.nickname && (
          <p className="text-xs text-neutral-600">{item.nickname}</p>
        )}
        <div className="mt-3 grid grid-cols-2 gap-2">
          {ATTRS.map((k) => (
            <StatBar
              key={k}
              label={k}
              value={item.attributes?.[k] ?? 0}
              small
            />
          ))}
        </div>
      </div>
    </article>
  );
}
