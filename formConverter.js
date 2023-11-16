const fs = require('fs')

function ExtractObjectsFromForm(formData, formBoundary){
    let objs = formData.toString().split('--'+formBoundary)

    for(let i = 1; i < objs.length - 1; i++)
    {
        try{
            fs.unlinkSync(__dirname +"\\incomingFiles\\"+"foo" + i + ".txt", function(err)
            {
                if(err) return console.log(err);
                console.log('file deleted successfully');
            }); 
        }
        catch(error)
        {
            console.log("Error while deleting incoming file" + error)
        }
        
         fs.writeFileSync(__dirname +"\\incomingFiles\\"+"foo" + i + ".txt" , Buffer.from(objs[i]));
    }

    return objs
}

module.exports.ExtractObjectsFromForm = ExtractObjectsFromForm;

function CheckJPEG()
{

}