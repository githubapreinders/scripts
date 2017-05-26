var mongoose = require('mongoose');
var fs = require('fs');
var Anagram = require('./anagrammodel.js');


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

exports.findSingleRhyme = function(string)
{
	findRhyme(string,[]);
}




//Takes existing items in the Anagram collection as an input; usage: oefen.findItems('^z.*$')
exports.findItems = function(regex)
{
	Anagram.find({actualword:{$regex:new RegExp(regex)}}, function(err, docs)
	{
		if(docs.length >0)
		{
			console.log("found %s documents...", docs.length);
			search(docs);
		}
	});
}

function search(words)
{
		console.log('still %s to do',words.length)
		if(words.length > 0)
		findRhyme(words.shift(),words)
		else
		{
			conn.close();
			return;
		}
}



//Searches the db for rhyme words; this will happen several times until an arbitrary max value 
//for the output array is reached. Several searches will be done in which the most obvious rhyme words 
//will be put away first.The final results of the search end up in a promise, which will store
//in the db.
function findRhyme(object, words)
{
	
		//console.log(vowelise(string));
		//console.log(JSON.stringify(object));
		var string = object.actualword;
		findPattern(vowelise(string),new Array()).then(
			function(response)
			{
				// response.sort(function(a,b)
				// {
				// 	if(a.actualword > b.actualword){return 1;}
				// 	if(a.actualword < b.actualword){return -1;}
				// 	return 0;
				// });
				response = response.filter(function(item)
				{
					return item.actualword !== string;
				})
				var helper = []
				response.forEach(function(item)
				{
					helper.push(item.actualword);
				});
				console.log("----- %s -------",string, helper.join());
				Anagram.update({_id:object._id},{$push:{rhymewords:{$each: helper}}}, {upsert:true}, function(err,docs)
				{
					if(err)
					{
						console.log("error posting...",err);
					}
					else
					{
						//console.log("succes posting...",docs);
						search(words);
					}
				});
				console.log("@@@@@@");

			}, function(error)
			{
				console.log('error back');
				console.log(error);
			});
	
	

	function findPattern(patterns, output)
	{
	
		return new Promise(function(resolve, reject)
		{
		thisFunction(patterns,output);
//TODO remove doubles from the output array after each iteration.DONE
//TODO randomize when a large array of documents is returned from the server.DONE
			function thisFunction(patterns, output)
			{
				if(output.length > 24)
				{
					resolve(output);	
					return;	
				}
				if(patterns.length>0)
				{
					// console.log("");	
					// console.log(" pattern: ", patterns[0]);
					Anagram.find({actualword:new RegExp(patterns.shift())}, function(err, docus)
					{
						if(err)
						{
							console.log("error", err);	
							reject(Error(err));
							return;
						}
						//console.log("found %s documents", docus.length);

						if(docus.length > 0)	
						do{	
								var item = docus[Math.floor(Math.random()*docus.length)];
								docus.splice(docus.indexOf(item),1);
								
								var dup = false;
								for(var i=0 ; i< output.length; i++)
								{
									if(output[i].actualword == item.actualword)
									{
										dup = true;
									}
									if(output[i].motherword == item.motherword)
									{
										dup = true;
									}
									
								}
								if(!dup)
								output.push(item);
						}
						while(output.length < 25 && docus.length > 0);
						thisFunction(patterns, output);
						});
				}
				else
				{
					resolve(output);
				}
			}
		});

	}
}


//Creates an array with regular expressions that will be used to query the anagrams db
function vowelise(word)
{
	var parking = word;
	console.log('&&&& %s &&&&',word);
	if(word !== undefined && word !== null)
	{
		var output = [];
		var loops = 0;
		var finished = false;
		do
		{
			var aword = word.replace(/[^i]j|[^aeijouy\s\*]+/, function(match)
			{
				return '*';
			});
			if(aword == word)
			{
				finished = true;
				break;
			}
			loops++;
			output.push(aword +'$');
			word = aword;
		}
		while(!finished);

	    	//words starting with vowels can be expanded in the search
	    	if(parking.match(/^[aeiouy]/) !== null)
	    	{
	    		// console.log("starting with vowel");
	    		output.forEach(function(value,index,array)
	    		{
	    			array[index] = value.replace(/\*/g,'([^i]j|[^aeijouy\\s]+)');
	    		});


	    		output.forEach(function(value,index,array)
	    		{
	    			array[index] = '^.*' + value;
	    		});
	    	}
	    	//words starting with consonant can be expanded more tolerantly
	    	else
	    	{
	    		// console.log('word starting with consonant');
	    		output.forEach(function(value,index,array)
	    		{
	    			array[index] = value.replace(/^\*/,function(match)
	    			{
	    				return "#";
	    			});
	    		});
	    		output.forEach(function(value,index,array)
	    		{
	    			array[index] = value.replace(/\*/g,'([^i]j|[^aeijouy\\s]+)');
	    		});
	    		output.forEach(function(value,index,array)
	    		{
	    			array[index] = value.replace('#','^.*');
	    		});
	    	}

	    //if the word ends with a consonant
	    if(parking.match(/[^aeiouy\u00E9]$/) !== null)
		{
			var d = parking.match(/$/)
			var word1,word2;

			if(parking.match(/[^aeiouy]en$/) !== null)
			{
				if(parking.match(/([i]j|[aeiouy]+)([^aeiouy]+)en$/)!==null)
				word1 = parking.match(/([i]j|[aeiouy]+)([^aeiouy]+)en$/)[0];//.*en
				if(parking.match(/([^aeiouy]+)([i]j|[aeiouy]+)([^aeiouy]+)en$/)!==null)
				word2 = parking.match(/([^aeiouy]+)([i]j|[aeiouy]+)([^aeiouy]+)en$/)[0];//.*gen
			}
			else
			{	if(parking.match(/([i]j|[aeiouy]+)([^aeiouy]+)$/) !== null)
				{
					word1 = parking.match(/([i]j|[aeiouy]+)([^aeiouy]+)$/)[0];//.*ap
				}
				if(parking.match(/([^aeiouy]+)([i]j|[aeiouy]+)([^aeiouy]+)$/) !== null)
				{
					word2 = parking.match(/([^aeiouy]+)([i]j|[aeiouy]+)([^aeiouy]+)$/)[0];//.*flap
				}
			}
			if(word1 === undefined )
			{
				word1 = parking;
			}
			if(word2 === undefined)
			{
				word2 = parking;
			}
			if(word1 !== undefined)
			output.splice(1,0, '^.*([^aeiouy])' + word1 + '$');
			if(word2 !== undefined)
			output.splice(0,0, '^.*' + word2 + '$');
			// console.log('ends with consonant',word1, word2);
		}
		//if the word ends with a vowel
		else
		{
			var word;
			if(parking.match(/\u00E9$/)!== null)
			{
				console.log("replacing...");
				parking.replace(/\u00E9$/,'ee');
			}
			if(parking.match(/([i]j|[aeiouy]+)([^aeiouy]+)([i]j|[aeiouy\u00E9]+)$/) !== null && word !== undefined)
			{
				word = parking.match(/([i]j|[aeiouy]+)([^aeiouy]+)([i]j|[aeiouy\u00E9]+)$/)[0];
				output.splice(1,0, '.*' + word + '$');
			}	
			

			// console.log('ends with vowel',word);
		}
	    	console.log(output);
	    	return output;	
	    }
	    else
	    {
	    	return "";
	    }
	}


