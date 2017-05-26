db = connect("ds011158.mlab.com:11158/db_apstraction");
db.auth("apreinders","mongolabOsiris74");

db.words.find({type:"name"}).forEach(function(value)
{
    db.words.update({_id:value._id},{$set:{type:"",subtype:"name"}});
})