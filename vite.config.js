import { defineConfig, loadEnv } from "vite";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";

const rootDir = dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, rootDir, "");
  const rawBaseUrl = (env.VITE_API_BASE_URL || "").trim();

  let proxy = undefined;

  if (rawBaseUrl) {
    try {
      const parsedUrl = new URL(rawBaseUrl);
      const apiPathPrefix = parsedUrl.pathname.replace(/\/$/, "");

      proxy = {
        "/api-proxy": {
          target: parsedUrl.origin,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api-proxy/, apiPathPrefix),
        },
      };
    } catch {
      proxy = undefined;
    }
  }

  return {
    plugins: [react()],
    server: {
      proxy,
    },
  };
});
