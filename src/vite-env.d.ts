/// <reference types="vite/client" />
/// reactivity transform macros
/// <reference types="vue/macros-global" />
/// svg-loader
/// <reference types="vite-svg-loader" />

declare module '*.vue' {
  import type {DefineComponent, FunctionalComponent} from 'vue'
  const component: DefineComponent<{}, {}, any> | FunctionalComponent
  export default component
}
