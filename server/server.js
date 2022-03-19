const client = require('../client/discordBot')
const express = require('express')

client.on('ready', () => {
    const clientDetails = {
        guilds: client.guilds.cache.size,
        users: client.users.cache.size,
        channels: client.channels.cache.size
    }

    const app = express()
    const port = 3000 || 3001

    app.get("/", (req, res) => {
        res.status(200).send('Main page')
    })

    app.get("/info", (req, res) => {
        res.status(200).send(clientDetails)
    })

    app.listen(port)

})