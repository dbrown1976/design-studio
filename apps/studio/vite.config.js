import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Local only: mirror production Studio path rewrites to the Campaign
      // Production Next app. Production routing stays in vercel.json.
      "/ai-campaign-production": {
        target: "http://localhost:3000",
        changeOrigin: true,
        ws: true
      }
    }
  }
});
