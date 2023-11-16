const fs = require('fs')

function ExtractObjectsFromForm(formData, formBoundary){
    
    const objs = formData.toString().split(formBoundary)
    
    for(let i = 0; i < objs.length; i++)
    {
        // if(objs[i] != "--")
        // {
            fs.writeFileSync("foo" + i + ".jpg" , Buffer.from(objs[i]));
        // }
    }
    // fs.writeFileSync("foo.jpg", formData);
    
    // var stats = fs.statSync("foo.jpg")
    // objs = stats

    return objs
}

module.exports.ExtractObjectsFromForm = ExtractObjectsFromForm;

function CheckJPEG()
{

}