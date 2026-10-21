import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import {
  alertError,
  alertSuccess,
  buttonLink,
  buttonPrimary,
  errorText,
  inputClass,
  labelClass,
} from "../../../components/ui";
import { ApiError } from "../../../lib/api-client";
import { useCompleteSignup } from "../queries";
import { completeSignupSchema } from "../schemas";
import type { CompleteSignupFormValues } from "../schemas";
import { useSignupFlow } from "../use-signup-flow";

export function SignupCompleteStep({ onBack }: { onBack: () => void }) {
  const flow = useSignupFlow();
  const navigate = useNavigate();
  const complete = useCompleteSignup();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompleteSignupFormValues>({
    resolver: zodResolver(completeSignupSchema),
    defaultValues: { name: "", password: "", confirm_password: "" },
  });

  if (!flow.email || !flow.verificationToken) {
    return (
      <div className={alertError}>
        Your email has not been verified. You cannot create an account yet.{" "}
        <button className={buttonLink} type="button" onClick={onBack}>
          Verify email
        </button>
      </div>
    );
  }

  const onSubmit = handleSubmit(async (values) => {
    await complete.mutateAsync({
      email: flow.email!,
      name: values.name,
      password: values.password,
      verification_token: flow.verificationToken!,
    });
    flow.reset();
    navigate({ to: "/dashboard" });
  });

  return (
    <form className="flex flex-col gap-4" onSubmit={onSubmit} noValidate>
      <div className={alertSuccess}>
        {flow.email} verified. Finish setting up your account.
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelClass} htmlFor="name">
          Full name
        </label>
        <input
          id="name"
          type="text"
          autoComplete="name"
          placeholder="Ada Lovelace"
          aria-invalid={Boolean(errors.name)}
          className={inputClass(Boolean(errors.name))}
          {...register("name")}
        />
        {errors.name ? (
          <span className={errorText}>{errors.name.message}</span>
        ) : null}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelClass} htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          aria-invalid={Boolean(errors.password)}
          className={inputClass(Boolean(errors.password))}
          {...register("password")}
        />
        {errors.password ? (
          <span className={errorText}>{errors.password.message}</span>
        ) : null}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelClass} htmlFor="confirm_password">
          Confirm password
        </label>
        <input
          id="confirm_password"
          type="password"
          autoComplete="new-password"
          aria-invalid={Boolean(errors.confirm_password)}
          className={inputClass(Boolean(errors.confirm_password))}
          {...register("confirm_password")}
        />
        {errors.confirm_password ? (
          <span className={errorText}>{errors.confirm_password.message}</span>
        ) : null}
      </div>

      {complete.isError ? (
        <div className={alertError}>
          {complete.error instanceof ApiError
            ? complete.error.message
            : "Could not create your account. Try again."}
        </div>
      ) : null}

      <button className={buttonPrimary} type="submit" disabled={complete.isPending}>
        {complete.isPending ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
}
