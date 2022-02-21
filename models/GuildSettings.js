const mongoose = require('mongoose');

const GuildSettingsSchema = new mongoose.Schema({
	guild_id: { type: String, required: true },
	prefix: { type: String, required: true },

	allowWelcome: { type: Boolean, default: false },
	allowLeave: { type: Boolean, default: false },
	allowAutoRole: { type: Boolean, default: false },
	allowLogChannel: { type: Boolean, default: false },
	allowLeveling: { type: Boolean, default: false },
	allowSuggestion: { type: Boolean, default: false },
	allowAntilink: { type: Boolean, default: false },
	allowAnticurse: { type: Boolean, default: false },
	allowAntiAdvertising: { type: Boolean, default: false },
	allowAntiBL_messageCommands: { type: Boolean, default: false },
	allowAntiBL_members: { type: Boolean, default: false },

	welcomeChannelId: { type: String, },
	welcomeImage: { type: String, },
	welcomeMessage: { type: String, },
	leaveChannelId: { type: String, },
	logChannelId: { type: String, },
	memberRoleId: { type: String, },
	suggestionChannelId: { type: String, },
	
	mutedUsers: { type: Array, default: [] },
	blacklist_members: { type: Array, default: [] },
	blacklist_words: { type: Array, default: [] },
	blacklist_messageCommands: { type: Array, default: [] },
	blacklist_levelingChannels: { type: Array, default: [] },
	blacklist_linkChannels: { type: Array, default: [] },
});

const guildSettingsModel = mongoose.model("GuildSettings", GuildSettingsSchema);

module.exports = guildSettingsModel