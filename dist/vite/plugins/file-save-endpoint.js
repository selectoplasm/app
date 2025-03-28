import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const outputPath = "./.selectoplasm/output";

const sendJson = (res, status, data) => {
   res.writeHead(status, { "Content-Type": "application/json" });
   res.end(JSON.stringify(data));
};

// Simple async request handler wrapper
const asyncHandler = (fn) => (req, res) => {
   Promise.resolve(fn(req, res)).catch(err => {
      console.error(err);
      sendJson(res, 500, { error: "Internal server error" });
   });
};

// Simple request body parser
const parseBody = async (req) => {
   return new Promise((resolve, reject) => {
      let data = '';
      req.on('data', chunk => {
         data += chunk;
      });
      req.on('end', () => {
         try {
            resolve(JSON.parse(data));
         } catch (err) {
            reject(err);
         }
      });
      req.on('error', reject);
   });
};

export default () => ({
   name: "file-save-endpoint",
   apply: "serve",
   configureServer(server) {
      // Handle GET /load
      server.middlewares.use('/load', asyncHandler(async (req, res) => {
         if (req.method !== 'GET') {
            return sendJson(res, 405, { error: "Method not allowed" });
         }

         const url = new URL(req.url, `http://${req.headers.host}`);
         const filename = url.searchParams.get("filename");

         if (!filename) {
            return sendJson(res, 400, { error: "Filename required" });
         }

         try {
            const content = await readFile(join(outputPath, filename), "utf8");
            sendJson(res, 200, { content });
         } catch (err) {
            if (err.code === 'ENOENT') {
               sendJson(res, 404, { error: "File not found" });
            } else {
               throw err;
            }
         }
      }));

      // Handle POST /save
      server.middlewares.use('/save', asyncHandler(async (req, res) => {
         if (req.method !== 'POST') {
            return sendJson(res, 405, { error: "Method not allowed" });
         }

         const body = await parseBody(req);
         const { filename, content } = body;

         if (!filename || content === undefined) {
            return sendJson(res, 400, { error: "Filename and content required" });
         }

         try {
            await mkdir(outputPath, { recursive: true });
            await writeFile(join(outputPath, filename), content);
            sendJson(res, 200, { message: "Saved" });
         } catch (err) {
            throw err;
         }
      }));
   },
});
