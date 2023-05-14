const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

const { getTranslation } = require('../../languages/controller');
const lang = getTranslation(); 

const commands = require('../../resources/commands.json');

module.exports = 
{
    // -------------------
    //    SLASH BUILDER
    // -------------------

    data: new SlashCommandBuilder()
        .setName(lang.coinflip.slash.name)
        .setDescription(lang.coinflip.slash.description),

    // -------------------
    //   COMMAND BUILDER
    // -------------------

    async execute(interaction) 
    {
        const string1 = lang.coinflip.strings.heads;
        const string2 = lang.coinflip.strings.tails;
        const mention = interaction.user.toString();

        // -------------------
        //    COMMAND CHECK
        // -------------------

        if(!commands.ip) 
        {
            const unavailableCommand = new EmbedBuilder()
                .setTitle(lang.universal.embeds.unavailable.title)
                .setColor("Red")
                .setDescription(lang.universal.embeds.unavailable.description)
                .setTimestamp();
            
            return interaction.reply({
                content: mention,
                embeds: [unavailableCommand],
                ephemeral: true
            });
        }        
        
        // -------------------
        //     COIN CHANCE
        // -------------------

        let random;
        const randomNumber = Math.random();

        if(randomNumber < 0.5) {
            random = string1;
        } else {
            random = string2;
        }
        
        // -------------------
        //    EMBED BUILDER
        // -------------------
        
        const coinflipEmbed = new EmbedBuilder()
            .setTitle(lang.coinflip.embed.title)
            .setDescription(lang.coinflip.embed.description.replace('{result}', random))
            .setColor("White")
            .setTimestamp();

        // -------------------
        //     SEND EMBED
        // -------------------
        
        try 
        {
            return interaction.reply({
                content: mention,
                embeds: [coinflipEmbed],
                ephemeral: false
            });
        }

        catch(error)
        {
            // -------------------
            //     ERRORS LOGS
            // -------------------
        
            console.log("[Minescord] => [C] Critical => An unknown error occurred in the coinflip command!");
            console.log("[Minescord] => [L] Log => Send the log to: https://github.com/Henry8K/Minescord/issues");
        
            // -------------------
            //    ERRORS EMBED
            // -------------------            
        
            const errorEmbed = new EmbedBuilder()
                .setTitle(lang.universal.embeds.broken.title)
                .setDescription(lang.universal.embeds.broken.description)
                .setColor("DarkRed")
                .setTimestamp();
                
            return interaction.reply({
                content: mention,
                embeds: [errorEmbed],
                ephemeral: true
            });
        }
    }
};