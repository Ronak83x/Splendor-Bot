const { MessageEmbed } = require("discord.js");
const fs = require("fs");
const {EMOJI_DONE} = require('../config.json');

let config;

try {
  config = require("../config.json");
} catch (error) {
  config = null;
}

module.exports = {
  name: "pruning",
  aliases: ["start-pruning"],
  description: "`Toggle pruning of bot messages.`\n\n**Permission:**\n`You Require MANAGE MESSAGES Perm To Execute This Command!`",
  execute(message) {
    if (!config) return;
    config.PRUNING = !config.PRUNING;

    if(!message.member.hasPermission("MANAGE_MESSAGES")){
      const noperms = new MessageEmbed()
      .setDescription('<a:spl_music_error:808395975726727189> You Do Not Have Perms To Execute This Command! You Require __`MANAGE MESSAGES`__ Perm To Execute This Command!')
      .setColor("#00FFFF");
      return message.channel.send(noperms)
    }

    const pembed = new MessageEmbed()
    .setDescription("There was an error writing to the file.")
    .setColor("#00FF9E");
    
    const perrorembed = new MessageEmbed()
    .setDescription(`Message pruning is ${config.PRUNING ? "**enabled**" : "**disabled**"}`)
    .setColor("#00FF9E");

    fs.writeFile("./config.json", JSON.stringify(config, null, 2), (err) => {
      if (err) {
        console.log(err);
        return message.channel.send(pembed);
      }

      return message.channel
        .send(perrorembed) 

        
        .catch(console.error), message.react(EMOJI_DONE);

        
    });
  }
};


console.log("Pruning working")
