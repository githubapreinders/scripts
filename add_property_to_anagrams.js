var mongoclient = require('./node_modules/mongoose/node_modules/mongodb');



exports.addProperty = function()
{	mongoclient.connect('mongodb://superUser:ss9t87hfd@ds113220-a0.mlab.com:13220,ds113220-a1.mlab.com:13220/db_apstraction2?replicaSet=rs-ds113220',
	function(err,db)
	{
		if(err)
		{
			return console.dir(err);
		}
		startTime = new Date().getTime();
    	console.log("starttime: " + startTime);
		var anagrams = db.collection('anagrams');
		anagrams.find({}).forEach(function(value)
		{
		    anagrams.update({_id:value._id},{$set:{description:""}});
		});	
		console.log("total time :  " + (new Date().getTime() - startTime) + " milliseconds");
	})
}
