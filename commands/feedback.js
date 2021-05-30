const {MessageEmbed} = require('discord.js')
const { EMOJI_DONE , EMOJI_HEART, BOT_ID , EMOJI_ERROR } = require('../config.json');
module.exports = {
    name: "feedback",
    aliases: ["fb" , "suggest"],
    cooldown: 3,
    description: "`Send your feedback for Splendor +`\n\n**Usage:** \n`+feedback <Your Feedback!>`",
    async execute(message, args) {

        const fbChannel = "822154208147931137";

        const fb = args.join(" ");
        if(!fb){
            const useembed = new MessageEmbed()
            .setDescription(`Usage: **${message.client.prefix}fb <Your Feedback or Suggestion!>**`)
            .setColor("#00FF70");    
            return message.channel.send(useembed);
        }

        const embed = new MessageEmbed()
            .setTitle(`${EMOJI_HEART} New Feedback or Suggestion!`)
            .addField(`Author`, `\`${message.author.tag}\``)
            .addField(`Feedback`, fb) //            .addField(`Feedback`, "\`"+fb+"\`")
            .addField(`Member Id`, `<@${message.author.id}>`) //            .addField(`Member Id`, `\`${message.author.id}\``)
            .addField(`On the Server`, `\`${message.guild.name}\``)
            .addField("Server ID:", `\`${message.guild.id}\``)
            .setColor("#9B00FF")
            .setTimestamp()
                    
        message.client.channels.cache.get(fbChannel).send(embed).then((msg) =>{
            msg.react(EMOJI_DONE);
            msg.react(EMOJI_ERROR);
        }).catch((err)=>{
            throw err;
        });


        const successembed = new MessageEmbed()
        .addField("Join Our Support Server", `Click Here To Join Our [Support Server](https://discord.gg/XKmhHKCnQP)`)
        .setTitle("Success!")
        .setColor("#00FF20")
        .setDescription(`${EMOJI_DONE} Your **Feedback or Suggestion** is submitted successfully!`)
        message.react(EMOJI_DONE);

        message.channel.send(successembed)
    }

}


console.log("Feedback cmd working")
