const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
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
        .setName(lang.ban.slash.name)
        .setDescription(lang.ban.slash.description)
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        
        .addUserOption(option => option.setName(lang.universal.slash.user.name)
            .setDescription(lang.universal.slash.user.description)
            .setRequired(true)
        )

        .addStringOption(option => option.setName(lang.universal.slash.string.name)
            .setDescription(lang.universal.slash.string.description)
            .setRequired(true)
        ),

    // -------------------
    //   COMMAND EXECUTE
    // -------------------

    async execute(interaction)
    {
        const guild = interaction.guild;
        const ownerId = guild.ownerId;

        const author = interaction.user.username;
        const mention = interaction.user.toString();

        const user = interaction.options.getUser(lang.universal.slash.user.name);
        const reason = interaction.options.getString(lang.universal.slash.string.name);
        
        const member = interaction.guild.members.cache.get(user.id);
        const hasadmin = member.roles.cache.some(role => role.permissions.has(PermissionFlagsBits.Administrator));
        
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
        //     LIMIT CHECK
        // -------------------

        if(reason.length < 10 || reason.length > 100) 
        {    
            const reasonErrorEmbed = new EmbedBuilder()
                .setTitle(lang.ban.embed.reason.title)
                .setDescription(lang.ban.embed.reason.description)
                .setColor("Yellow")
                .setTimestamp();
                
                return interaction.reply({
                    content: mention,
                    embeds: [reasonErrorEmbed],
                    ephemeral: true
                }
            );
        }

        // -------------------
        //     ADMIN CHECK
        // -------------------

        if(hasadmin || user.id === ownerId) 
        {
            const errorAdminEmbed = new EmbedBuilder()
                .setTitle(lang.ban.embed.admin.title)
                .setDescription(lang.ban.embed.admin.description)
                .setColor("Yellow")
                .setTimestamp();
                
                return interaction.reply({
                    content: mention,
                    embeds: [errorAdminEmbed],
                    ephemeral: true
                }
            );
        }

        // -------------------
        //      BOT CHECK
        // -------------------

        if(user.bot) 
        {
            const errorBotEmbed = new EmbedBuilder()
                .setTitle(lang.universal.embeds.bot.title)
                .setDescription(lang.universal.embeds.bot.description)
                .setColor("Red")
                .setTimestamp();
                
                return interaction.reply({
                    content: mention,
                    embeds: [errorBotEmbed],
                    ephemeral: true
                }
            );
        }

        // -------------------
        //      BAN USER
        // -------------------

        try 
        {
            await interaction.guild.members.ban(user, { reason });
            
            const successEmbed = new EmbedBuilder()
                .setTitle(lang.ban.embed.banned.title)
                .setColor("Green")
                .setTimestamp()

                .setDescription(lang.ban.embed.banned.description
                    .replace('{author_name}', author)
                    .replace('{victim}', user).replace('{reason}', reason)
                );
                
            return interaction.reply({
                content: mention,
                embeds: [successEmbed],
                ephemeral: false
            });            
        }

        catch(error)
        {
            // -------------------
            //    ERRORS EMBED
            // -------------------
                        
            const noPermsEmbed = new EmbedBuilder()
                .setTitle(lang.universal.embeds.botperms.title)
                .setDescription(lang.universal.embeds.botperms.description)
                .setColor("Red")
                .setTimestamp();
                
            return interaction.reply({
                content: mention,
                embeds: [noPermsEmbed],
                ephemeral: true
            });
        }
    },
};