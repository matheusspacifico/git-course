import { useEffect, useState } from "react";

// 🧭 Como funciona (resumo rápido para o prof/organizadores):
// 1) Coloque este componente como App.jsx do seu projeto React (Vite, CRA, Next app dir desabilitar SSR etc.).
// 2) Crie um arquivo PUBLICO chamado /gallery.json dentro da pasta public do app.
// 3) Os alunos abrem PRs adicionando as imagens em /public/images/ e registrando-as em /public/gallery.json.
// 4) O site carrega /gallery.json em runtime. Sem build adicional.
//
// Exemplo de /public/gallery.json:
// [
//   {
//     "src": "/images/minha-arte-01.png",
//     "author": "Fulana da Silva",
//     "caption": "Minha ilustração de Git Flow",
//     "link": "https://github.com/fulana" // opcional
//   }
// ]
//
// Dica de PR para os alunos (README/CONTRIBUTING):
// - Adicione sua imagem em /public/images/ (PNG/JPG/SVG; use nomes únicos)
// - Adicione um objeto no array de /public/gallery.json com src/author/caption
// - Faça o PR. O site renderiza automaticamente após merge.

export default function App() {
  const [items, setItems] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/gallery.json", { cache: "no-store" })
      .then((r) => {
        if (!r.ok) throw new Error("gallery.json não encontrado");
        return r.json();
      })
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch((e) => {
        setError(e.message);
        // Fallback vazio para primeira execução (antes do primeiro PR)
        setItems([]);
      });
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur bg-white/70 border-b border-neutral-200">
        <div className="mx-auto max-w-6xl px-4 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Mostruário Colaborativo — Git + Pull Requests
            </h1>
            <p className="text-sm sm:text-base text-neutral-600 mt-1">
              Envie um PR adicionando sua imagem em <code>/public/images</code> e
              registre-a em <code>/public/gallery.json</code>. Simples assim.
            </p>
          </div>
          <span className="text-xs rounded-full px-3 py-1 bg-black text-white">wplace-like</span>
        </div>
      </header>

      {/* Aviso/Status */}
      <section className="mx-auto max-w-6xl px-4 pt-6">
        {error && (
          <div className="mb-6 rounded-xl border border-amber-300 bg-amber-50 p-4 text-amber-900">
            <strong>Nota:</strong> {error}. Crie <code>/public/gallery.json</code> para começar.
          </div>
        )}
      </section>

      {/* Área principal: grade de imagens */}
      <main className="mx-auto max-w-6xl px-4 pb-16">
        {items === null ? (
          // Carregando
          <div className="py-20 text-center text-neutral-500">Carregando…</div>
        ) : items.length === 0 ? (
          // Estado vazio
          <EmptyState />
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
            {items.map((it, i) => (
              <li key={i} className="group">
                <ImageCard item={it} />
              </li>
            ))}
          </ul>
        )}
      </main>

      {/* Rodapé simples */}
      <footer className="border-t border-neutral-200">
        <div className="mx-auto max-w-6xl px-4 py-8 text-xs text-neutral-500 flex flex-wrap gap-2 items-center justify-between">
          <span>
            Feito em React. Arquivos dos alunos via PR — sem painel admin.
          </span>
          <span>
            Estrutura sugerida: <code>/public/images</code> & <code>/public/gallery.json</code>
          </span>
        </div>
      </footer>
    </div>
  );
}

function ImageCard({ item }) {
  const { src, author, caption, link } = item ?? {};
  return (
    <article className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="aspect-[4/3] bg-neutral-100 overflow-hidden">
        {/* Imagem do aluno */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={caption || author || "Arte do aluno"}
          loading="lazy"
          className="h-full w-full object-cover object-center group-hover:scale-[1.02] transition-transform"
        />
      </div>
      {(author || caption) && (
        <div className="p-3">
          {caption && (
            <h3 className="text-sm font-medium leading-tight line-clamp-2">{caption}</h3>
          )}
          {author && (
            <p className="text-xs text-neutral-600 mt-1">
              por {link ? (
                <a href={link} target="_blank" rel="noreferrer" className="underline-offset-2 hover:underline">
                  {author}
                </a>
              ) : (
                author
              )}
            </p>
          )}
        </div>
      )}
    </article>
  );
}

function EmptyState() {
  return (
    <div className="py-24 text-center">
      <div className="mx-auto max-w-md">
        <div className="text-6xl">🧩</div>
        <h2 className="mt-4 text-xl font-semibold">Nenhuma contribuição ainda</h2>
        <p className="mt-2 text-neutral-600">
          Para aparecer aqui, faça um PR adicionando uma imagem em <code>/public/images</code> e um registro no arquivo
          <code> /public/gallery.json</code>.
        </p>
        <ol className="mt-6 text-left text-sm text-neutral-700 space-y-2 bg-white/60 border border-neutral-200 rounded-xl p-4">
          <li>1) Coloque seu arquivo em <code>/public/images/NOME-UNICO.ext</code></li>
          <li>2) Edite <code>/public/gallery.json</code> e adicione:
            <pre className="mt-2 whitespace-pre-wrap bg-neutral-50 border border-neutral-200 rounded-lg p-3 text-xs overflow-auto">{`{
  "src": "/images/NOME-UNICO.ext",
  "author": "Seu Nome",
  "caption": "Uma legenda curta",
  "link": "https://github.com/seuusuario" // opcional
}`}</pre>
          </li>
          <li>3) Abra o Pull Request ✅</li>
        </ol>
      </div>
    </div>
  );
}
