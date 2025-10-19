var { Server } = require("socket.io");
const { Memorice } = require('./socket-events-server.js');

var http = require('http');
var fs = require('fs');
var path = require('path');

var extFiles = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg'
};

const nodeServer = http.createServer((req, res) => {
    
    // 1. Definir la ruta base:
    // path.join construye una ruta absoluta desde la carpeta 'server', luego sube (..) 
    // y entra a 'Client'
    let filePath = path.join(__dirname, '..', 'Client', req.url);

    // 2. Manejar la ruta raíz ('/')
    if (req.url === '/') {
        filePath = path.join(__dirname, '..', 'Client', 'index.html');
    }

    const ext = path.extname(filePath);
    const contentType = extFiles[ext];

    // 3. Verificación de Content-Type (SOLUCIÓN al ERR_HTTP_INVALID_HEADER_VALUE)
    if (!contentType) {
        // En este punto, solo Socket.IO podría estar usando una ruta sin extensión, 
        // y lo maneja automáticamente. Sin embargo, para peticiones directas:
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Error 404: Tipo de recurso no mapeado o ruta incorrecta.');
        return; 
    }

    // 4. Lectura de archivo de forma ASÍNCRONA (Mejor práctica y SOLUCIÓN al ENOENT)
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                // El archivo no existe en la ruta construida
                res.writeHead(404);
                res.end(`Archivo no encontrado: ${req.url}`);
            } else {
                // Otros errores del servidor
                res.writeHead(500);
                res.end(`Error de servidor: ${error.code}`);
            }
        } else {
            // Éxito: Enviar el archivo
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });

});

const io = new Server(nodeServer);

io.on('connection', Memorice(io));

const PORT = 3000;

nodeServer.listen(PORT, () => {
    console.log(`Servidor en el puerto http://localhost:${PORT}`);
});