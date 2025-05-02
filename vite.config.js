/** @format */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  preview: {
    host: true, // ou spécifie directement l'IP si besoin
    port: 4173, // ou autre port si modifié
    allowedHosts: ["preprod.hellosoins.com", "hellosoin.com"],
  },
});
