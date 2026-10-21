import { createFileRoute, redirect } from "@tanstack/react-router";
import { getAuthToken } from "../lib/api-client";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({ to: getAuthToken() ? "/dashboard" : "/signin" });
  },
});
