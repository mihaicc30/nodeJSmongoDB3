var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mongoDBmihai";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mongoDBmihai");
  var myobj = [
    { name: 'John', address: 'Highway 71', age: '12'},
    { name: 'Peter', address: 'Lowstreet 4', age: '98'},
    { name: 'Amy', address: 'Apple st 652', age: '23'},
    { name: 'Hannah', address: 'Mountain 21', age: '87'},
    { name: 'Michael', address: 'Valley 345', age: '34'},
    { name: 'Sandy', address: 'Ocean blvd 2', age: '76'},
    { name: 'Betty', address: 'Green Grass 1', age: '46'},
    { name: 'Richard', address: 'Sky st 331', age: '54'},
    { name: 'Susan', address: 'One way 98', age: '59'},
    { name: 'Vicky', address: 'Yellow Garden 2', age: '51'},
    { name: 'Ben', address: 'Park Lane 38', age: '67'},
    { name: 'William', address: 'Central st 954', age: '51'},
    { name: 'Chuck', address: 'Main Road 989', age: '69'},
    { name: 'Viola', address: 'Sideway 1633', age: '31'}
  ];
  dbo.collection("customers").insertMany(myobj, function(err, res) {
    if (err) throw err;
    console.log("Number of documents inserted: " + res.insertedCount);
    db.close();
  });
});