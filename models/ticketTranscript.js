const mongoose = require("mongoose")

const ticketTranscriptSchema = new mongoose.Schema({
    Channel : String,
    Content : Array
})

const ticketTranscript = mongoose.model('transcripts', ticketTranscriptSchema)
module.exports = ticketTranscript