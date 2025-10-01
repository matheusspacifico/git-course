export default function Header() {
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
