const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const cors = require('cors')
require('dotenv').config()

// Allows API to work with local environments
app.use(cors())
// Gives access to static files in public directory
app.use(express.static('public'))
// Required to read form input data
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

let db, 
    dbConnectionStr = process.env.DB_CONNECTION_STRING,
    dbName = 'star-trek-field-guide',
    alienCollection = 'aliens-info'

MongoClient.connect(dbConnectionStr, {useUnifiedTopology: true})
    .then(client => {
        console.log(`Connected to ${dbName} database`)
        db = client.db(dbName)
    })

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

app.get('/api/:aliensName', (req, res) => {
    const aliensName = req.params.aliensName.toLowerCase()

    db.collection(alienCollection).findOne({name: aliensName})
        .then(result => res.json(result))
        .catch(err => console.error(err))
})

const PORT = process.env.PORT || 8123
app.listen(PORT, () => {
    console.log(`App is now running on port ${PORT}`)
})