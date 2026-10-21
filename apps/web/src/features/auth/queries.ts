import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { clearAuthToken, getAuthToken } from "../../lib/api-client";
import {
  completeSignup,
  fetchCurrentUser,
  requestSignupOtp,
  signin,
  signout,
  verifySignupOtp,
} from "./api";
import type { AuthSession } from "./types";

export const authKeys = {
  all: ["auth"] as const,
  me: () => [...authKeys.all, "me"] as const,
};

export const currentUserQueryOptions = () =>
  queryOptions({
    queryKey: authKeys.me(),
    queryFn: fetchCurrentUser,
    enabled: Boolean(getAuthToken()),
    retry: false,
    staleTime: 60_000,
  });

export function useRequestSignupOtp() {
  return useMutation({ mutationFn: requestSignupOtp });
}

export function useVerifySignupOtp() {
  return useMutation({ mutationFn: verifySignupOtp });
}

export function useCompleteSignup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: completeSignup,
    onSuccess: (session: AuthSession) => {
      queryClient.setQueryData(authKeys.me(), session.user);
    },
  });
}

export function useSignin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: signin,
    onSuccess: (session: AuthSession) => {
      queryClient.setQueryData(authKeys.me(), session.user);
    },
  });
}

export function useSignout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: signout,
    onSettled: () => {
      clearAuthToken();
      queryClient.removeQueries({ queryKey: authKeys.all });
    },
  });
}
