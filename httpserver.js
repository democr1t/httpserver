const http = require('http') // Чтобы использовать HTTP-интерфейсы в Node.js
// const fs = require('fs') // Для взаимодействия с файловой системой
const path = require('path') // Для работы с путями файлов и каталогов
const url = require('url') // Для разрешения и разбора URL
const port = 8000;
const host = "localhost"
const fs = require('fs').promises;
const streamBuffer = require('node:stream').promises


const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.ico': 'image/x-icon',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.json': 'application/json',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2'
  }

  const requestListener = function (req, res) {
    
    let contentType = req.headers['Content-Type'];

    if(req.url.includes("/assets/"))
    {
        fs.readFileSync(__dirname + req.url)
        .then(contents => {
            res.setHeader("Content-Type", "text/css");
            res.writeHead(200);
            res.end(contents);
           
        }).catch(err => {
            res.writeHead(500);
            res.end(err);
            
        });
        return  
    }

    // if(contentType != "application/json")
    // {
    //     res.writeHead(400);
    //     res.end(`{"message": "header "content=type" must be 'application.json'"}`);
    // }

    switch (req.url) {
        case "/page":
            fs.readFileSync(__dirname + "/index.html")
        .then(contents => {
            res.setHeader("Content-Type", "text/html");
            res.writeHead(200);
            res.end(contents);
        }).catch(err => {
            res.writeHead(500);
            res.end(err);
            return;
        });
            break
        default: res.setHeader("Content-Type", "application/json");
                res.writeHead(200);
                res.end(`{"message": "This is a JSON response"}`);
                break;
  };
}

  const server = http.createServer(requestListener);
  server.listen(port, host, () => {
      console.log(`Server is running on http://${host}:${port}`);
  });