const { MessageEmbed } = require('discord.js');
const { EMOJI_ARROW } = require('../config.json');

module.exports = {
  name: "ping",
  aliases: ["pong","latency"],
  cooldown: 10,
  description: "`Show the bot's average ping.`\n\n**Usage:** \n`+ping`",
  execute(message) {
    let ping = new MessageEmbed()
    .setDescription(`${EMOJI_ARROW} Average ping to API: ${Math.round(message.client.ws.ping)} ms`)
    .setColor("#00FF00");
    message.reply(ping);
  }
};


console.log("Ping working")
