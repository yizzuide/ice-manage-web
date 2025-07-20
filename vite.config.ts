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

export default defineConfig((_env: ConfigEnv) => {
  const env = loadEnv(
    _env.mode,
    path.resolve(process.cwd(), "./src/config"),
    "__"
  );
  console.log("node mode: ", process.env.NODE_ENV);
  console.log("env: ", env);
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
    // 确保支持 ?raw 导入
    assetsInclude: ["**/*.hbs"],
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
    build: {
      // 禁用CSS代码分割，将所有CSS打包到JS中
      cssCodeSplit: false,
      // 资源目录
      //assetsDir: "assets",
      rollupOptions: {
        output: {
          // 自定义文件命名，使用hash
          entryFileNames: 'js/[name].[hash].js',
          chunkFileNames: 'js/[name].[hash].js',
          assetFileNames: (assetInfo) => {
            // 图片资源放在images目录，使用hash
            // 遍历assetInfo.names
            let len = assetInfo.names.length;
            for(let i = 0; i < len; i++) {
              if (/\.(png|jpe?g|gif|svg|webp|ico)$/i.test(assetInfo.names[i] || '')) {
                return 'images/[name].[hash].[ext]';
              }
              // 其他资源使用hash
              return 'assets/[name].[hash].[ext]';
            }
          },
          // 手动控制代码分割，减少chunk数量
          manualChunks: (moduleId, meta) => {
            if (["vue", "vue-router", "pinia"].includes(moduleId)) {
              return "vue";
            }
            if (moduleId.includes("element-plus")) {
              return "element-plus";
            }
            return null;
          },
        },
      },
    },
  };
});
