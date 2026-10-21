export const labelClass =
  "text-[13px] font-semibold text-zinc-900 dark:text-zinc-100";

export function inputClass(invalid?: boolean): string {
  const base =
    "w-full rounded-lg border bg-white px-3.5 py-2.5 text-[15px] text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:ring-2 dark:bg-zinc-950 dark:text-zinc-100";
  return invalid
    ? `${base} border-red-500 focus:border-red-500 focus:ring-red-500/20`
    : `${base} border-zinc-300 focus:border-brand-500 focus:ring-brand-500/20 dark:border-zinc-700`;
}

export const buttonPrimary =
  "inline-flex w-full items-center justify-center gap-2 rounded-lg border border-transparent bg-brand-500 px-4 py-2.5 text-[15px] font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60";

export const buttonSecondary =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-300 bg-transparent px-4 py-2 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-100 disabled:opacity-60 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-800";

export const buttonLink =
  "bg-transparent p-0 text-sm font-semibold text-brand-500 hover:underline disabled:opacity-60";

export const alertError =
  "rounded-lg border border-red-500 bg-red-50 px-3.5 py-2.5 text-[13.5px] text-red-600 dark:border-red-500/60 dark:bg-red-500/10 dark:text-red-400";

export const alertSuccess =
  "rounded-lg border border-emerald-500 bg-emerald-50 px-3.5 py-2.5 text-[13.5px] text-emerald-600 dark:border-emerald-500/60 dark:bg-emerald-500/10 dark:text-emerald-400";

export const errorText = "text-[12.5px] text-red-600 dark:text-red-400";
