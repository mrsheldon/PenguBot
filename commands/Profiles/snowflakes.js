const { Command } = require("klasa");

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            runIn: ["text"],
            cooldown: 10,
            permissionLevel: 0,
            aliases: ["snowflake", "sendsnowflakes"],
            requiredPermissions: ["USE_EXTERNAL_EMOJIS"],
            description: language => language.get("COMMAND_SNOWFLAKES_DESCRIPTION"),
            usage: "[user:user] [amount:integer]",
            usageDelim: " ",
            extendedHelp: "No extended help available."
        });
    }

    async run(msg, [user, amount]) {
        if (!user) {
            await msg.author.configs.waitSync();
            return msg.reply(`❄ | **Your account balance is:** ${msg.author.configs.snowflakes.toLocaleString()} Snowflakes.`);
        } else if (!amount) {
            return msg.reply("You've not specified the amount of **Snowflake(s)** to send.");
        } else {
            await msg.author.configs.waitSync();
            const currSnowflakes = msg.author.configs.snowflakes;
            if (amount >= currSnowflakes) return msg.reply("Your account balance is low, please enter an amount which you have.");
            if (user.bot) return msg.reply("You can not send Snowflakes to bot accounts.");
            if (msg.author.id === user.id) return msg.reply("You can not send Snowflakes to yourself.");
            const userSnowflakes = user.configs.snowflakes;
            const confirm = await msg.awaitReply(`${msg.author}, Please confirm the transfer of ❄ **${amount.toLocaleString()} Snowflake(s)** to ${user} by typing \`YES\` or \`NO\`.`);
            if (confirm.toLowerCase() === "yes" || confirm.toLowerCase() === "y") {
                await user.configs.waitSync();
                msg.author.configs.update("snowflakes", currSnowflakes - amount);
                user.configs.update("snowflakes", userSnowflakes + amount);
                return msg.reply(`❄ | **You've sent \`${amount}\` Snowflake(s) to ${user}!**`);
            } else {
                return msg.reply(`❄ | **You've cancelled the transaction or the input was invalid.**`);
            }
        }
    }

};
