var fs = require('fs');
var text = fs.readFileSync('output2.txt','utf8');

var words = [];
text.split(/\r?\n/).forEach(function(line)
{
    words.push(line.trim());
});

words.sort();

fs.writeFile("output2.txt","");

words.forEach(function(value)
{
   fs.appendFile("output2.txt", value + "\n")
});

