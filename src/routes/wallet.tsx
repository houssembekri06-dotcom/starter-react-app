import { createFileRoute } from "@tanstack/react-router";
// @ts-ignore js module
import Wallet from "../screens/Wallet";
import { TabScreen } from "../lib/gate";

export const Route = createFileRoute("/wallet")({
  component: () => (
    <TabScreen>
      <Wallet />
    </TabScreen>
  ),
  head: () => ({ meta: [{ title: "Portefeuille" }] }),
});