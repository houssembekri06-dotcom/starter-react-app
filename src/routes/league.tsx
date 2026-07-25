import { createFileRoute } from "@tanstack/react-router";
// @ts-ignore js module
import League from "../screens/League";
import { TabScreen } from "../lib/gate";

export const Route = createFileRoute("/league")({
  component: () => (
    <TabScreen>
      <League />
    </TabScreen>
  ),
  head: () => ({ meta: [{ title: "League" }] }),
});