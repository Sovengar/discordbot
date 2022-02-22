const mongoose = require('mongoose');

const MoneySchema = new mongoose.Schema({
    guild_id: { type: String, required: true },
    memberId: { type: String, required: true },
    memberCoins: { type: Number, default: 0 }, 
});

const moneyModel = mongoose.model("Money", MoneySchema);
module.exports = moneyModel