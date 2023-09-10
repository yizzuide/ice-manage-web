import { ConfigEnv, defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import svgLoader from "vite-svg-loader";
import path from "path";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import {
  createStyleImportPlugin,
  ElementPlusResolve,
} from "vite-plugin-style-import";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }: ConfigEnv) => {
  console.log("vite mode: ", mode);
  console.log("node mode: ", process.env.NODE_ENV);
  const env = loadEnv(mode, path.resolve(process.cwd(), "./src/config"), "__");
  console.log("env: ", env);
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
    css: {
      preprocessorOptions: {
        // 添加变量预处理
        scss: {
          additionalData: "@use '@/styles/define.scss' as *;",
          javascriptEnabled: true,
        },
      },
    },
    plugins: [
      vue(),
      // jsx render
      vueJsx(),
      // svg-loader
      svgLoader(),
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
    ],
    server: {
      port: Number.parseInt(env.__PROXY_SERVER_PORT),
      proxy: {
        "/api": {
          secure: false,
          changeOrigin: true,
          target: env.__PROXY_HOST_URL,
          rewrite: (path) => path.replace(/^\/api/, ""),
          bypass: function (req, res, proxyOptions) {
            if (req?.headers.accept?.indexOf("html") !== -1) {
              console.log("Skipping proxy for browser request.");
              return "/";
            }
          },
        },
      },
    },
  };
});
