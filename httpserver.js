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

    if(processApi(req,res))
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
        case "/about":
            try
            {
                const file = fs.readFileSync(__dirname + "/about.html")  
                     
                res.setHeader("Content-Type", "text/html");
                res.writeHead(200);
                res.end(file, "utf-8");
            }
            catch(error){
             res.writeHead(404)
             res.end("Switch Error: " + JSON.stringify(error))
            }
            break
        case "/login": 
            switch(req.method)
            {
                case "GET":
                    try
                    {
                        const file = fs.readFileSync(__dirname + "/login.html")  
                             
                        res.setHeader("Content-Type", "text/html");
                        res.writeHead(200);
                        res.end(file, "utf-8");
                    }
                    catch(error){
                     res.writeHead(404)
                     res.end("Switch Error: " + JSON.stringify(error))
                    }
                    break
                case "POST":
                        let data = req.trailers
                        // console.log(req)
                        req.on('data', (chunk) => {
                            data += chunk;
                        });
                        console.log("req.tralilers: " + req.trailers)
                        console.log("req.rawTralilers: " + req.rawTrailers)
                        console.log(data)
                        res.setHeader("Content-Type", "application/json");
                        res.writeHead(200);
                        res.end(JSON.stringify(data) + `{"message": "LOGIN OK"}`);
                    break
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

  

  function processStaticStream(req,res)
  { 
    if(req.url.includes("/assets/"))
    {
       try
       {
        const fileStream = fs.createReadStream(__dirname + req.url)
        console.log("req.url: " +  req.url)
        console.log("__dirname + req.url: " +  __dirname + req.url)
        console.log("mimeType: " + mimeTypes[path.extname(req.url)])
        res.setHeader('Content-Type', mimeTypes[path.extname(req.url)])
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

 function processApi(req,res)
  {
    if(req.url.includes("api"))
    {
        switch(req.url)
        {
            case "/api/getshowlist":
                res.setHeader('Content-Type', "application/json")
                const showList = ["Dicktator", "Kekmek"]
                res.writeHead(200)
                res.end(JSON.stringify(showList))
                return true;         
        }
    }
    
    return false;
  }

  function GetHeader()
{
    return `
    <header class="main-header">
        <form action="/search" method="get">
            <label for="search-input">Search:</label>
            <input type="text" id="search-input" name="q" placeholder="Search...">
            <button type="submit">Search</button>
        </form>		
    </header>
    `
}

function GetBody()
{
    return `
    <body>
        <section>
        </section>
    </body>
    `
}

function GetFooter(){
    return `
    <footer>
        <ul>
            <li>first item</li>
        </ul>
    </footer>
    `
}