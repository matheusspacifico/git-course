// External Library
import { useMemo } from "react";

// Components
import MiniCard from "../MiniCard";

// Types
import type { Attrs, Card } from "_types/arena";

type ArenaViewProps = {
  left: Card | null;
  right: Card | null;
  attribute: keyof Attrs;
  result:
    | null
    | { type: "draw"; value: number; attribute: keyof Attrs }
    | {
        type: "win";
        winner: Card;
        loser: Card;
        diff: number;
        attribute: keyof Attrs;
      };
  leftId: string;
  rightId: string;
  leftLabel: string;
  rightLabel: string;
};

export default function ArenaView({
  left,
  right,
  attribute,
  result,
  leftId,
  rightId,
  leftLabel,
  rightLabel,
}: ArenaViewProps) {
  const winnerLabel = useMemo(() => {
    if (!result || result.type !== "win") return null;
    const winId = result.winner.id;
    return winId === leftId ? leftLabel : rightLabel;
  }, [result, leftId, rightId, leftLabel, rightLabel]);

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4">
      {!left || !right ? (
        <p className="text-neutral-600 text-sm">
          Defina as cartas no <code>arena.json</code> para iniciar a disputa.
        </p>
      ) : (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 items-stretch gap-4">
            <MiniCard
              card={left}
              highlight
              attr={attribute}
              labelPrefix={`Deck A — ${leftLabel}`}
            />
            <div className="flex items-center justify-center">
              <span className="text-2xl font-black">VS</span>
            </div>
            <MiniCard
              card={right}
              highlight={false}
              attr={attribute}
              labelPrefix={`Deck B — ${rightLabel}`}
            />
          </div>

          {result?.type === "draw" && (
            <div className="mt-4 text-center">
              <span className="inline-block text-sm rounded-full bg-neutral-100 border px-3 py-1">
                Empate em {result.attribute}
              </span>
            </div>
          )}

          {result?.type === "win" && (
            <div className="mt-4 text-center">
              <span className="inline-block text-sm rounded-full bg-emerald-600 text-white px-3 py-1">
                Vencedor: {result.winner.teacher} ({winnerLabel}) +{result.diff}{" "}
                em {result.attribute}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
