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

	welcomeChannelId: { type: String, },
	welcomeImage: { type: String, },
	welcomeMessage: { type: String, },
	leaveChannelId: { type: String, },
	logChannelId: { type: String, },
	memberRoleId: { type: String, },
	suggestionChannelId: { type: String, },
	
	antiLinkChannels: { type: Array, default: [] },
	mutedUsers: { type: Array, default: [] },
	bannedWords: { type: Array, default: [] },
	disabledMessageCommands: { type: Array, default: [] },
	disabledLevelingChannels: { type: Array, default: [] },
});

const guildSettingsModel = mongoose.model("GuildSettings", GuildSettingsSchema);

module.exports = guildSettingsModel