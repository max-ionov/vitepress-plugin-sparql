import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
    build: {
      lib: {
          entry: "./src/index.ts",
          name: "SparqlPlugin",
          fileName: (format) => `vitepress-plugin-sparql.${format}.js`
      },
      rollupOptions: {
          external: ['vue', 'vitepress'],
          output: {
              globals: {
                  vue: 'Vue',
                  vitepress: 'Vitepress'
              }
          }
      }
    }
});