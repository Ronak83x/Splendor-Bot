
    const { MessageEmbed } = require("discord.js");
    const { EMOJI_DONE , EMOJI_SERVERS, EMOJI_USERS, EMOJI_UPTIME, EMOJI_RAM, EMOJI_CROWN, BOT_OWNER_ID ,SERVER_INVITE, EMOJI_ERROR  } = require('../config.json');


    
module.exports = {
  name: "stats",
  description: "`Show detailed stats of bot.`\n\n**Usage:** \n`+stats`",
  aliases: ["about", "botinfo"],
  execute(message, args) {

/*    if(message.author.id != 726087323711701012){
      const noperms = new MessageEmbed()
      .setDescription(`${EMOJI_ERROR} You Can't Use that Command. Only Bot Owner Can Use it.`)
      .setColor("#FF2828");
      return message.channel.send(noperms)
    }*/

let servers_count = message.client.guilds.cache.size;
var myarray = [];
message.client.guilds.cache.keyArray().forEach(async function(item, index) {

  let guildMember = message.client.guilds.cache.get(item).memberCount;
  myarray.push(guildMember)
})
let sum = myarray.reduce(function (a, b) {
return a + b
});

    let totalSeconds = message.client.uptime / 1000;
    let days = Math.floor(totalSeconds / 86400);
    totalSeconds %= 86400;
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = Math.floor(totalSeconds % 60);
    
    let uptime = `\`\`\`${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds\`\`\``;
    
    let embed = new MessageEmbed()
    
    .setTitle(`**[Support Server]**`)
      .setDescription(`Hey My name is **${message.client.user.username}** *and My Work is to play Music*`)

      .setTitle(`${message.client.user.username} Stats`)
      .addFields(
        { name: `${EMOJI_SERVERS} Servers:`, value: `\`\`\`${servers_count}\`\`\``, inline: true },
        { name: `${EMOJI_USERS} Users:`, value: `\`\`\`${sum}\`\`\``, inline: true },
        { name: `${EMOJI_UPTIME} Uptime:`, value: uptime },
        { name: `${EMOJI_RAM} RAM USAGE:`, value: `\`\`\`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB\`\`\`` },


        { name: `${EMOJI_CROWN} BOT OWNER`,value: `<@${BOT_OWNER_ID}> [𝐒𝐆 • ROИΔK#0083]`}

      )

      .setAuthor(message.client.user.username, message.client.user.displayAvatarURL() )

      .setURL(
        `${SERVER_INVITE}`
      )

      .setColor("#A600FF");   

      message.react(EMOJI_DONE);
    return message.channel.send(embed);
    }
};

console.log("stats working")
