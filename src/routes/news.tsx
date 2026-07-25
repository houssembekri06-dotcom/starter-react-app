import { createFileRoute } from "@tanstack/react-router";
// @ts-ignore js module
import News from "../screens/News";
import { TabScreen } from "../lib/gate";

export const Route = createFileRoute("/news")({
  component: () => (
    <TabScreen>
      <News />
    </TabScreen>
  ),
  head: () => ({ meta: [{ title: "News" }] }),
});
