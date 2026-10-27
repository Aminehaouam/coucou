/** Single-choice replies as pill rows. A native radio group, so keyboard and screen readers just work. */
export default function ReplyOptions({ replies, value, onChange }) {
  return (
    <fieldset className="m-0 flex min-w-0 flex-col gap-2 border-0 p-0">
      <legend className="mb-2 p-0 text-sm font-medium text-[color:var(--slate-text)]">Say your reply, or tap one</legend>
      {replies.map((text) => (
        <label
          key={text}
          className="group relative flex min-h-13 cursor-pointer items-center gap-3.5 rounded-full border-2 border-(--navy)/35 bg-white px-4 py-2.5 transition hover:border-(--navy)/60 has-checked:border-(--blue) has-checked:bg-[#eef4fc] has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-(--blue)/60 active:scale-[0.99]"
        >
          <input type="radio" name="reply" value={text} checked={value === text} onChange={() => onChange(text)} className="sr-only" />
          <span aria-hidden="true" className="grid size-6 shrink-0 place-items-center rounded-full border-2 border-(--navy)/55 bg-white transition group-has-checked:border-(--blue)">
            <span className="size-3 scale-0 rounded-full bg-(--blue) transition-transform group-has-checked:scale-100" />
          </span>
          <span className="text-[1.0625rem]/[1.3] font-medium text-[color:var(--navy)]">{text}</span>
        </label>
      ))}
    </fieldset>
  );
}
