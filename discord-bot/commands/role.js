const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('role')
    .setDescription('Add or remove a role from a member.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addSubcommand(subcommand =>
      subcommand
        .setName('add')
        .setDescription('Add a role to a member')
        .addUserOption(option =>
          option.setName('user')
            .setDescription('Member')
            .setRequired(true)
        )
        .addRoleOption(option =>
          option.setName('role')
            .setDescription('Role to add')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('remove')
        .setDescription('Remove a role from a member')
        .addUserOption(option =>
          option.setName('user')
            .setDescription('Member')
            .setRequired(true)
        )
        .addRoleOption(option =>
          option.setName('role')
            .setDescription('Role to remove')
            .setRequired(true)
        )
    ),
  async execute(interaction) {
    const action = interaction.options.getSubcommand();
    const user = interaction.options.getUser('user');
    const role = interaction.options.getRole('role');
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);

    if (!member) {
      return interaction.reply({ content: 'That user is not in this server.', ephemeral: true });
    }

    if (action === 'add') {
      await member.roles.add(role);
      return interaction.reply({ content: `Added ${role} to ${user.tag}.`, ephemeral: true });
    }

    if (action === 'remove') {
      await member.roles.remove(role);
      return interaction.reply({ content: `Removed ${role} from ${user.tag}.`, ephemeral: true });
    }
  }
};
