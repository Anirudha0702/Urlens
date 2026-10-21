import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useRequestSignupOtp, useVerifySignupOtp } from "../queries";
import { otpSchema } from "../schemas";
import type { OtpFormValues } from "../schemas";
import { useSignupFlow } from "../use-signup-flow";

const RESEND_SECONDS = 30;

export function SignupOtpStep({
  onSuccess,
  onBack,
}: {
  onSuccess: () => void;
  onBack: () => void;
}) {
  const flow = useSignupFlow();
  const verifyOtp = useVerifySignupOtp();
  const resendOtp = useRequestSignupOtp();
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = window.setInterval(() => {
      setSecondsLeft((value) => (value <= 1 ? 0 : value - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [secondsLeft]);

  if (!flow.email) {
    return (
      <div className={alertError}>
        Your session expired.{" "}
        <button className={buttonLink} type="button" onClick={onBack}>
          Go back
        </button>
      </div>
    );
  }

  const onSubmit = handleSubmit(async (values) => {
    const result = await verifyOtp.mutateAsync({
      email: flow.email!,
      otp: values.otp,
    });
    flow.setVerificationToken(result.verification_token);
    onSuccess();
  });

  const onResend = async () => {
    if (secondsLeft > 0) return;
    await resendOtp.mutateAsync({ email: flow.email! });
    setSecondsLeft(RESEND_SECONDS);
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={onSubmit} noValidate>
      <div className="flex flex-col gap-1.5">
        <label className={labelClass} htmlFor="otp">
          Verification code
        </label>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          We sent a 6-digit code to{" "}
          <strong className="text-zinc-900 dark:text-zinc-100">{flow.email}</strong>.
        </p>
        <input
          id="otp"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          placeholder="000000"
          aria-invalid={Boolean(errors.otp)}
          className={`${inputClass(Boolean(errors.otp))} text-center font-mono text-2xl tracking-[0.5em]`}
          {...register("otp")}
        />
        {errors.otp ? (
          <span className={errorText}>{errors.otp.message}</span>
        ) : null}
      </div>

      {verifyOtp.isError ? (
        <div className={alertError}>
          {verifyOtp.error instanceof ApiError
            ? verifyOtp.error.message
            : "Invalid or expired code. Try again."}
        </div>
      ) : null}

      {resendOtp.isSuccess ? (
        <div className={alertSuccess}>A new code has been sent.</div>
      ) : null}

      <button className={buttonPrimary} type="submit" disabled={verifyOtp.isPending}>
        {verifyOtp.isPending ? "Verifying..." : "Verify email"}
      </button>

      <div className="flex items-center justify-between text-[13.5px]">
        <button className={buttonLink} type="button" onClick={onBack}>
          Change email
        </button>
        {secondsLeft > 0 ? (
          <span className="text-zinc-500 dark:text-zinc-400">
            Resend in {secondsLeft}s
          </span>
        ) : (
          <button
            className={buttonLink}
            type="button"
            onClick={onResend}
            disabled={resendOtp.isPending}
          >
            {resendOtp.isPending ? "Sending..." : "Resend code"}
          </button>
        )}
      </div>
    </form>
  );
}
