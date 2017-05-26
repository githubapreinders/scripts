/*
This file helps to test JS functions out of the program context.
 usage: enter the node shell with
 >node , then
 >var testing = require('./replhelper.js'), after which
 you can use the functions in oefen.js ; for a refresh type testing.refresh(). To use a textfile
 for data input set the data with testing.setData() ; the file is available then via testing.getData()
 */




var fs = require('fs');
var datastring;

exports.refresh = function ()
{
    delete require.cache[require.resolve('./rhyme_words.js')];
    return require('./rhyme_words.js');
}

exports.setData = function ()
{
    fs.readFile('./dict.txt', 'utf8', function (err, data)
    {
        if (err)
        {
            console.log(err)
        }
        else
        {
            datastring = data;
        }
    });
}

exports.getData = function ()
{
    return datastring;
}