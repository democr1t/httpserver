const http = require('http') // Чтобы использовать HTTP-интерфейсы в Node.js
const fs = require('fs') // Для взаимодействия с файловой системой
const path = require('path') // Для работы с путями файлов и каталогов
const url = require('url'); // Для разрешения и разбора URL
const port = 8000;
const host = "localhost"
// const fs = require('fs').promises;
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

    if(processStaticStream(req,res))
        return
    // processStatic(req,res)

    switch (req.url) {
        case "/page":
        try
        {
            const file = fs.readFileSync(__dirname + "/index.html")  
                 
            res.setHeader("Content-Type", "text/html");
            res.writeHead(200);
            res.end(file, "utf-8");
        }
        catch(error){
         res.writeHead(404)
         res.end("Switch Error: " + JSON.stringify(error))
        }
            break
        default: 
                res.setHeader("Content-Type", "application/json");
                res.writeHead(404);
                res.end(`{"message": "Path not found"}`);
                break;
  };
}

  const server = http.createServer(requestListener);
  server.listen(port, host, () => {
      console.log(`Server is running on http://${host}:${port}`);
  });

  function processStatic(req,res)
  { 
    if(req.url.includes("/assets/"))
    {
       try
       {
        const file = fs.readFileSync(__dirname + req.url)       
            res.setHeader("Content-Type", "text/css");
            res.writeHead(200);
            res.end(file);
       }
       catch(error){
        res.writeHead(404)
        res.end("processStaticError: " + JSON.stringify(error))
       }
    }
  }

  function processStaticStream(req,res)
  { 
    if(req.url.includes("/assets/"))
    {
       try
       {
        const fileStream = fs.createReadStream(__dirname + req.url)
        console.log("req.url: " +  req.url)
        console.log("__dirname + req.url: " +  __dirname + req.url)
        res.setHeader('Content-Type', "text/css")
        res.writeHead(200)
        fileStream.pipe(res)
        return true;
        //, {end:false}
        // fileStream.on("end", () => res.end())
       }
       catch(error){
        console.log("processStaticError: " + JSON.stringify(error))
        return false
       }
    }
    return false
  }

  function GetHeader()
{
    return `<header> </header>`
}