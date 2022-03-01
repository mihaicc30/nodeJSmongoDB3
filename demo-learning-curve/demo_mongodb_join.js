var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://127.0.0.1:27017/mongoDBmihai";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mongoDBmihai");
  dbo.collection('orders').aggregate([
    { $lookup:
       {
         from: 'products',
         localField: 'product_id',
         foreignField: '_id',
         as: 'orderdetails'
       }
     }
    ]).toArray(function(err, res) {
    if (err) throw err;
    console.log(JSON.stringify(res));
    db.close();
  });
});