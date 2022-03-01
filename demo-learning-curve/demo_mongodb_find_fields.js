var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://mihaiapp:MyDBpassMihai123@mihai.ch81p.mongodb.net/mydb?retryWrites=true&w=majority";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mydb");
  dbo.collection("users").findOne({}, function(err, result) {
    if (err) throw err;
    console.log(result);
    db.close();
    
  };
});