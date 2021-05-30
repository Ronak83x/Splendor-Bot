const { MessageCollector, MessageEmbed } = require('discord.js');
const {EMOJI_ARROW} = require('../config.json');

module.exports = {
  name: "uptime",
  aliases: ["u", "up"],
  description: "`Gives you the uptime of the Bot.`\n\n**Usage:** \n`+uptime`",
  execute(message) {
    let seconds = Math.floor(message.client.uptime / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    let days = Math.floor(hours / 24);

    seconds %= 60;
    minutes %= 60;
    hours %= 24;

    let uptime = new MessageEmbed()
    .setDescription(`${EMOJI_ARROW} My Uptime is: \`${days} day(s),${hours} hours, ${minutes} minutes, ${seconds} seconds\``)
    .setColor("#00FF00")

    return message
      .reply(uptime)
      .catch(console.error);
  }
};


console.log("Uptime cmd working")
