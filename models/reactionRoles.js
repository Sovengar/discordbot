const mongoose = require("mongoose")

const ReactionRolesSchema = new mongoose.Schema({
    guild_id: String,
    Message: String,
    Roles: Object,
})

const reactionRolesModel = mongoose.model('reaction-roles', ReactionRolesSchema)

module.exports = reactionRolesModel