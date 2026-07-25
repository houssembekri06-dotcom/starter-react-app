import { createFileRoute } from "@tanstack/react-router";
// @ts-ignore js module
import Signup from "../screens/Signup";

export const Route = createFileRoute("/signup")({
  component: Signup,
  head: () => ({ meta: [{ title: "Create account" }] }),
});