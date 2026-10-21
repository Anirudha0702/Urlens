import { useMemo, useSyncExternalStore } from "react";
import { signupFlow } from "./signup-flow-store";

export function useSignupFlow() {
  const state = useSyncExternalStore(
    signupFlow.subscribe,
    signupFlow.get,
    signupFlow.get,
  );

  return useMemo(
    () => ({
      ...state,
      setEmail: signupFlow.setEmail,
      setVerificationToken: signupFlow.setVerificationToken,
      reset: signupFlow.reset,
    }),
    [state],
  );
}
