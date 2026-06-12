import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
    spa: {
      enabled: true,
      prerender: {
        outputPath: "/index.html",
        crawlLinks: false,
      },
    },
    prerender: {
      enabled: true,
      crawlLinks: false,
      routes: [
        "/",
        "/login",
        "/dashboard",
        "/dashboard/academie",
        "/dashboard/codeveloppement",
        "/dashboard/parti",
        "/dashboard/talents",
      ],
    },
  },
});