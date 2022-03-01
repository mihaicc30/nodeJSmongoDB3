var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mongoDBmihai";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mongoDBmihai");
  dbo.collection("customers").drop(function(err, delOK) {
    if (err) throw err;
    console.log(delOK);
    if (delOK) console.log("Collection deleted");
    db.close();
  });
});