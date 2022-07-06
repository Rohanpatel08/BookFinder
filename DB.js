const mongoose = require('mongoose')
const MongoURI = "mongodb+srv://user_01:user_01@nodeapi.uxcu4mh.mongodb.net/BookFinder"

const connectToMongo = () =>{
    mongoose.connect(MongoURI, ()=>{
        console.log("Connected To MongoDB Successfully");
    })
}

module.exports = connectToMongo


// const MongoClient = require('mongodb').MongoClient;
// const url = "mongodb://localhost:27017/mydb";

// const connectToMongo = () => {
//     MongoClient.connect(url, function (err, db) {
//         if (err) throw err;
//         console.log("Database created!");
//         db.close();
//     })
// }
// module.exports = connectToMongo