const { canModifyQueue } = require("../util/SplendorbotUtil");
const {EMOJI_DONE , EMOJI_ERROR} = require('../config.json');
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "loop",
  aliases: ["l","repeat"],
  description: "`Toggle loop current song or queue!`\n\n**Usage:** \n`+loop`",
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    
    const ntplay = new MessageEmbed()
    .setTitle("Error!")
    .setDescription(`${EMOJI_ERROR} There is nothing playing.`)
    .setColor("#00FF3E");

    if (!queue) return message.reply(ntplay);
    if (!canModifyQueue(message.member)) return;

    // toggle from false to true and reverse
    queue.loop = !queue.loop;

    message.react(EMOJI_DONE);
    let loopembed = new MessageEmbed()
    .setDescription(`Now Looping the queue is ${queue.loop ? "**on**" : "**off**"}`)
    .setColor("#00FF3E")
    return queue.textChannel.send(loopembed) 
  }
};


console.log("Loop working")
