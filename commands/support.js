const { MessageEmbed } = require("discord.js");
const { SERVER_INVITE , BOT_ID } = require('../config.json');
const { EMOJI_ARROW ,EMOJI_DISCORD } = require("../config.json")


module.exports = {
  name: "support",
  aliases: ["server","ss"],
  description: "`To get support server of bot.`\n\n**Usage:** \n`+support`",
  execute(message, args) {
   
    let support = new MessageEmbed()
      .setTitle(`**SUPPORT SERVER**`)
      .setDescription(`${EMOJI_DISCORD} **__Join Our Support Server For Help__**\n${EMOJI_ARROW} [CLICK HERE](${SERVER_INVITE})`)
      .setFooter("Thanks For Choosing Splendor +").setTimestamp()

      .setURL(
        `${SERVER_INVITE}`
      )
      .setColor("#00FF4D")
      .setThumbnail("https://media.discordapp.net/attachments/810780302540013578/823558351371239434/spl_glitch.gif?width=443&height=427");
    return message.channel.send(support);
  }
};


console.log("Support working")
