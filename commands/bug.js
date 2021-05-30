const {MessageEmbed} = require('discord.js')
const { EMOJI_DONE , BOT_ID , EMOJI_DRUNK, EMOJI_ERROR } = require('../config.json');
module.exports = {
    name: "bug",
    aliases: ["report"],
    cooldown: 3,
    description: "`Send your bug for Splendor +`\n\n**Usage:** \n`+bug <Your Bug!>`",
    async execute(message, args) {

        const fbChannel = "822335435094491156";

        const fb = args.join(" ");
        if(!fb){
            const useembed = new MessageEmbed()
            .setDescription(`Usage: **${message.client.prefix}bug <Your Bug!>**`)
            .setColor("#00FF70");    
            return message.channel.send(useembed);
        }

        const embed = new MessageEmbed()
            .setTitle(`${EMOJI_DRUNK} A bug has been reported.`)
            .addField(`Author`, `\`${message.author.tag}\``)
            .addField(`Bug`, fb) //            .addField(`Feedback`, "\`"+fb+"\`")            .addField(`Member Id`, `\`${message.author.id}\``)
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
        .setDescription(`${EMOJI_DONE} Your **Bug** is submitted successfully!`)
        message.react(EMOJI_DONE);

        message.channel.send(successembed)
    }

}


console.log("Bug cmd working")
