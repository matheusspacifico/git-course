// External Library
import { useEffect, useMemo, useState } from "react";

// Types
import type { ArenaState, Attrs, Card, Winner } from "./types";

// Constants
const ATTRS: Array<keyof Attrs> = [
  "didatica",
  "carisma",
  "rigor",
  "prazos",
  "humor",
];

export default function App() {
  const [deckA, setDeckA] = useState<Card[] | null>(null);
  const [deckB, setDeckB] = useState<Card[] | null>(null);
  const [arena, setArena] = useState<ArenaState | null>(null);
  const [winners, setWinners] = useState<Winner[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Carrega todos os JSONs necessários
  useEffect(() => {
    const safeLoad = async <T,>(path: string, fallback: T): Promise<T> => {
      try {
        const r = await fetch(path, { cache: "no-store" });
        if (!r.ok) return fallback;
        const txt = await r.text();
        if (!txt || txt.trim() === "") return fallback;
        return JSON.parse(txt) as T;
      } catch {
        return fallback;
      }
    };

    (async () => {
      try {
        const [a, b, ar, w] = await Promise.all([
          safeLoad<Card[]>("/deckA.json", []),
          safeLoad<Card[]>("/deckB.json", []),
          safeLoad<ArenaState | null>("/arena.json", null),
          safeLoad<Winner[]>("/winners.json", []),
        ]);
        setDeckA(a);
        setDeckB(b);
        setArena(ar);
        setWinners(w);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    })();
  }, []);

  // Busca cartas escolhidas na arena
  const arenaCards = useMemo(() => {
    if (!deckA || !deckB || !arena)
      return { a: null as Card | null, b: null as Card | null };
    const a = deckA.find((c) => c.id === arena.deckA) ?? null;
    const b = deckB.find((c) => c.id === arena.deckB) ?? null;
    return { a, b };
  }, [deckA, deckB, arena]);

  const arenaResult = useMemo(() => {
    if (!arena || !arenaCards.a || !arenaCards.b)
      return null as
        | null
        | { type: "draw"; value: number; attribute: keyof Attrs }
        | {
            type: "win";
            winner: Card;
            loser: Card;
            diff: number;
            attribute: keyof Attrs;
          };

    const attr = arena.attribute;
    const av = Number(arenaCards.a.attributes?.[attr] ?? 0);
    const bv = Number(arenaCards.b.attributes?.[attr] ?? 0);

    if (av === bv) return { type: "draw", value: av, attribute: attr } as const;
    return {
      type: "win",
      winner: av > bv ? arenaCards.a : arenaCards.b,
      loser: av > bv ? arenaCards.b : arenaCards.a,
      diff: Math.abs(av - bv),
      attribute: attr,
    } as const;
  }, [arena, arenaCards]);

  // Mapa (id -> Card) para lookup rápido ao renderizar winners
  const cardIndex = useMemo(() => {
    const idx = new Map<string, Card>();
    (deckA || []).forEach((c) => idx.set(c.id, c));
    (deckB || []).forEach((c) => idx.set(c.id, c));
    return idx;
  }, [deckA, deckB]);

  return (
    <div className="min-h-screen w-full bg-neutral-50 text-neutral-900">
      <Header />

      <section className="w-full px-4 pt-6">
        {error && (
          <div className="mb-6 rounded-xl border border-amber-300 bg-amber-50 p-4 text-amber-900">
            <strong>Nota:</strong> {error}
          </div>
        )}
      </section>

      {/* Arena atual */}
      <section className="w-full px-4 mt-4">
        <h2 className="text-xl font-semibold mb-3">
          🆚 Arena X1 — Deck A vs Deck B
        </h2>
        {!arena ? (
          <div className="rounded-xl border border-neutral-200 bg-white p-4 text-neutral-600">
            Configure <code>/arena.json</code> assim:
            <pre className="mt-2 text-xs bg-neutral-50 p-2 rounded-lg overflow-auto">{`{
  "round": "...",
  "attribute": "didatica|carisma|rigor|prazos|humor",
  "deckA": "id do deckA",
  "deckB": "id do deckB",
  "playerAName": "Nome Jogador A",
  "playerBName": "Nome Jogador B"
}`}</pre>
          </div>
        ) : (
          <ArenaView
            left={arenaCards.a}
            right={arenaCards.b}
            attribute={arena.attribute}
            result={arenaResult}
            leftId={arena.deckA}
            rightId={arena.deckB}
            leftLabel={arena.playerAName || "Jogador A"}
            rightLabel={arena.playerBName || "Jogador B"}
          />
        )}
      </section>

      {/* Decks */}
      <section className="w-full px-4 mt-10">
        <h3 className="text-lg font-semibold">🗂️ Deck A</h3>
        <CardsGrid cards={deckA} emptyHint="Adicione cartas em /deckA.json" />
      </section>

      <section className="w-full px-4 mt-6">
        <h3 className="text-lg font-semibold">🗂️ Deck B</h3>
        <CardsGrid cards={deckB} emptyHint="Adicione cartas em /deckB.json" />
      </section>

      {/* Histórico de vencedores */}
      <section className="w-full px-4 mt-10 pb-16">
        <h2 className="text-xl font-semibold mb-3">🏆 Histórico de Batalhas</h2>
        {!winners || winners.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-300 bg-white p-6 text-neutral-600">
            Ainda não há vencedores. Após o PR do vencedor, adicione uma entrada
            em <code>/winners.json</code>.
          </div>
        ) : (
          <ul className="space-y-4">
            {winners.map((w, i) => {
              const winC = cardIndex.get(w.winner) || null;
              const losC = cardIndex.get(w.loser) || null;
              return (
                <li
                  key={`${w.round}-${i}`}
                  className="rounded-2xl border border-neutral-200 bg-white p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="text-sm text-neutral-600">
                      Round: <strong>{w.round}</strong>
                    </div>
                    <div className="flex items-center gap-2">
                      {w.playerAName && (
                        <span className="text-xs rounded-full bg-neutral-100 border px-2 py-0.5">
                          A: {w.playerAName}
                        </span>
                      )}
                      {w.playerBName && (
                        <span className="text-xs rounded-full bg-neutral-100 border px-2 py-0.5">
                          B: {w.playerBName}
                        </span>
                      )}
                      <span className="text-xs rounded-full bg-emerald-600 text-white px-3 py-1">
                        Vencedor por {w.attribute} (+{w.diff})
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3 items-stretch">
                    <MiniCard
                      card={winC}
                      highlight
                      attr={w.attribute}
                      labelPrefix={
                        w.winnerName ? `Vencedor — ${w.winnerName}` : "Vencedor"
                      }
                    />
                    <div className="flex items-center justify-center text-2xl font-black">
                      VS
                    </div>
                    <MiniCard
                      card={losC}
                      highlight={false}
                      attr={w.attribute}
                      labelPrefix="Perdedor"
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <Footer />
    </div>
  );
}

// ======================== Componentes ========================
function Header() {
  return (
    <header className="sticky top-0 z-10 backdrop-blur bg-white/70 border-b border-neutral-200">
      <div className="w-full px-4 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            X1 de Professores — Decks & Arena
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 mt-1">
            Fluxo didático: escolha cartas de <code>/deckA.json</code> e{" "}
            <code>/deckB.json</code>, preencha <code>/arena.json</code> com os
            nomes, e o vencedor registra no <code>/winners.json</code> via PR.
          </p>
        </div>
        <span className="text-xs rounded-full px-3 py-1 bg-black text-white">
          git-game
        </span>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-neutral-200">
      <div className="w-full px-4 py-8 text-xs text-neutral-500 flex flex-wrap gap-2 items-center justify-between">
        <span>Sem backend — tudo por JSON + PR.</span>
        <span>
          Arquivos: <code>/deckA.json</code>, <code>/deckB.json</code>,{" "}
          <code>/arena.json</code>, <code>/winners.json</code>
        </span>
      </div>
    </footer>
  );
}

function CardsGrid({
  cards,
  emptyHint,
}: {
  cards: Card[] | null;
  emptyHint: string;
}) {
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

function ArenaView({
  left,
  right,
  attribute,
  result,
  leftId,
  rightId,
  leftLabel,
  rightLabel,
}: {
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
}) {
  // quem ganhou? (para mostrar nome do jogador)
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

function MiniCard({
  card,
  highlight,
  attr,
  labelPrefix,
}: {
  card: Card | null;
  highlight: boolean;
  attr: keyof Attrs;
  labelPrefix?: string;
}) {
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

function CardView({ item }: { item: Card }) {
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

function StatBar({
  label,
  value,
  small,
}: {
  label: keyof Attrs;
  value: number;
  small?: boolean;
}) {
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
