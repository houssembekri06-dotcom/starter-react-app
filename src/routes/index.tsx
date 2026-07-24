import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Application React" },
      { name: "description", content: "Une application React vide prête à être construite." },
      { property: "og:title", content: "Application React" },
      { property: "og:description", content: "Une application React vide prête à être construite." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function Index() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background text-foreground">
      <h1 className="text-2xl font-semibold">Application React vide</h1>
    </main>
  );
}
