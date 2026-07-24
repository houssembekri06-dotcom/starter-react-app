import { createFileRoute } from "@tanstack/react-router";
// @ts-ignore js module
import Home from "../screens/Home";
import { TabScreen } from "../lib/gate";

export const Route = createFileRoute("/home")({
  component: () => (
    <TabScreen>
      <Home />
    </TabScreen>
  ),
  head: () => ({ meta: [{ title: "Accueil" }] }),
});