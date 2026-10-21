import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  alertError,
  buttonPrimary,
  errorText,
  inputClass,
  labelClass,
} from "../components/ui";
import { AuthShell } from "../features/auth/components/AuthShell";
import { useSignin } from "../features/auth/queries";
import { signinSchema } from "../features/auth/schemas";
import type { SigninFormValues } from "../features/auth/schemas";
import { ApiError } from "../lib/api-client";

export const Route = createFileRoute("/_auth/signin")({
  component: SigninPage,
});

function SigninPage() {
  const navigate = useNavigate();
  const signin = useSignin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninFormValues>({
    resolver: zodResolver(signinSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    await signin.mutateAsync(values);
    navigate({ to: "/dashboard" });
  });

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to your Urlens account."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link className="font-semibold text-brand-500 hover:underline" to="/signup">
            Create one
          </Link>
        </>
      }
    >
      <form className="flex flex-col gap-4" onSubmit={onSubmit} noValidate>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass} htmlFor="email">
            Email address
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={Boolean(errors.email)}
            className={inputClass(Boolean(errors.email))}
            {...register("email")}
          />
          {errors.email ? (
            <span className={errorText}>{errors.email.message}</span>
          ) : null}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass} htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            aria-invalid={Boolean(errors.password)}
            className={inputClass(Boolean(errors.password))}
            {...register("password")}
          />
          {errors.password ? (
            <span className={errorText}>{errors.password.message}</span>
          ) : null}
        </div>

        {signin.isError ? (
          <div className={alertError}>
            {signin.error instanceof ApiError
              ? signin.error.message
              : "Invalid email or password."}
          </div>
        ) : null}

        <button className={buttonPrimary} type="submit" disabled={signin.isPending}>
          {signin.isPending ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </AuthShell>
  );
}
