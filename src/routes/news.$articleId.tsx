import { createFileRoute } from "@tanstack/react-router";
// @ts-ignore js module
import NewsArticle from "../screens/NewsArticle";
import { TabScreen } from "../lib/gate";

export const Route = createFileRoute("/news/$articleId")({
  component: () => (
    <TabScreen>
      <NewsArticle />
    </TabScreen>
  ),
  head: () => ({ meta: [{ title: "Article" }] }),
});