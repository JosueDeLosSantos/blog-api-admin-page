import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import ckeditor5 from "@ckeditor/vite-plugin-ckeditor5";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    ckeditor5({ theme: require.resolve("@ckeditor/ckeditor5-theme-lark") }),
  ],
  server: {
    // Enable SPA Fallback
    //@ts-expect-error
    // 'historyApiFallback' does not exist in type 'ServerOptions
    historyApiFallback: true,
  },
});
