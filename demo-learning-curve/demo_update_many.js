var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://127.0.0.1:27017/mongoDBmihai";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mongoDBmihai");
  var myquery = { address: /^S/ };
  var newvalues = {$set: {name: "Minnie"} };
  dbo.collection("customers").updateMany(myquery, newvalues, function(err, res) {
    if (err) throw err;
    console.log(res + " document(s) updated"); // result.n
    // console.log(res.result.nModified);
    db.close();
  });
});