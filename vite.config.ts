import { green, blue, bold } from "picocolors";
import { defineConfig } from "vite";
import removeConsole from "vite-plugin-remove-console";
import { resolve } from "path";
import svgLoader from "vite-svg-loader";
import { visualizer } from "rollup-plugin-visualizer";
import vueJsx from "@vitejs/plugin-vue-jsx";
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import AutoImport from 'unplugin-auto-import/vite';
import vue from "@vitejs/plugin-vue";


/** 路径查找 */
const pathResolve = (dir: string): string => {
  return resolve(__dirname, ".", dir);
};

/** 设置别名 */
const alias: Record<string, string> = {
  "@": pathResolve("src"),
  "@build": pathResolve("build")
};


const buildStar = () =>{
  console.log(
    bold(
      green(
        `当你看到这段文案就代表👏项目已经启动成功${blue("持续回更新")}`
      )
    )
  );
}

// https://vitejs.dev/config/
export default defineConfig(( command, mode, ssrBuild ) => {
  console.log(command, mode, ssrBuild)
  return {
    resolve: {
      alias
    },
    // 服务端渲染
    server: {
      // 是否开启 https
      https: false,
      // 端口号
      port: 8888,
      host: "0.0.0.0",
      // 本地跨域代理 https://cn.vitejs.dev/config/server-options.html#server-proxy
      proxy: {
        // 使用 proxy 实例
        '/api': {
          target: 'http://jsonplaceholder.typicode.com',
          changeOrigin: true,
          configure: (proxy, options) => {
            // proxy 是 'http-proxy' 的实例
          }
      }
    },
    },
    plugins: [
      vue(),
      // 支持tsx,jsx语法
      vueJsx(),
      // 运行输出文案
      buildStar(),
      // 线上环境删除console
      removeConsole(),
      // svg组件化支持
      svgLoader(),
       // 打包分析
      visualizer({ open: true, brotliSize: true, filename: "report.html" }),
      AutoImport({
        imports: ['vue', 'vue-router', 'pinia'], // 自动导入vue和vue-router的相关函数
        dts: 'src/auto-import.d.ts', // 自动生成 'auto-import.d.ts'全局声明
        resolvers: [ElementPlusResolver()],
      }),
      ,
      Components({
        resolvers: [ElementPlusResolver()],
      })
    ],
    build: {
      sourcemap: false,
      // 消除打包大小超过500kb警告
      chunkSizeWarningLimit: 4000,
      rollupOptions: {
        input: {
          index: pathResolve("index.html")
        },
        // 静态资源分类打包
        output: {
          chunkFileNames: "static/js/[name]-[hash].js",
          entryFileNames: "static/js/[name]-[hash].js",
          assetFileNames: "static/[ext]/[name]-[hash].[ext]"
        }
      }
    },
  }
})