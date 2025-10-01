export default function Footer() {
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
