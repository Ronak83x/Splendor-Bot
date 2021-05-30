const { canModifyQueue } = require("../util/SplendorbotUtil");
const { EMOJI_DONE , EMOJI_ERROR } = require('../config.json');
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "stop",
  aliases: ["end","band","khatam","hogaya"],
  description: "`Stops the music.`\n\n**Usage:** \n`+stop`",
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    const stopembed = new MessageEmbed()
    .setDescription(`⏹ Player has been stopped!\nStopped By: <@${message.author.id}>`)
    .setColor("#0032FF");

    const errorr = new MessageEmbed()
    .setDescription(`${EMOJI_ERROR} There is nothing playing.`)
    .setColor("#0032FF");

    if (!queue) return message.reply(errorr);
    if (!canModifyQueue(message.member)) return;

    queue.songs = [];
    queue.connection.dispatcher.end();
    queue.textChannel.send(stopembed);

    return message.react (EMOJI_DONE);
  }
};


console.log("Stop working")
