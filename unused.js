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