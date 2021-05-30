const { canModifyQueue } = require("../util/SplendorbotUtil");
const {EMOJI_DONE} = require('../config.json');
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "volume",
  aliases: ["v","vol"],
  description: "`To change the server song queue volume.`\n\n**Usage:** \n`+v <volume>`",
  execute(message, args) {
    const queue = message.client.queue.get(message.guild.id);

    if (!queue) return message.reply("There is nothing playing.").catch(console.error);

    const bembed = new MessageEmbed()
    .setDescription("You need to join a voice channel first!")
    .setColor("#00FF4D");

    const cembed = new MessageEmbed()
    .setDescription(`🔊 The current volume is: **${queue.volume}%**`)
    .setColor("#00FF4D");

    const dembed = new MessageEmbed()
    .setDescription("Please use a number to set volume.")
    .setColor("#00FF4D");

    const eembed = new MessageEmbed()
    .setDescription("Please use a number between 0 - 100.")
    .setColor("#00FF4D");



    if (!canModifyQueue(message.member))
      return message.reply(bembed).catch(console.error);

    if (!args[0]) return message.reply(cembed).catch(console.error);
    if (isNaN(args[0])) return message.reply(dembed).catch(console.error);
    if (Number(args[0]) > 100 || Number(args[0]) < 0 )
      return message.reply(eembed).catch(console.error);
      let vembed = new MessageEmbed()
      .setDescription(`${EMOJI_DONE} The volume has been changed to **${args[0]}%**`)
      .setColor("#00FF4D");

    queue.volume = args[0];
    queue.connection.dispatcher.setVolumeLogarithmic(args[0] / 100);
    
    message.react(EMOJI_DONE);

    return queue.textChannel.send(vembed);

    
  }
};


console.log("Volume working")
