const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { updateGuildConfig } = require('../utils/guildConfig');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup-auto-role')
    .setDescription('Set the role given to new members.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addRoleOption(option =>
      option.setName('role')
        .setDescription('Role to give new members')
        .setRequired(true)
    ),
  async execute(interaction) {
    const role = interaction.options.getRole('role');

    updateGuildConfig(interaction.guild.id, {
      autoRoleId: role.id
    });

    await interaction.reply({
      content: `Auto-role set to ${role}.`,
      ephemeral: true
    });
  }
};
