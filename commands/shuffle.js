const { MessageEmbed } = require("discord.js");
const { canModifyQueue } = require("../util/SplendorbotUtil");
const { EMOJI_ERROR } = require('../config.json');

module.exports = {
  name: "shuffle",
  aliases: ["mix"],
  description: "`Shuffles the queue!`\n\n**Usage:** \n`+shuffle`",
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    const dembed = new MessageEmbed()
    .setDescription(`${EMOJI_ERROR} There is no queue.`)
    .setColor("#00F0FF");

    const eembed = new MessageEmbed()
    .setDescription(`${message.author} 🔀 shuffled the queue.`)
    .setColor("#00F0FF");
    if (!queue) return message.channel.send(dembed);
    if (!canModifyQueue(message.member)) return;

    let songs = queue.songs;
    for (let i = songs.length - 1; i > 1; i--) {
      let j = 1 + Math.floor(Math.random() * i);
      [songs[i], songs[j]] = [songs[j], songs[i]];
    }
    queue.songs = songs;
    message.client.queue.set(message.guild.id, queue);
    queue.textChannel.send(eembed);
  }
};


console.log("Shuffle working")
