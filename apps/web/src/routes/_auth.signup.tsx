import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthShell, Steps } from "../features/auth/components/AuthShell";
import { SignupEmailStep } from "../features/auth/components/SignupEmailStep";
import { SignupOtpStep } from "../features/auth/components/SignupOtpStep";
import { SignupCompleteStep } from "../features/auth/components/SignupCompleteStep";
import { useSignupFlow } from "../features/auth/use-signup-flow";

export const Route = createFileRoute("/_auth/signup")({
  component: SignupPage,
});

type Step = "email" | "otp" | "complete";

function initialStep(email: string | null, token: string | null): Step {
  if (token) return "complete";
  if (email) return "otp";
  return "email";
}

function SignupPage() {
  const flow = useSignupFlow();
  const [step, setStep] = useState<Step>(() =>
    initialStep(flow.email, flow.verificationToken),
  );

  const stepIndex = step === "email" ? 1 : step === "otp" ? 2 : 3;

  return (
    <AuthShell
      title="Create your account"
      subtitle="Verify your email to get started."
      footer={
        <>
          Already have an account?{" "}
          <Link className="font-semibold text-brand-500 hover:underline" to="/signin">
            Sign in
          </Link>
        </>
      }
    >
      <Steps current={stepIndex} total={3} />
      {step === "email" && (
        <SignupEmailStep onSuccess={() => setStep("otp")} />
      )}
      {step === "otp" && (
        <SignupOtpStep
          onSuccess={() => setStep("complete")}
          onBack={() => setStep("email")}
        />
      )}
      {step === "complete" && (
        <SignupCompleteStep onBack={() => setStep("otp")} />
      )}
    </AuthShell>
  );
}
