//import modules
const exp = require('express')
const { ObjectID } = require('mongodb')
var path = require("path");
var fs = require("fs");

//create an express js instance
const app = exp()

//config express js
app.use(exp.json())
const port = process.env.PORT || 8080
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Headers", "*");
    res.setHeader('Access-Control-Allow-Origin', '*');

    next()
})

//Connect to mongodb
const MongoClient = require('mongodb').MongoClient
let db
MongoClient.connect('mongodb+srv://Usman:Magaji222@cluster0.f71jw.mongodb.net/test', (err, client) => {
    db = client.db('webstore')
})
 
//middleware to handle images 
/** 
app.use(function(req, res, next) {
    // Uses path.join to find the path where the file should bevar 
    filePath = path.join
    (__dirname, "images", req.url);
    fs.stat(filePath, function(err, fileInfo) {
        if (err) {            
            next();
            return;        
        }
        if (fileInfo.isFile()) 
        res.sendFile(filePath);
        else next();  
      });
});

app.use(function(req,res){
    res.status(404);
    res.send("File not found");
});

*/

//display a message or root path to show that API is working
app.get('/', (req, res, next) => {
    res.send('Select a collection, e.g., collection/messages')
})

//get collection
app.param('collectionName', (req, res, next, collectionName) => {
    req.collection = db.collection(collectionName)
    return next()
})

//retrieve all the objects from collection
app.get('/collection/:collectionName', (req, res, next) => {
    req.collection.find({}).toArray((e, results) => {
        if (e) return next(e)
        res.send(results)
    })
})


//posting new data to the collection
app.post('/collection/:collectionName', (req, res, next) => {
    req.collection.insert(req.body, (e, results) => { 
        if (e) return next(e)    
        res.send(results.ops) 
    })
})

//update object
app.put('/collection/:collectionName/:id', (req, res, next) => {
    req.collection.update(
        { _id: new ObjectID(req.params.id) },
        { $set: req.body },
        { safe: true, multi: false },
        (e, result) => {
            if (e) return next(e)
            res.send((result.result.n === 1) ? { msg: 'success' } : { msg: 'error' })
        }
    )
})


//delete object
app.delete('/collection/:collectionName/:id', (req, res, next) => {
    req.collection.deleteOne(
        { _id: ObjectID(req.params.id) },
        (e, result) => {
            if (e) return next(e)
            res.send((result.result.n === 1) ? { msg: 'success' } : { msg: 'error' })
        }
    )
})

//start server
app.listen(port, () => {
    console.log('Express js server runnning on localhost:8080')
})