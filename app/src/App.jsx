import { migrationPlan } from "./data/migrationPlan";

export default function App() {
  return (
    <main className="app-shell">
      <section className="hero">
        <p className="eyebrow">MBL Document</p>
        <h1>React refactor workspace</h1>
        <p className="copy">
          This Vite workspace is ready for the gradual migration from the
          current prototype. Keep the Axure export as the baseline and move one
          production screen at a time into React.
        </p>
      </section>
      <section className="panel-grid">
        <article className="panel">
          <h2>How to use this workspace</h2>
          <ul className="steps">
            <li>Run `npm install` inside `app/` once.</li>
            <li>Use `npm run dev` to start the React workspace.</li>
            <li>Compare every migrated page against `../prototype/axure-export/`.</li>
          </ul>
        </article>
        <article className="panel">
          <h2>Recommended migration order</h2>
          <div className="cards">
            {migrationPlan.map((item) => (
              <section className="card" key={item.id}>
                <p className="card-status">{item.status}</p>
                <h3>{item.title}</h3>
                <p>{item.outcome}</p>
                <code>{item.source}</code>
              </section>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
