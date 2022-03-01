var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mongoDBmihai";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mongoDBmihai");
//   var myquery = { address: 'Mountain 21' };
//   dbo.collection("customers").deleteOne(myquery, function(err, obj) {
//     if (err) throw err;
//     console.log("1 document deleted");
//     db.close();
//   });

  var myquery = { address: /^O/ };   // or Delete all documents were the address starts with the letter "O"
  dbo.collection("customers").deleteMany(myquery, function(err, obj) {
    if (err) throw err;
    console.log("Document(s) deleted!");  // obj.result.n
    console.log(obj);
    db.close();
  });
});