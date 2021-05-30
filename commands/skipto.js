const { canModifyQueue } = require("../util/SplendorbotUtil");
const { EMOJI_DONE , EMOJI_ERROR } = require('../config.json');
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "skipto",
  aliases: ["st"],
  description: "`Skip to the selected queue number.`\n\n**Usage:** \n`+skipto <Queue Number>`",
  execute(message, args) {
    const zembed = new MessageEmbed()
    .setDescription(`Usage: ${message.client.prefix}${module.exports.name} <Queue Number>`)
    .setColor("#00FFAE");
    if (!args.length || isNaN(args[0]))
      return message
        .reply(zembed)
        .catch(console.error);

    const queue = message.client.queue.get(message.guild.id);
    const a = new MessageEmbed()
    .setDescription(`${EMOJI_ERROR} There is no queue.`)
    .setColor("#00FFAE");

    const b = new MessageEmbed()
    .setDescription(`${EMOJI_ERROR} This number is not any queue number!`)
    .setColor("#00FFAE");

    const c = new MessageEmbed()
    .setDescription(`${message.author} ⏭ skipped ${args[0] - 1} songs.`)
    .setColor("#00FFAE");

    if (!queue) return message.channel.send(a).catch(console.error);
    if (!canModifyQueue(message.member)) return;
    if (args[0] > queue.songs.length)
      return message.reply(b).catch(console.error);

    queue.playing = true;

    if (queue.loop) {
      for (let i = 0; i < args[0] - 2; i++) {
        queue.songs.push(queue.songs.shift());
      }
    } else {
      queue.songs = queue.songs.slice(args[0] - 2);
    }

    queue.connection.dispatcher.end();
    queue.textChannel.send(c).catch(console.error) ,  message.react(EMOJI_DONE);
  }
};


console.log("Skipto working")
