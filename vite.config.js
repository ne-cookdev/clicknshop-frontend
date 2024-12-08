import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/",
  server: {
    port: 5173,
    host: "0.0.0.0",
    watch: {
      usePolling: true,
    },
    hmr: { host: "0.0.0.0" },
  },
  build: {
    target: "esnext", //browsers can handle the latest ES features
  },
  plugins: [react()],
});
