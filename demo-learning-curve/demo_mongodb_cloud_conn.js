var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://alemihai25:Motadev123$@mihai.ch81p.mongodb.net/mihai?retryWrites=true&w=majority";

// find 
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mydb");
  dbo.collection("users").find({}).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
    db.close();
  });
});

// insert
// MongoClient.connect(url, function(err, db) {
//     if (err) throw err;
//     var dbo = db.db("mydb");
//     var myobj = { name: "Some_Guy2", address: "6969 Highway", age: "55" };
//     dbo.collection("users").insertOne(myobj ,function(err, result) {
//       if (err) throw err;
//       console.log(result);
//       db.close();
//     });
//   });