var mongoose = require('mongoose');
var request = require('request');
var Anagram = require('./anagrammodel.js');
var Word = require('./wordmodel.js');


//*************** CONNECTING MONGOLAB DATABASE
var options = {
    server: {socketOptions: {keepAlive: 300000, connectTimeoutMS: 30000}},
    replset: {socketOptions: {keepAlive: 300000, connectTimeoutMS: 30000}}
};
var mongodbUri = 'mongodb://superUser:ss9t87hfd@ds113220-a0.mlab.com:13220,ds113220-a1.mlab.com:13220/db_apstraction2?replicaSet=rs-ds113220'
mongoose.connect(mongodbUri, options);
var conn = mongoose.connection;
conn.on('error', console.error.bind(console, 'mongodb connection error:'));
conn.once('open', function ()
{
    console.log('connection with mongodb established!');

});


//Takes existing items in the Anagram collection as an input
exports.findItems = function(regex)
{
	Word.find({mainword:{$regex:new RegExp(regex)}}, function(err, docs)
	{
		console.log("found %s documents...", docs.length);
		if(docs.length >0)
		{
			var items = []
			docs.forEach(function(item)
			{
				items.push(item.mainword);
			});
			getDesc(items);
		}
		else{console.log('nothing found...')}
	});
}




function getDesc(inputArray)
{
	if(inputArray.length < 1)
	{
		console.log("finished")
		return;
	}
	console.log("still %d to go",inputArray.length);
	var string = inputArray.shift();
	findDescription(string).then(function(success)
		{
			success.replace(/&#39;/g,'');
			console.log('********',string,success);
			Word.update({mainword:string},{$set:{description:success}},{multi:true},function(err, res)
			{
				if(err)
				{
					console.log('error updating Word',string,err);
				}
				else
					{
						Anagram.update({motherword:string},{$set:{description:success}},{multi:true},function(err,res)
						{
							if(err){console.log('error updating Anagram',string,err);}
							getDesc(inputArray);
						});
					}
			});
		},function(failure)
		{
			console.log('********',failure);
		});
}

function findDescription(string)
{
	return new Promise(function(resolve,reject)
	{
		var GLOSBE_URL = "https://glosbe.com/gapi/translate?from=nld&callback=JSON_CALLBACK&dest=nld&format=json&phrase=" + string;
		request({url:GLOSBE_URL,json:true},function(error,response,body)
		{
			console.log('...');
			body = body.replace('JSON_CALLBACK(','');
			body = body.replace(');','');
			body = JSON.parse(body);
			if (!error) 
			{
		    	if(body.hasOwnProperty('tuc'))
		    	{
		    		if(body.tuc.length > 0)
		    		{
		    			if(body.tuc[0].hasOwnProperty('meanings'))
		    			{
		    				if(body.tuc[0].meanings.length > 0)
		    				{
		    					if(body.tuc[0].meanings[0].hasOwnProperty('text'))
		    					{
		    						resolve(body.tuc[0].meanings[0].text);
		    					}
		    				}
		    			}
		    		}
		    	}
		    	resolve("nothing found");
			}
			else
			{
				reject(response.statusCode);
			}
		});
	});
}
