import { defineConfig, loadEnv } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { nitro } from "nitro/vite";

export default defineConfig(({ mode }) => {
  // Make non-VITE_ variables from .env (e.g. SUPABASE_SERVICE_ROLE_KEY) available to server code locally.
  // On Vercel they already exist in process.env, so nothing is overwritten.
  const fileEnv = loadEnv(mode, process.cwd(), "");
  for (const [key, value] of Object.entries(fileEnv)) {
    if (process.env[key] === undefined) process.env[key] = value;
  }

  return {
    plugins: [
      tsConfigPaths(),
      // Uses src/server.ts (SSR error wrapper) as the server entry.
      tanstackStart({ server: { entry: "server" } }),
      // Nitro auto-detects the host (Vercel, Netlify, Cloudflare...) at build time.
      nitro(),
      viteReact(),
      tailwindcss(),
    ],
  };
});
