const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://lan_phan:2000pvlan@cluster0.bhia2.gcp.mongodb.net/my_database_test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    // const collection = client.db("").collection("devices");
    // // perform actions on the collection object
    // client.close();
    if(err) throw err;
    console.log("Connection opens to Mongo Atlas on test database..")
});
