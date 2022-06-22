module.exports.uploadErrors = (err) => {
    let errors = { format: "", maxSize: ""};
    if (err.message.includes('Invalid file')) 
    errors.format = 'Format incompatible';
    if (err.message.includes('max size exceeded'))
    errors.maxSize = 'Taille maximale de 500ko dépassée';
    return errors;
}