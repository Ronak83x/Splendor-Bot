const { canModifyQueue } = require("../util/SplendorbotUtil");
const { EMOJI_DONE , EMOJI_ERROR } = require('../config.json');
const { MessageEmbed } = require("discord.js");
module.exports = {
  name: "skip",
  aliases: ["s","next","agla"],
  description: "`Skip the currently playing song.`\n\n**Usage:** \n`+skip`",
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    const errorskip = new MessageEmbed()
    .setDescription(`${EMOJI_ERROR} There is nothing playing that I could skip for you.`)
    .setColor("#00E0FF");
    
    if (!queue)
    
      return message.reply(errorskip);
    if (!canModifyQueue(message.member)) return;

    const skipembed = new MessageEmbed()
    .setDescription(`⏭ Skipped the song!\nSkipped By: <@${message.author.id}>`)
    .setColor("#00E0FF");

    queue.playing = true;
    queue.connection.dispatcher.end();
    queue.textChannel.send(skipembed);

     return message.react(EMOJI_DONE);
  }
};


console.log("Skip working")
