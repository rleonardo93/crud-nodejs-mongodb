const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'crudnodejsmondodb';

// Create a new MongoClient
const client = new MongoClient(url);

// Use connect method to connect to the Server
client.connect((err) => {
    assert.strictEqual(null, err);
    console.log("Connected successfully to server");

    const db = client.db(dbName);
    
    insertDocuments(db, () => {
        findDocuments(db, () => client.close());
        findDocumentsQueryFilter(db, () => client.close());
        updateDocument(db, () => client.close());
        removeDocument(db, ()=> client.close());
    });
})

const insertDocuments = (db, callback) => {
    // Get the documents collection
    const collection = db.collection('documents');
    // Insert some documents
    collection.insertMany([
        {a: 1}, {a: 2}, {a: 3}
    ], function(err, result) {
        assert.equal(err, null);
        assert.equal(3, result.result.n);
        assert.equal(3, result.ops.length);
        console.log("Inserted 3 documents into he collection");
        callback(result);
    });
}

const findDocuments = (db, callback) => {
    // Get the documents collection
    const collection = db.collection('documents');    
    // The find() method selects documents in a collection or viw and returns a cursor
    // to the selected documents.
    // The toArray() method returns an array that contains all the documents
    // from a cursor.
    collection.find({}).toArray((err, docs) => {
        assert.strictEqual(err, null);
        if (docs.length > 0) {
            console.log("Found the following records");
            console.log(docs);            
        }
        callback(docs);
    });
}

const findDocumentsQueryFilter = (db, callback) => {
    // Get the documents collection
    const collection = db.collection('documents');
    // Find some documents
    // Only the documents which match 'a': 3 should be returned
    collection.find({'a': 3}).toArray((err, docs) => {
        assert.strictEqual(err, null);
        console.log("Found the following records");
        console.log(docs);
        callback(docs);
    });
}

const updateDocument = (db, callback) => {
    // Get the documents collection
    const collection = db.collection('documents');
    // Update document where a is 2, set b equal to 1
    collection.updateOne({ a: 2 },
        { $set: { b: 1 }}, (err, result) => {
            assert.strictEqual(err, null);
            assert.strictEqual(1, result.result.n);
            console.log("Updated the document with the field a equal to 2");
            callback(result);
        });
}

const removeDocument = (db, callback) => {
    // Get the documents collection
    const collection = db.collection('documents');
    // Detele document where a is 3
    collection.deleteOne({ a: 3}, (err, result) => {
        assert.strictEqual(err, null);
        assert.strictEqual(1, result.result.n);
        console.log("Removed the document with the field a equal to 3");
        callback(result);
    });
}