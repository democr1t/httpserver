const fs = require('fs')
const path = require('path')
const imageSize = require('image-size')
const replaceExt = require('replace-ext');

function ExtractObjectsFromForm(formData, formBoundary){
    

    // return result
    return new Promise(function(resolve, reject) 
    {
        let objs = formData.join('').split('--'+formBoundary)
        const fileNames = {
            1 : "foo1.jpg",
            2 : "foo2.txt"
        }

        for(let i = 0; i < objs.length; i++)
        {        
            if(!objs[i].includes('Content-Disposition: form-data; name="'))
            continue

            try{
                fs.unlinkSync(__dirname +"\\incomingFiles\\"+ fileNames[i], function(err)
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
        
        if( i == 2 && header.split('\r\n')[2].split(':')[1] != ' text/plain')
            reject({'text': 'Second file is not text/plain'})
            

        // fs.closeSync(fs.openSync(__dirname +"\\incomingFiles\\"+fileNames[i], "w"))
        // const stream = fs.createWriteStream(__dirname +"\\incomingFiles\\"+fileNames[i], {flag: "a", encoding: 'latin1'})
        // stream.write(content.replaceAll("\r\n", ''),()=> console.log("I ENDED TO WRITE IN FILE"))
        // stream.close();
        fs.writeFileSync(__dirname +"\\incomingFiles\\"+fileNames[i], content.replaceAll("\r\n", ''), {flag: "a", encoding: 'latin1'});
    }  
    resolve(true)
    })
    
}

module.exports.ExtractObjectsFromForm = ExtractObjectsFromForm;

