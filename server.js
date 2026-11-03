const http = require('http');
const fs = require('fs');
const path = require('path');
const testBlq = require('./testBlq');

const PORT = 3000;

// Serve static files from the current directory
const staticPath = path.join(__dirname);

const server = http.createServer((req, res) => {
    const requestUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    let requestPath;

    try {
        requestPath = decodeURIComponent(requestUrl.pathname);
    } catch (e) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Bad Request');
        return;
    }

    const requestedResource = requestPath === '/' ? 'index.html' : requestPath;
    const filePath = path.resolve(staticPath, `.${requestedResource}`);

    if (filePath !== staticPath && !filePath.startsWith(staticPath + path.sep)) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('Forbidden');
        return;
    }

    const extname = path.extname(filePath);
    let contentType = 'text/html';

    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
            contentType = 'image/jpg';
            break;
    }

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 Not Found</h1>', 'utf-8');
            } else {
                res.writeHead(500);
                res.end(`Server Error: ${err.code}`);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
