import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),

    VitePWA({
      registerType: "autoUpdate",

      manifest: {
        name: "HOMEKART",
        short_name: "HOMEKART",
        description: "Your Daily Household Essentials Store",

        theme_color: "#ff8c00",
        background_color: "#ffffff",

        display: "standalone",

        start_url: "/",
        scope: "/",

        icons: [
          {
            src: "/pwa-192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/pwa-512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ],

        screenshots: [
          {
            src: "/pwa-512.png",
            sizes: "512x512",
            type: "image/png",
            form_factor: "wide"
          },
          {
            src: "/pwa-512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      }
    })
  ]
});