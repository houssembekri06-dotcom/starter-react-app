import { createFileRoute } from "@tanstack/react-router";
// @ts-ignore js module
import AssetDetail from "../screens/AssetDetail";
import { Gate } from "../lib/gate";

export const Route = createFileRoute("/asset/$assetId")({
  component: () => (
    <Gate>
      <AssetDetail />
    </Gate>
  ),
  head: () => ({ meta: [{ title: "Asset" }] }),
});