console.log('May Node be with you')

const express = require('express')

const app = express();

const bodyParser = require('body-parser')

const MongoClient = require('mongodb').MongoClient


MongoClient.connect(connectionString, (err, client) =>{
    if (err) return console.error(err)
    console.log('connected to MongoDb')
    const db = client.db('star-wars-quotes')
   const quotesCollection = db.collection('quotes') 
   app.set('view engine', 'ejs')
   app.use(bodyParser.urlencoded(({extended: true})))

app.use(express.static('public'))
app.use(bodyParser.json())

app.get('/', function (req, res) {
    // do something here
    quotesCollection.find().toArray()
        .then(results => {
            console.log(results)
            res.render('index.ejs', {quotes: results})
        })
        .catch(error => console.error(error))
   
})
app.post('/quotes', (req, res) =>{
    quotesCollection.insertOne(req.body)
    .then(result =>{
        console.log(result)
        res.redirect('/')
    })
    .catch(error => console.error(error))
})

app.put('/quotes', (req,res) =>{
    quotesCollection.findOneAndUpdate(
        {name: 'Yoda'},
        {
            $set: {
                name: req.body.name,
                quote: req.body.quote
            }
        },
        {
            upsert: true
        }
    )
    .then(result => {
        console.log(result)
        res.json('Success')
    })
    .catch(error => console.error(error))
})
app.delete('/quotes', (req,res) =>{
    quotesCollection.deleteOne(
    {name: req.body.name}
    )
    .then(result => {
        if (result.deletedCount === 0) {
            return res.json('No quote to delete')
        }
        res.json("Delete Darth Vader's Quote")
    })
    .catch(error => console.error(error))
})
app.listen(3000, function () {
    console.log('listening on 3000')
})
})

