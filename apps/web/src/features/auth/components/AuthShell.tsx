import type { ReactNode } from "react";

interface AuthShellProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <div className="flex min-h-svh items-center justify-center bg-gradient-to-br from-brand-50 via-white to-white p-6 dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-950">
      <div className="w-full max-w-[420px] rounded-2xl border border-zinc-200 bg-white p-8 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-5 inline-flex items-center gap-2 font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          <span className="h-3 w-3 rounded-full bg-brand-500" />
          Urlens
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-1 mb-6 text-sm text-zinc-500 dark:text-zinc-400">
            {subtitle}
          </p>
        ) : (
          <div className="mb-6" />
        )}
        {children}
        {footer ? (
          <p className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
            {footer}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export function Steps({ current, total }: { current: number; total: number }) {
  return (
    <div className="mb-5 flex gap-1.5" aria-hidden="true">
      {Array.from({ length: total }, (_, index) => (
        <span
          key={index}
          className={`h-1 flex-1 rounded-full ${
            index < current ? "bg-brand-500" : "bg-zinc-200 dark:bg-zinc-800"
          }`}
        />
      ))}
    </div>
  );
}
