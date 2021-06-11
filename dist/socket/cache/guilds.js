"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.guilds = void 0;
const collection_1 = __importDefault(require("@discordjs/collection"));
function guilds(events, worker) {
    worker.guilds = new collection_1.default();
    events.on('GUILD_CREATE', (g) => {
        var _a, _b;
        let guild = Object.assign({}, g);
        (_a = guild.members) === null || _a === void 0 ? void 0 : _a.forEach(member => {
            // @ts-expect-error For proper cache formatting
            member.guild_id = guild.id;
            events.emit('GUILD_MEMBER_ADD', member);
        });
        delete guild.members;
        (_b = guild.channels) === null || _b === void 0 ? void 0 : _b.forEach(channel => {
            channel.guild_id = guild.id;
            events.emit('CHANNEL_CREATE', channel);
        });
        delete guild.channels;
        guild.roles.forEach(role => {
            events.emit('GUILD_ROLE_CREATE', { guild_id: guild.id, role });
        });
        guild.roles = [];
        delete guild.presences;
        if (worker.options.cacheControl.guilds) {
            const newGuild = {};
            worker.options.cacheControl.guilds.forEach(key => {
                newGuild[key] = guild[key];
            });
            newGuild.id = guild.id;
            guild = newGuild;
        }
        worker.guilds.set(guild.id, guild);
    });
    events.on('GUILD_UPDATE', (g) => {
        const guild = Object.assign({}, g);
        let currentGuild = worker.guilds.get(guild.id);
        if (!currentGuild)
            return;
        currentGuild.name = guild.name;
        currentGuild.region = guild.region;
        currentGuild.verification_level = guild.verification_level;
        currentGuild.default_message_notifications = guild.default_message_notifications;
        currentGuild.explicit_content_filter = guild.explicit_content_filter;
        currentGuild.afk_channel_id = guild.afk_channel_id;
        currentGuild.afk_timeout = guild.afk_timeout;
        currentGuild.icon = guild.icon;
        currentGuild.owner_id = guild.owner_id;
        currentGuild.splash = guild.splash;
        currentGuild.banner = guild.banner;
        currentGuild.system_channel_id = guild.system_channel_id;
        currentGuild.rules_channel_id = guild.rules_channel_id;
        currentGuild.public_updates_channel_id = guild.public_updates_channel_id;
        currentGuild.preferred_locale = guild.preferred_locale;
        if (worker.options.cacheControl.guilds) {
            const newGuild = {};
            worker.options.cacheControl.guilds.forEach(key => {
                currentGuild[key] = guild[key];
            });
            newGuild.id = guild.id;
            currentGuild = newGuild;
        }
        worker.guilds.set(guild.id, currentGuild);
    });
    events.on('GUILD_DELETE', (guild) => {
        if (guild.unavailable)
            return;
        worker.guilds.delete(guild.id);
    });
}
exports.guilds = guilds;