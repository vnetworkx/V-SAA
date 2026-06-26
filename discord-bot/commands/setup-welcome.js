const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const { updateGuildConfig } = require('../utils/guildConfig');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup-welcome')
    .setDescription('Set the welcome channel and welcome text.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('Channel for welcome messages')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('title')
        .setDescription('Welcome embed title')
        .setRequired(false)
    )
    .addStringOption(option =>
      option.setName('message')
        .setDescription('Welcome embed message')
        .setRequired(false)
    ),
  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');
    const title = interaction.options.getString('title') || 'Welcome to {server}!';
    const message = interaction.options.getString('message') || 'Hey {user}, welcome to **{server}**! Take a look around and enjoy your stay.';

    updateGuildConfig(interaction.guild.id, {
      welcomeChannelId: channel.id,
      welcomeTitle: title,
      welcomeDescription: message
    });

    await interaction.reply({
      content: `Welcome messages set to ${channel}.`,
      ephemeral: true
    });
  }
};
