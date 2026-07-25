import { createFileRoute } from "@tanstack/react-router";
// @ts-ignore js module
import Onboarding from "../screens/Onboarding";

export const Route = createFileRoute("/onboarding")({
  component: Onboarding,
  head: () => ({ meta: [{ title: "Welcome" }] }),
});