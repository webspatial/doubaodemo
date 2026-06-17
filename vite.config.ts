import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react({
      jsxImportSource: "@webspatial/react-sdk",
    }),
  ],
  server: {
    port: 5179,
    host: "127.0.0.1",
  },
});
