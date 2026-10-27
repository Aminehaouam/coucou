import { Driver, Speaker } from '../icons.jsx';

/** Who is speaking, what they say, and a way to hear it again. */
export default function DialogCard({ speaker, prompt, onReplay }) {
  return (
    <section aria-labelledby="prompt" className="flex items-start gap-3.5 rounded-3xl bg-(--cream) p-4">
      <Driver className="mt-0.5 size-12 shrink-0" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-[color:var(--slate-text)]">{speaker}</p>
          <button
            type="button"
            onClick={onReplay}
            className="-my-1.5 -mr-1.5 inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-[color:var(--blue-press)] transition hover:bg-(--blue)/10 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-(--blue)/60"
          >
            <Speaker />
            Hear again
          </button>
        </div>
        <h1 id="prompt" className="mt-0.5 text-balance text-2xl/[1.15] font-semibold tracking-tight text-[color:var(--navy)] lg:text-[1.9rem]">
          {prompt}
        </h1>
      </div>
    </section>
  );
}
