// @ts-nocheck
import { join } from "path";
import { readFile, writeFile } from "fs/promises";
import { ensureDirectories, loadPlugins } from "./helpers"

export async function startSelectoplasmDevServer(entryPointPath: string, userProjectPath: string, options = { port: 3000 }) {
   await ensureDirectories(userProjectPath);
   const outputPath = join(userProjectPath, ".selectoplasm/output");

   const routes = {
      "/plugin-workers/*": async (request: Request) => {
         const workerPath = join(
            userProjectPath,
            ".selectoplasm/plugins",
            new URL(request.url).pathname.replace("/plugin-workers/", "")
         );
         const content = await readFile(workerPath, "utf-8");
         return new Response(content, {
            headers: { "Content-Type": "application/javascript" }
         });
      },

      "/api/selectoplasm-plugins": async () =>
         Response.json({ plugins: await loadPlugins(userProjectPath) }),

      "/node_modules/selectoplasm/*": (request: Request) =>
         new Response(Bun.file(join(userProjectPath, new URL(request.url).pathname))),

      "/.selectoplasm/*": (request: Request) =>
         new Response(Bun.file(join(userProjectPath, new URL(request.url).pathname))),

      "/load": async (req: Request) => {
         if (req.method !== "GET") return Response.json({ error: "Method not allowed" }, { status: 405 });

         const filename = new URL(req.url).searchParams.get("filename");
         if (!filename) return Response.json({ error: "Filename required" }, { status: 400 });

         try {
            const content = await readFile(join(outputPath, filename), "utf8");
            return Response.json({ content });
         } catch (err) {
            return (err as any).code === "ENOENT"
               ? Response.json({ error: "File not found" }, { status: 404 })
               : Promise.reject(err);
         }
      },

      "/save": async (req: Request) => {
         if (req.method !== "POST") return Response.json({ error: "Method not allowed" }, { status: 405 });

         try {
            const { filename, content } = await req.json() as { filename: string, content: string };
            if (!filename || content === undefined) {
               return Response.json({ error: "Filename and content required" }, { status: 400 });
            }

            // Ensure output directory exists before saving
            await ensureDirectories(userProjectPath);
            await writeFile(join(outputPath, filename), content);
            return Response.json({ message: "Saved" });
         } catch (err) {
            console.error("Error saving file:", err);
            return Response.json({ error: "Internal server error" }, { status: 500 });
         }
      },

      "/": () => new Response(Bun.file(entryPointPath), {
         headers: { "Content-Type": "text/html" },
      }),

      "/*": (request: Request) => {
         const url = new URL(request.url);
         const filePath = join(userProjectPath, url.pathname);
         const fileExtension = url.pathname.split('.').pop();

         const mimeTypes: Record<string, string> = {
            'css': 'text/css',
            'js': 'application/javascript',
            'png': 'image/png',
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            // add more as needed
         };

         return new Response(Bun.file(filePath), {
            headers: {
               "Content-Type": mimeTypes[fileExtension ?? ''] || 'text/plain'
            }
         });
      },
   };

   Bun.serve({
      port: options.port,
      error: (error: Error) => {
         console.error("Server error:", error);
         return Response.json({ error: "Internal server error" }, { status: 500 });
      },
      routes,
   });

   console.log(`Development server running on http://localhost:${options.port}`);
}
