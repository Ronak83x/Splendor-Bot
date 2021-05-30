const move = require("array-move");
const { MessageEmbed } = require("discord.js");
const { canModifyQueue } = require("../util/SplendorbotUtil");
const { EMOJI_ERROR } = require('../config.json');

module.exports = {
  name: "move",
  aliases: ["mv"],
  description: "`Move songs around in the queue.`\n\n**Usage:** \n`+move <Queue Number>`",
  execute(message, args) {

    const queue = message.client.queue.get(message.guild.id);

    let moveembed = new MessageEmbed()
    .setDescription(`${EMOJI_ERROR} There is no queue.`)
    .setColor("#00DCFF");

    let moveerrorembed = new MessageEmbed()
    .setDescription(`Usage: ${message.client.prefix}move <Queue Number>`)
    .setColor("#00DCFF");

    let moveuseembed = new MessageEmbed()
    .setDescription(`${message.author} 🚚 moved the song to ${args[1] == 1 ? 1 : args[1] - 1} in the queue.`)
    .setColor("#00DCFF");

    if (!queue) return message.channel.send(moveembed);
    if (!canModifyQueue(message.member)) return;

    if (!args.length) return message.reply(moveerrorembed);
    if (isNaN(args[0]) || args[0] <= 1) return message.reply(moveerrorembed);

    let song = queue.songs[args[0] - 1];

    queue.songs = move(queue.songs, args[0] - 1, args[1] == 1 ? 1 : args[1] - 1);
    queue.textChannel.send(moveuseembed);
  }
};


console.log("Move working")
