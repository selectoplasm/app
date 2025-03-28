import type { Plugin } from "vite";

declare module "selectoplasm/vite" {
  export function selectoplasmServePlugins(): Plugin;
  export function selectoplasm(): Plugin;
  export function selectoplasmFileSaver(): Plugin;
}
