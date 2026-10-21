import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { buttonSecondary } from "../components/ui";
import { clearAuthToken } from "../lib/api-client";
import { currentUserQueryOptions, useSignout } from "../features/auth/queries";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const navigate = useNavigate();
  const signout = useSignout();
  const { data: user, isPending, isError } = useQuery(currentUserQueryOptions());

  const handleSignout = async () => {
    try {
      await signout.mutateAsync();
    } finally {
      clearAuthToken();
      navigate({ to: "/signin" });
    }
  };

  return (
    <div className="mx-auto min-h-svh max-w-[900px] p-8">
      <header className="mb-8 flex items-center justify-between gap-4">
        <div className="inline-flex items-center gap-2 font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          <span className="h-3 w-3 rounded-full bg-brand-500" />
          Urlens
        </div>
        <button className={buttonSecondary} onClick={handleSignout}>
          Sign out
        </button>
      </header>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
        <h1 className="mb-4 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          Dashboard
        </h1>
        {isPending && !isError ? (
          <p className="text-zinc-500 dark:text-zinc-400">
            Loading your profile...
          </p>
        ) : null}
        {isError ? (
          <p className="text-red-600 dark:text-red-400">
            We couldn&apos;t load your profile.
          </p>
        ) : null}
        {user ? (
          <p className="text-zinc-600 dark:text-zinc-300">
            Signed in as{" "}
            <strong className="text-zinc-900 dark:text-zinc-100">{user.name}</strong>{" "}
            ({user.email}).
          </p>
        ) : null}
      </div>
    </div>
  );
}
