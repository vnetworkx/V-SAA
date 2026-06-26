const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const { updateGuildConfig } = require('../utils/guildConfig');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup-log')
    .setDescription('Set the log channel.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('Channel for logs')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    ),
  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');

    updateGuildConfig(interaction.guild.id, {
      logChannelId: channel.id
    });

    await interaction.reply({
      content: `Log channel set to ${channel}.`,
      ephemeral: true
    });
  }
};
