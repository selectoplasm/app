import fs from "fs";
import path from "path";
import { promisify } from "util";

// Convert fs functions to promises
const readFile = promisify(fs.readFile);
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

const PLUGIN_FILES = {
   config: "config.html",
   previewHtml: "preview.html",
   previewCss: "preview.css",
   patternsHtml: "patterns.html",
   patternsCss: "patterns.css",
   staticCss: "static.css",
   utilityCss: "utility.css",
};

export default function pluginServeVite() {
   return {
      name: "selectoplasm-plugin-server",
      apply: "serve",

      configureServer(server) {
         // Serve worker files
         server.middlewares.use("/plugin-workers/", async (req, res) => {
            try {
               const workerPath = path.join(
                  process.cwd(),
                  ".selectoplasm/plugins",
                  req.url.replace("/plugin-workers/", ""),
               );
               if (await pathExists(workerPath)) {
                  const content = await readFile(workerPath, "utf-8");
                  res.setHeader("Content-Type", "application/javascript");
                  res.end(content);
               } else {
                  res.statusCode = 404;
                  res.end();
               }
            } catch (error) {
               console.error("Error serving worker:", error);
               res.statusCode = 500;
               res.end();
            }
         });

         // Serve plugins API
         server.middlewares.use(
            "/api/selectoplasm-plugins",
            async (req, res) => {
               try {
                  const plugins = await loadPlugins();
                  res.setHeader("Content-Type", "application/json");
                  res.end(JSON.stringify({ plugins }));
               } catch (error) {
                  console.error("Error serving plugins:", error);
                  res.statusCode = 500;
                  res.end(JSON.stringify({ error: "Internal server error" }));
               }
            },
         );
      },
   };
}

// Helper function to check if path exists
async function pathExists(path) {
   try {
      await stat(path);
      return true;
   } catch {
      return false;
   }
}

async function loadPlugins() {
   const pluginsDir = path.resolve(process.cwd(), ".selectoplasm/plugins");

   if (!(await pathExists(pluginsDir))) {
      return {};
   }

   const pluginFolders = await readdir(pluginsDir);
   const pluginPromises = pluginFolders.map((pluginName) =>
      loadPlugin(pluginsDir, pluginName),
   );

   const loadedPlugins = await Promise.all(pluginPromises);

   return Object.fromEntries(
      loadedPlugins.filter(Boolean).map((plugin) => [plugin.name, plugin]),
   );
}

async function loadPlugin(pluginsDir, pluginName) {
   const pluginPath = path.join(pluginsDir, pluginName);
   const readmePath = path.join(pluginPath, "README.md");

   try {
      if (!(await pathExists(readmePath))) {
         return null;
      }

      const files = await loadPluginFiles(pluginPath);

      // Add worker URL if worker exists
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

async function loadPluginFiles(pluginPath) {
   const filePromises = Object.entries(PLUGIN_FILES).map(
      async ([key, filename]) => {
         try {
            const filePath = path.join(pluginPath, filename);
            const content = await readFile(filePath, "utf-8");
            return [key, content];
         } catch {
            return [key, undefined];
         }
      },
   );

   const fileEntries = await Promise.all(filePromises);
   return Object.fromEntries(
      fileEntries.filter(([_, content]) => content !== undefined),
   );
}
