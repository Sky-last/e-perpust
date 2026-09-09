/**
 * Vite Plugin untuk handle PDF file serving dengan benar
 * 
 * Problem: Vite dev server mungkin tidak serve PDF files dengan MIME type yang benar
 * Solution: Plugin ini ensure semua request ke /buku_digital/*.pdf di-serve dengan correct headers
 */

import type { Plugin } from 'vite';
import fs from 'fs';
import path from 'path';

export function pdfPlugin(): Plugin {
  return {
    name: 'vite-plugin-pdf-server',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // Check if request is for a PDF file
        if (req.url && req.url.startsWith('/buku_digital/') && req.url.endsWith('.pdf')) {
          const pdfPath = path.join(process.cwd(), 'public', req.url);
          
          // Check if file exists
          if (fs.existsSync(pdfPath)) {
            const stat = fs.statSync(pdfPath);
            
            // Set proper headers for PDF
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Length', stat.size);
            res.setHeader('Content-Disposition', 'inline'); // Display in browser, not download
            res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 1 day
            res.setHeader('Access-Control-Allow-Origin', '*'); // CORS
            
            // Stream the PDF file
            const readStream = fs.createReadStream(pdfPath);
            readStream.pipe(res);
            
            readStream.on('error', (err) => {
              console.error(`Error streaming PDF ${req.url}:`, err);
              res.statusCode = 500;
              res.end('Internal Server Error');
            });
            
            return; // Don't call next(), we're handling this request
          } else {
            console.warn(`PDF not found: ${pdfPath}`);
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ 
              error: 'PDF not found',
              path: req.url,
              message: 'File PDF tidak ditemukan di server'
            }));
            return;
          }
        }
        
        // Pass through for non-PDF requests
        next();
      });
    }
  };
}
