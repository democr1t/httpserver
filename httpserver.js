const http = require('http') // Чтобы использовать HTTP-интерфейсы в Node.js
const fs = require('fs') // Для взаимодействия с файловой системой
const path = require('path') // Для работы с путями файлов и каталогов
const url = require('url'); // Для разрешения и разбора URL
const port = 8000;
const host = "localhost"
var formConverter = require("./formConverter.js");
const { error } = require('console');
// const fs = require('fs').promises;
const streamBuffer = require('node:stream').promises
const imageSize = require('image-size')

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
        case "/files":
            if(req.method == "GET")
            {
                try
                {
                    const file = fs.readFileSync(__dirname + "/files.html")  
                        
                    res.setHeader("Content-Type", "text/html");
                    res.writeHead(200);
                    res.end(file, "utf-8");
                }
                catch(error)
                {
                    res.writeHead(404)
                    res.end("Switch Error: " + JSON.stringify(error))
                }
            
            }
            if(req.method == "POST")
            {
                const formBoundary = req.headers['content-type'].split("; ")[1].split("=")[1];
                // console.log("REQ HEADERS:" + req.headers)
                // console.log("CT:" + req.headers['content-type'])
                // console.log("boundary: " + formBoundary)
                let data
                const chunks = []
                req.setEncoding('latin1')
                
                req.on('data', (chunk) => {
                    chunks.push(chunk)
                });
                
                req.on("end", () => {
                    let objects = formConverter.ExtractObjectsFromForm(chunks, formBoundary).then((isFilesEnd) => {
                        if(isFilesEnd)
                        {
                            CheckJPGPromise().then((respTxt) => {
                                // console.log(respTxt)
                                objects['checkJPGTxt'] = respTxt
                                
                                CheckTXT().then((txtCheckResponse) => {
                                    objects['txtResult'] = txtCheckResponse
                                    res.end(JSON.stringify(objects, null, 2))
                                })                      
                            })
                        }
                    }).catch((any) => {
                        objects['res'] = any
                        res.end(JSON.stringify(objects, null, 2))
                    })                             
                })
                
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
                        // let data = req.trailers
                        // console.log(req)
                        let data
                        const chunks = []
                        
                        req.on('data', (chunk) => {
                            chunks.push(chunk)
                        });
                        
                        req.on("end", () => {
                         
                            data = Buffer.concat(chunks);
                            console.log("data on end: " + data)
                            data = data.toString()
                            data = new URLSearchParams(data)
                            const obj = {}

                            for (const key of data.keys()) {     
                                obj[key] = data.get(key);
                            }
                            console.log(JSON.stringify(obj, null, 2))
                            res.setHeader("Content-Type", "application/json");                           
                            res.writeHead(200);
                            res.end(JSON.stringify(obj, null, 2) + JSON.stringify({"message": "LOGIN OK"}, null, 2));                        
                        })
                        
                    break
            }
            break
        case "/test":
            res.writeHead(200, null,
                {
                    'Content-Type': "text/html",
                })
            res.write(GetHeader())
            res.write(GetBody())
            res.write(GetFooter())
            res.end()
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
function CheckJPGPromise(){
    return new Promise((resolve, reject) => {
        const responseText = {
            "text": "No JPG files checked"
        }
        try {
            const dimension = imageSize(__dirname + '/incomingFiles/foo1.jpg')
    
            // console.log("dimensions: " + dimension)
            // console.log(dimension.width) // Image width
            // console.log(dimension.height) // Image height
            responseText['width'] = dimension.width
            responseText['height'] = dimension.height
            if(dimension.width == 1512 && dimension.height == 2016)
                responseText.text = "Resolution is right"
            else
                responseText.text = "Resolution is wrong"
        } catch (error) {
            // Handle error here
            responseText.text = error;
        }
    
        resolve(responseText)
      });
} 

function CheckTXT(){
    return new Promise((resolve,reject) => {
        const responseText = {
            "text": "No JPG files checked"
        }

        // const stream = fs.createReadStream('./incomingFiles/foo2.txt')
        
    var array = fs.readFileSync('./incomingFiles/foo2.txt').toString().split("\n");
    for(i in array) {
        console.log(i)
        console.log(array[i]);
    }
        responseText.text = CheckFirstLine(array[0]);
        resolve(responseText)
    })
}

function CheckFirstLine(firstLine)
{
    console.log("firstLine: " + firstLine)
    console.log("typeof: "+ typeof(firstLine))
    // firstLine === "Hello world!"
    console.log(firstLine === 'Hello world')
    if(firstLine === "Hello world!")
        return "First line is right"
    else
        return "First line is wrong"
}