const mongo = require('mongodb');
const dotenv = require('dotenv');
const MongoClient = mongo.MongoClient;
dotenv.config();
const url = process.env.DATABASE_URL;
let db;
module.exports = {
    connectToServer: (callback) =>{
        MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, (error, client ) => {
            db= client.db('test');

            return callback(error);
        });
    },

/**
 * @return {mongo.Db} db
 */

    getDb: () => db,
};
