const { Task } = require("klasa");
const { StatsD } = require("node-dogstatsd");
const dogstats = new StatsD("localhost", 8125);

module.exports = class extends Task {

    async run() {
        const allGuilds = await this.client.shard.fetchClientValues("guilds.size");
        const allVc = await this.client.shard.fetchClientValues("lavalink.size");
        dogstats.gauge("pengubots.cmdscounter", this.client.configs.counter.total);
        dogstats.gauge("pengubots.voicestreams", allVc.reduce((prev, val) => prev + val, 0));
        return dogstats.gauge("pengubot.guilds", allGuilds.reduce((prev, val) => prev + val, 0));
    }

    // Init
    async init() {
        if (this.client.user.id !== "303181184718995457") return this.disable();
        if (!this.client.configs.schedules.some(schedule => schedule.taskName === this.name)) {
            await this.client.schedule.create("cleaner", "*/1 * * * *");
        }
    }

};
