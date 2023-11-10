function ExtractObjectsFromForm(formData, formBoundary){
    // const objs = formData.split(formBoundary).join("-----------------------------------------------------------------")
    fs.writeFileSync("foo.jpg", formData);
    

    return objs
}

module.exports.ExtractObjectsFromForm = ExtractObjectsFromForm;