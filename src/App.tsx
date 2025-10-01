// External Library
import { useEffect, useMemo, useState } from "react";

// Components
import Header from "@components/structure/Header";
import Footer from "@components/structure/Footer";
import CardsGrid from "@components/commons/cards/CardGrid";
import MiniCard from "@components/structure/MiniCard";
import ArenaView from "@components/structure/AreaView";

// Types
import type { ArenaState, Attrs, Card, Winner } from "./types/arena";

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
