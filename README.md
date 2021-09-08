# Vue 3 + Typescript + Vite + Echarts

This template should help get you started developing with Vue 3  Typescript in Vite.

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar)

## Docs

+ Tutorial
    + [中文](https://echarts.apache.org/zh/tutorial.html)
    + [English](https://echarts.apache.org/en/tutorial.html)

+ API
    + [中文](https://echarts.apache.org/zh/api.html)
    + [English](https://echarts.apache.org/en/api.html)

+ Option Manual
    + [中文](https://echarts.apache.org/zh/option.html)
    + [English](https://echarts.apache.org/en/option.html)

## Build

```shell
    npm install
    npm run dev
    或 
    yarn 
    yarn dev
```


## Type Support For `.vue` Imports in TS

Since TypeScript cannot handle type information for `.vue` imports, they are shimmed to be a generic Vue component type by default. In most cases this is fine if you don't really care about component prop types outside of templates. However, if you wish to get actual prop types in `.vue` imports (for example to get props validation when using manual `h(...)` calls), you can enable Volar's `.vue` type support plugin by running `Volar: Switch TS Plugin on/off` from VSCode command palette.
