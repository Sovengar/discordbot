const { Collection } = require("discord.js")

const afk = new Collection(); //key: userId | value: [timeStamp, reason]
const antijoin = new Collection(); //key: guild_id | value: userObj{}

module.exports = { afk, antijoin }