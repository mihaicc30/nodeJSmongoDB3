var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mongoDBmihai";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mongoDBmihai");
//   var query = { address: "Park Lane 38" };  // find all that live at this address
//   dbo.collection("customers").find(query).toArray(function(err, result) {
//     if (err) throw err;
//     console.log(result);
//     db.close();
//   });

  var query2 = { address: /^S/ }; // Find documents where the address starts with the letter "S"
  dbo.collection("customers").find(query2).toArray(function(err, result2) {
    if (err) throw err;
    console.log(result2);
    db.close();
  });

});
