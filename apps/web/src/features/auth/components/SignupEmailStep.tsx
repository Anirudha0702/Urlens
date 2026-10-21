import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  alertError,
  buttonPrimary,
  errorText,
  inputClass,
  labelClass,
} from "../../../components/ui";
import { ApiError } from "../../../lib/api-client";
import { useRequestSignupOtp } from "../queries";
import { emailSchema } from "../schemas";
import type { EmailFormValues } from "../schemas";
import { useSignupFlow } from "../use-signup-flow";

export function SignupEmailStep({ onSuccess }: { onSuccess: () => void }) {
  const flow = useSignupFlow();
  const requestOtp = useRequestSignupOtp();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: flow.email ?? "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    await requestOtp.mutateAsync({ email: values.email });
    flow.setEmail(values.email);
    onSuccess();
  });

  return (
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

      {requestOtp.isError ? (
        <div className={alertError}>
          {requestOtp.error instanceof ApiError
            ? requestOtp.error.message
            : "Could not send the verification code. Try again."}
        </div>
      ) : null}

      <button className={buttonPrimary} type="submit" disabled={requestOtp.isPending}>
        {requestOtp.isPending ? "Sending code..." : "Send verification code"}
      </button>
    </form>
  );
}
