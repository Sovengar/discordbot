const mongoose = require("mongoose")

const ReactionRolesSchema = new mongoose.Schema({
    Guild: String,
    Message: String,
    Roles: Object,
})

const reactionRolesModel = mongoose.model('reaction-roles', ReactionRolesSchema)

module.exports = reactionRolesModel