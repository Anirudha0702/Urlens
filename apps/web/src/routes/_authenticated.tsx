import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { getAuthToken } from "../lib/api-client";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: () => {
    if (!getAuthToken()) {
      throw redirect({ to: "/signin" });
    }
  },
  component: Outlet,
});
