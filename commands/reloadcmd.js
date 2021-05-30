const { MessageEmbed } = require('discord.js');
const { EMOJI_DONE , EMOJI_ERROR } = require('../config.json');

module.exports = {
  name: "reloadcmd",
  aliases: ["rlcmd"],
  cooldown: 10,
  description: "`Reload a command.`\n\n**Usage:** \n`+reloadcmd <command name>`",
  async execute(message, args) {
      
    const reloadcmd = args.join(" ");
    if(!reloadcmd){
        const useembed = new MessageEmbed()
        .setDescription(`Usage: **${message.client.prefix}reloadcmd <command name>**`)
        .setColor("#00FFBD");    
        return message.channel.send(useembed);
    }

    const cmd = args[0].toLowerCase();
    const pls = new MessageEmbed()
    .setDescription(`${EMOJI_ERROR} Only bot owner can use this command!`)
    .setColor("#FF3232");
    
     const plss = new MessageEmbed()
    .setDescription(`${EMOJI_ERROR} Please give me a valid command name.`)
    .setColor("#FF3232");
      
     const plsss = new MessageEmbed()
    .setDescription(`${EMOJI_DONE}  **${cmd}** Command successfully reloaded!`)
    .setColor("#00FF00");      



    if(message.author.id != "827031742232789053") {
        return message.channel.send(pls);
    }

    if(!args[0]) {
          return message.channel.send(plss);
      }
    try{
        delete require.cache[require.resolve(`../commands/${cmd}.js`)];
        message.client.commands.delete(cmd);
        const pull = require(`../commands/${cmd}.js`);
        message.client.commands.set(cmd, pull);

        return message.channel.send(plsss)
    } catch (error) {
        return message.channel.send(`Error reloading **${cmd}**: \`${error.message}\``)
        return message.react(EMOJI_DONE);
    }

 }
};


console.log("Reload working")