const fs = require('fs')
const path = require('path')

function ExtractObjectsFromForm(formData, formBoundary){
    
    let objs = formData.join('').split('--'+formBoundary)

    for(let i = 0; i < objs.length; i++)
    {
        
        if(!objs[i].includes('Content-Disposition: form-data; name="'))
            continue

        try{
            fs.unlinkSync(__dirname +"\\incomingFiles\\"+"foo" + i, function(err)
            {
                if(err) return console.log(err);
                console.log('file deleted successfully');
            }); 
        }
        catch(error)
        {
            console.log("Error while deleting incoming file" + error)
        }

        let [header, content] = objs[i].split("\r\n\r\n")
        console.log("content " + content.slice(0, 20))
        console.log("headers: " + header)
        fs.closeSync(fs.openSync(__dirname +"\\incomingFiles\\"+"foo" + i, "w"))

        const stream = fs.createWriteStream(__dirname +"\\incomingFiles\\"+"foo" + i, {flag: "a", encoding: 'latin1'})
        stream.write(content.replaceAll("\r\n", ''),)
        
        stream.close();
         //fs.writeFileSync(__dirname +"\\incomingFiles\\"+"foo" + i, Buffer.from(objs[i]));


    }

    

    return objs
}

module.exports.ExtractObjectsFromForm = ExtractObjectsFromForm;

function CheckFiles()
{

}

function CheckJPEG()
{   

    path.extname('index.html')
}