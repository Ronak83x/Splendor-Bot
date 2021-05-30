const { MessageEmbed } = require("discord.js");

const { EMOJI_ARROW } = require('../config.json');
const { SERVER_INVITE } = require('../config.json');
const { BOT_ID } = require('../config.json');

module.exports = {
  name: "invite",
  aliases: ["inv"],
  description: "`To get invite link of Bot.`\n\n**Usage:** \n`+invite`",
  execute(message, args) {
    //set the permissions id here (https://discordapi.com/permissions.html)
    var permissions = 70282305;

    let invite = new MessageEmbed()
    .setColor('#19FF51')
    .setTitle('Invite links of Splendor Music')
    .addFields(
      { name: 'Splendor', value: '[Invite](https://discord.com/api/oauth2/authorize?client_id=765843852661227520&permissions=8&scope=bot)', inline: true },
      { name: 'Splendor+', value: '[Invite](https://discord.com/oauth2/authorize?client_id=789386169463996426&permissions=8&scope=bot)', inline: true },
    )
    .addField("Support Server", "[Join](https://discord.gg/XKmhHKCnQP)")
    .setTimestamp();
     
    return message.channel.send(invite);
  }
};
