import path from "path";
import { readFile, readdir, stat, mkdir } from "fs/promises";

const PLUGIN_FILES = {
   config: "config.html",
   previewHtml: "preview.html",
   previewCss: "preview.css",
   patternsHtml: "patterns.html",
   patternsCss: "patterns.css",
   staticCss: "static.css",
   utilityCss: "utility.css",
};

export async function pathExists(path: string) {
   try {
      await stat(path);
      return true;
   } catch {
      return false;
   }
}

export async function ensureDirectories(userProjectPath: string) {
   const dirs = [
      '.selectoplasm',
      '.selectoplasm/plugins',
      '.selectoplasm/output'
   ].map(dir => path.join(userProjectPath, dir));

   await Promise.all(
      dirs.map(dir => mkdir(dir, { recursive: true }))
   );
}

export async function loadPlugins(userProjectPath: string) {
   const pluginsDir = path.join(userProjectPath, ".selectoplasm/plugins");

   if (!(await pathExists(pluginsDir))) {
      return {};
   }

   const pluginFolders = await readdir(pluginsDir);
   const pluginPromises = pluginFolders.map((pluginName) =>
      loadPlugin(pluginsDir, pluginName)
   );

   const loadedPlugins = await Promise.all(pluginPromises);

   return Object.fromEntries(
      loadedPlugins.filter(Boolean).map((plugin) => [plugin.name, plugin])
   );
}

async function loadPlugin(pluginsDir: string, pluginName: string) {
   const pluginPath = path.join(pluginsDir, pluginName);
   const readmePath = path.join(pluginPath, "README.md");

   try {
      if (!(await pathExists(readmePath))) {
         return null;
      }

      const files = await loadPluginFiles(pluginPath);

      const workerPath = path.join(pluginPath, "worker.js");
      if (await pathExists(workerPath)) {
         files.workerUrl = `/plugin-workers/${pluginName}/worker.js`;
      }

      return {
         name: pluginName,
         ...files,
      };
   } catch (error) {
      console.error(`Error loading plugin ${pluginName}:`, error);
      return null;
   }
}

async function loadPluginFiles(pluginPath: string) {
   const filePromises = Object.entries(PLUGIN_FILES).map(
      async ([key, filename]) => {
         try {
            const filePath = path.join(pluginPath, filename);
            const content = await readFile(filePath, "utf-8");
            return [key, content];
         } catch {
            return [key, undefined];
         }
      }
   );

   const fileEntries = await Promise.all(filePromises);
   return Object.fromEntries(
      fileEntries.filter(([_, content]) => content !== undefined)
   );
}
