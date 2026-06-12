import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
    spa: {
      enabled: true,
      prerender: {
        outputPath: "/index.html",
        crawlLinks: true,
      },
      // optionnel: prerendre aussi d'autres routes en HTML
    },
    prerender: {
      enabled: true,
      crawlLinks: true,
      // ajoute ici les routes publiques connues
      routes: ["/", "/login"],
    },
  },
});