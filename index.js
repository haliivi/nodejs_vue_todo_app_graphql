
require('dotenv').config()
const path = require('path')
const sequelize = require('./utils/database')
const express = require('express')
const app = express()
const {graphqlHTTP} = require('express-graphql')
const schema = require('./graphql/schema')
const resolver = require('./graphql/resolver')
const PORT = process.env.PORT || 3000

app.use('/', express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(graphqlHTTP({
    schema,
    rootValue: resolver,
    graphiql: true
}))
app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

async function start () {
    try {
        await sequelize.sync(
            // {force: true}
        )
        app.listen(PORT)
    } catch (e) {
        console.log(e)
    }
}

start()
