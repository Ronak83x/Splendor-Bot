const { canModifyQueue } = require("../util/SplendorbotUtil");
const {EMOJI_DONE , EMOJI_ERROR} = require('../config.json');
const { MessageEmbed } = require("discord.js");
module.exports = {
  name: "pause",
  aliases: ["rukja","ruk"],
  description: "`Pause the currently playing music.`\n\n**Usage:** \n`+pause`",
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    
    let prembed = new MessageEmbed()
    .setDescription(`${EMOJI_ERROR} There is nothing playing.`)
    .setColor("#FF3232");

    if (!queue) return message.reply(prembed);
    if (!canModifyQueue(message.member)) return;

    let pembed = new MessageEmbed()
    .setDescription(`⏸ Paused the music!\nPaused By: <@${message.author.id}>`)
    .setColor("#FF3232");

    if (queue.playing) {
      queue.playing = false;
      queue.connection.dispatcher.pause(true);
      return queue.textChannel.send(pembed) , message.react(EMOJI_DONE);

       
    }
  }
};



console.log("Pause working")
