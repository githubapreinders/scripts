var fs = require('fs');
var text = fs.readFileSync('output.txt','utf8');
text.split(/\r?\n/).forEach(function(line)
{
   var match = line.match(/\w+(?=", "frequency)/);
   if(match !== null)
   {
       fs.appendFile('output2.txt',match[0] +"\n",'utf8');
   }
});
