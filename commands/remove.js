const { canModifyQueue } = require("../util/SplendorbotUtil");
const { EMOJI_DONE , EMOJI_ERROR } = require('../config.json');
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "remove",
  aliases: ["rm","delete"],
  description: "`Remove song from the queue.`\n\n**Usage:** \n`+rm <Queue Number>`",
  execute(message, args) {
    const queue = message.client.queue.get(message.guild.id);
    const aembed = new MessageEmbed()
    .setDescription(`${EMOJI_ERROR} There is no queue.`)
    .setColor("#08FFE5");
    const bembed = new MessageEmbed()
    .setDescription(`Usage: ${message.client.prefix}remove <Queue Number>`)
    .setColor("#08FFE5");
    const cembed = new MessageEmbed()
    .setDescription(`${message.author} ${EMOJI_DONE} Removed the song from the queue.`)
    .setColor("#08FFE5");

    

    if (!queue) return message.channel.send(aembed);
    if (!canModifyQueue(message.member)) return;

    if (!args.length) return message.reply(bembed);
    if (isNaN(args[0])) return message.reply(bembed);

    const song = queue.songs.splice(args[0] - 1, 1);
    queue.textChannel.send(cembed) , message.react(EMOJI_DONE);
  }
};



console.log("Remove working")
