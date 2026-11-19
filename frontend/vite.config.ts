/// <reference types="vitest/config" />
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const API_TARGET = process.env.API_URL ?? "http://127.0.0.1:8001";
const proxy = { "/api": { target: API_TARGET, changeOrigin: true } };

// GitHub Pages serves each site under /<repo>/; the deploy workflow sets BASE_PATH. Locally it stays "/".
const BASE = process.env.BASE_PATH ?? "/";
const SOURCE_FILE = /\/src\/.*\.(tsx?|json)$/;

/** Prefixes absolute /images/ paths in source strings with the base path (no-op when BASE is "/"). */
const basePublicPaths = (): Plugin => ({
  name: "base-public-paths",
  enforce: "pre",
  transform(code, id) {
    if (BASE === "/" || !SOURCE_FILE.test(id.replaceAll("\\", "/"))) return null;
    return code.replace(/(["'`])\/images\//g, `$1${BASE}images/`);
  },
});

export default defineConfig({
  base: BASE,
  plugins: [basePublicPaths(), react(), tailwindcss()],
  server: { port: 5171, strictPort: true, proxy },
  preview: { port: 5171, strictPort: true, proxy },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    css: false,
    coverage: { include: ["src/**/*.{ts,tsx}"], exclude: ["src/main.tsx", "src/test/**", "src/**/*.d.ts"] },
  },
});
