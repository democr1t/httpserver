const fs = require('fs')
const path = require('path')
const imageSize = require('image-size')
const replaceExt = require('replace-ext');

function ExtractObjectsFromForm(formData, formBoundary){
    let resultJPG;
    let resultTXT;
    let result = {
        CheckPictureResult : resultJPG,
        CheckTXTResult : resultTXT
    }
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
        const fileNames = {
            1 : "foo1.jpg",
            2: "foo2.txt"
        }
        let [header, content] = objs[i].split("\r\n\r\n")
        fs.closeSync(fs.openSync(__dirname +"\\incomingFiles\\"+fileNames[i], "w"))
        const stream = fs.createWriteStream(__dirname +"\\incomingFiles\\"+fileNames[i], {flag: "a", encoding: 'latin1'})
        stream.write(content.replaceAll("\r\n", ''),)
        stream.close();
    }

    return result
}

module.exports.ExtractObjectsFromForm = ExtractObjectsFromForm;

