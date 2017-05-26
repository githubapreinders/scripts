
db = connect("ds011158.mlab.com:11158/db_apstraction");
db.auth("apreinders","mongolabOsiris74");
cursor = db.missedwords.find({},{_id:0,__v:0});

while(cursor.hasNext())
{
  printjson(cursor.next());
}
