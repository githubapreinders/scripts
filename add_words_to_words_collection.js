var mongoose = require('mongoose');
var fs = require('fs');
var Word = require('./wordmodel.js');

//*************** CONNECTING MONGOLAB DATABASE
var options = {
    server: {socketOptions: {keepAlive: 300000, connectTimeoutMS: 30000}},
    replset: {socketOptions: {keepAlive: 300000, connectTimeoutMS: 30000}}
};
var mongodbUri = 'mongodb://apreinders:mongolabOsiris74@ds011158.mlab.com:11158/db_apstraction';
mongoose.connect(mongodbUri, options);
var conn = mongoose.connection;
conn.on('error', console.error.bind(console, 'mongodb connection error:'));
conn.once('open', function ()
{
    console.log('connection with mongodb established!');
});


var text = fs.readFileSync('output2.txt','utf8');

var words = [];
text.split(/\r?\n/).forEach(function(line)
{
    words.push(line.trim());
});

var aword = new Word(words[i]);


console.log(aword);
// aword.update(req.body, {upsert: true}, function (err, document)
// {
//     if (document)
//     {
//         console.log("document  upserted in /postNewWord..." + JSON.stringify(document));
//         //addAnagram(req);
//         var synonymarray = req.body.synonyms;
//         console.log('synonymarray: ' + synonymarray + " " + typeof synonymarray + " array:" + Array.isArray(synonymarray));
//         if (synonymarray !== null && synonymarray.length > 0)
//         {
//             updateSynonyms(synonymarray, req.body.mainword, 0);
//         }
//         res.send({dbresponse: document, contents: req.body});
//         return;
//     }
//     else
//     {
//         res.send(err);
//         return;
//     }
// });






// db.words.find({type:"name"}).forEach(function(value)
// {
//     db.words.update({_id:value._id},{$set:{type:"",subtype:"name"}});
// })