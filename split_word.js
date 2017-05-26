var mongoose = require('mongoose');
var fs = require('fs');
var Anagram = require('./anagrammodel.js');


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


var results = [];
var thewords;

exports.doSentence = function(sentence)
{
	thewords =sentence.split(/\s+/);
	loopWord(thewords.shift());
}


function loopWord(word)
{
	if(word.length>6)
	{
		var thisword = {actualword:word, findings:[]};
		var iterator = thisword.actualword.length-2;
		console.log(thisword.actualword);
		iterate(iterator, thisword);
	}
	else
	{
		var w = thewords.shift();
		results.push({actualword:w,findings:[]});
		loopWord(w);
	}
}





function iterate(iterator, thisword)
{
	if(iterator < 3)
	{
		
		console.log("single word done...");
		results.push(thisword);
		if(thewords.length == 0)
		{
			console.log('ready looping sentence \n');
			printResults(results);
			results = [];
			thewords = "";
			return;
		}
		else
		{
			loopWord(thewords.shift());
		}
	return;	
	}
	var str = thisword.actualword.substring(0,iterator);
	Anagram.find({actualword: str}, function (err, docs)
	{
		if(docs.length > 0)
		{
			docs.forEach(function(doc)
			{
				if(doc.type != 'verb' )
				{
					thisword.component1 = doc;
				}
			})
			if(thisword.hasOwnProperty('component1'))
			{
				var str2 = thisword.actualword.substring(iterator, thisword.actualword.length);
				Anagram.find({actualword:str2}, function(err, docs)
				{
					if(docs.length > 0)
					{
						docs.forEach(function(doc)
						{
							if(doc.type != 'verb' )
							{
								thisword.findings.push({component1:thisword.component1, component2:doc});
							}
						})
						
					}
						delete thisword.component1;
					iterator --;
					iterate(iterator, thisword);
				})
			}
			else
			{
				iterator --;
				iterate(iterator, thisword);
			}
		}
		else
		{
			iterator --;
			iterate(iterator, thisword);
		}
	})
}

function printResults(theresults)
{
	//whole sentence is iterated
	theresults.forEach(function (thisword, index)
	{
		if(thisword.findings.length>0)
		{
			var c1 = [];
			var c2 = []
			thisword.findings.forEach(function(finding, index)
			{
					finding['component1'].synonyms.forEach(function (v)
					{
						c1.push(v);
					})
					finding['component2'].synonyms.forEach(function (v)
					{
						c2.push(v);
					})
				console.log("results for single word...\n",thisword.actualword, c1, c2);
			})
		}
		else
		{
			console.log(thisword.actualword, " no split")
		}
	})

}


