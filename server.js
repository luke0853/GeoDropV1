const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3000;
const HOST = 'localhost';
const API_KEY = 'MISSING_GOOGLE_PLACES_API_KEY';

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.ico': 'image/x-icon',
    '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // Google Places API Proxy
    if (pathname.startsWith('/api/places/')) {
        const parts = pathname.split('/');
        const endpoint = parts[3];
        let apiPath = '';

        if (endpoint === 'search') {
            const query = parsedUrl.query.query;
            if (!query) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Fehlender query Parameter' }));
                return;
            }
            apiPath = `/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${API_KEY}`;
            console.log(`🔍 Suche Places für: ${query}`);
        } else if (endpoint === 'details') {
            const placeId = parts[4];
            apiPath = `/maps/api/place/details/json?place_id=${placeId}&fields=name,photos,formatted_address&key=${API_KEY}`;
            console.log(`🌍 Lade Places Details für: ${placeId}`);
        } else if (endpoint === 'photo') {
            const photoRef = parsedUrl.query.photo_reference;
            const maxWidth = parsedUrl.query.maxwidth || 800;
            if (!photoRef) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Fehlender photo_reference Parameter' }));
                return;
            }
            apiPath = `/maps/api/place/photo?maxwidth=${maxWidth}&photoreference=${photoRef}&key=${API_KEY}`;
            console.log(`📸 Lade Places Foto: ${photoRef}`);
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Unbekannter API-Endpunkt' }));
            return;
        }

        const proxyReq = https.request({ hostname: 'maps.googleapis.com', path: apiPath, method: 'GET' }, (proxyRes) => {
            res.writeHead(proxyRes.statusCode, proxyRes.headers);
            proxyRes.pipe(res);
        });
        proxyReq.on('error', (err) => {
            console.error(`❌ Proxy Fehler: ${err.message}`);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Interner Serverfehler' }));
        });
        proxyReq.end();
        return;
    }

    // Statische Dateien bereitstellen
    let filePath = path.join(__dirname, pathname);
    if (pathname === '/') {
        filePath = path.join(__dirname, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 - File Not Found</h1>');
            } else {
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.end('<h1>500 - Internal Server Error</h1>');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        }
    });
});

server.listen(PORT, HOST, () => {
    console.log(`🚀 Server läuft auf http://${HOST}:${PORT}`);
});