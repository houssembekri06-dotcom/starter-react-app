import { createFileRoute } from "@tanstack/react-router";
// @ts-ignore js module
import Profile from "../screens/Profile";
import { TabScreen } from "../lib/gate";

export const Route = createFileRoute("/profile")({
  component: () => (
    <TabScreen>
      <Profile />
    </TabScreen>
  ),
  head: () => ({ meta: [{ title: "Profil" }] }),
});