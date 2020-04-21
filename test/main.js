var fs = require('fs');
var dir = 'sample';
var dirAllRegEx = '**/*';
var dirImmRegEx = '??/*'


fs.readdir(dirRegEx, function (err, data) {
    console.log(err)
    console.log(data);
})