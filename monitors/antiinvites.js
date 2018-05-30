const { Monitor } = require("klasa");
const inviteRegex = /(https?:\/\/)?(www\.)?(discord\.(gg|li|me|io)|discordapp\.com\/invite)\/.+/;

module.exports = class extends Monitor {

    constructor(...args) {
        super(...args, {
            enabled: true,
            ignoreSelf: true
        });
    }

    async run(msg) {
        if (!msg.guild || !msg.guild.configs.automod.invites) return null;
        if (!this.client.config.main.patreon) {
            if (msg.guild.members.has("438049470094114816")) return;
        }
        if (await msg.hasAtLeastPermissionLevel(4)) return null;
        if (!inviteRegex.test(msg.content)) return null;
        return msg.delete().catch(err => this.client.emit("log", err, "error"));
    }

    async init() {
        if (!this.client.gateways.guilds.schema.has("automod")) {
            await this.client.gateways.guilds.schema.add("automod", { });
        }
        if (!this.client.gateways.guilds.schema.automod.has("invites")) {
            await this.client.gateways.guilds.schema.automod.add("invites", { type: "boolean", default: false });
        }
    }

};
