const client = global.client;
const { MessageEmbed } = require("discord.js");
const config = require("../../config.json");
const db = require("quick.db");
const ms = require('ms');

module.exports = async (message) => {
    if (!message.guild || message.author.bot) return
    const ownerr = client.users.cache.get("796263552771817472");
    if (config.bot.prefix && !message.content.startsWith(config.bot.prefix)) return;
    const args = message.content.slice(1).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    const cmd = client.commands.get(command) || [...client.commands.values()].find((e) => e.aliases && e.aliases.includes(command));
    const author = message.author
    const channel = message.channel
    const guild = message.guild
    const embed = new MessageEmbed().setColor(message.member.displayHexColor).setAuthor({name: message.member.displayName, iconURL: author.avatarURL({ dynamic: true, size: 2048 })}).setFooter({text: (config.bot.BotFooter) , iconURL: ownerr.avatarURL({ dynamic: true, size: 2048 })})

    if (cmd) {
        if (cmd.owner && config.bot.owner !== author.id) return;
        if (cmd.guildowner && config.bot.owner !== author.id && guild.owner.id !== author.id) return;
        if (client.cooldown.has(author.id) === config.bot.cooldown) {
            client.commandblocked.push(author.id)
            message.reply({ embeds: [embed.setDescription(`${author} komutları kötüye kullandığın için engellendin.`)] });
        }
        if (client.commandblocked.includes(message.author)) return;
        cmd.execute(client, message, args, embed, author, channel, guild);
        if (config.bot.owner !== author && guild.owner !== author) {
            if (!client.cooldown.has(author)) client.cooldown.set(author, 1);
            else client.cooldown.set(author.id, client.cooldown.get(author.id) + 1);
        }
        setTimeout(() => {
            if (client.cooldown.has(author.id)) {
                client.cooldown.delete(author.id)
            }
        }, 1000 * 60 * 5);
    }
}

module.exports.conf = {
    name: "messageCreate"
}
