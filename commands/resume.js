const { canModifyQueue } = require("../util/SplendorbotUtil");
const {EMOJI_DONE , EMOJI_ERROR} = require('../config.json');
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "resume",
  aliases: ["r"],
  description: "`Resumes the paused music.`\n\n**Usage:** \n`+resume`",
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    const rembed = new MessageEmbed()
    .setDescription(`▶ Resumed the music!\nResumed By: <@${message.author.id}>`)
    .setFooter('Queue stuck? Try +skip')
    .setColor("#00FF50")

    const rrembed = new MessageEmbed()
    .setDescription(`${EMOJI_ERROR} There is nothing playing.`)
    .setColor("#00FF50")

    const aembed = new MessageEmbed()
    .setDescription(`${EMOJI_ERROR} The queue is not paused.`)
    .setColor("#00FF50")
    if (!queue) return message.reply(rrembed);
    if (!canModifyQueue(message.member)) return;

    if (!queue.playing) {
      queue.playing = true;
      queue.connection.dispatcher.resume();
      return queue.textChannel.send(rembed), 
      message.react(EMOJI_DONE);
    }

    return message.reply(aembed);
  }
};


console.log("Resume working")
