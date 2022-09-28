import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // 环境配置可根据 mode =? dev or prod
  return {
    envDir: path.resolve(process.cwd(), "./src/config"),
    envPrefix: ["VITE", "__"],
    define: {
      __VUE_OPTIONS_API__: false,
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    plugins: [
      vue({
        // Applies to SFCs and js(x)/ts(x) files.
        reactivityTransform: true,
      }),
      vueJsx(),
    ],
    server: {
      port: 5173,
      proxy: {
        "/api": {
          secure: false,
          changeOrigin: true,
          target: "http://localhost:8091",
          rewrite: (path) => path.replace(/^\/api/, ""),
          bypass: function (req, res, proxyOptions) {
            if (req?.headers.accept?.indexOf("html") !== -1) {
              console.log("Skipping proxy for browser request.");
              return "/index.html";
            }
          },
        },
      },
    },
  };
});
