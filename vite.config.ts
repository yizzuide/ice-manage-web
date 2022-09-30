import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import path from "path";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import {
  createStyleImportPlugin,
  ElementPlusResolve,
} from "vite-plugin-style-import";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  console.log("vite mode: ", mode);
  console.log("node mode: ", process.env.NODE_ENV);
  // 环境配置可根据 mode =? dev or prod
  return {
    envDir: path.resolve(process.cwd(), "./src/config"),
    envPrefix: ["VITE", "__"],
    define: {
      // Tree shaking vue 2.x options API
      __VUE_OPTIONS_API__: false,
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    // css预处理
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: "@use '@/styles/element/index.scss' as *;",
        },
      },
    },
    plugins: [
      vue({
        // Applies to SFCs and js(x)/ts(x) files.
        reactivityTransform: true,
      }),
      // jsx render
      vueJsx(),
      // element-plus按需引入
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
      // element-plus自动导入样式
      createStyleImportPlugin({
        resolves: [ElementPlusResolve()],
        libs: [
          {
            libraryName: "element-plus",
            esModule: true,
            resolveStyle: (name: string) => {
              return `element-plus/theme-chalk/${name}.css`;
            },
          },
        ],
      }),
      // 按需导入sass样式
      Components({
        resolvers: [
          ElementPlusResolver({
            importStyle: "sass",
            // directives: true,
            // version: "2.1.5",
          }),
        ],
      }),
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
