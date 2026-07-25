import { createFileRoute } from "@tanstack/react-router";
// @ts-ignore js module
import Login from "../screens/Login";

export const Route = createFileRoute("/login")({
  component: Login,
  head: () => ({ meta: [{ title: "Sign in" }] }),
});