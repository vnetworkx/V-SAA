const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Shows all bot commands.'),
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('Bot Commands')
      .setColor(0x5865F2)
      .setDescription(
        [
          '`/ping` - check bot latency',
          '`/setup-welcome` - set welcome channel, title, and message',
          '`/setup-log` - set log channel',
          '`/setup-auto-role` - set role given to new members',
          '`/announce` - send a server announcement',
          '`/ban` - ban a member',
          '`/kick` - kick a member',
          '`/timeout` - timeout a member',
          '`/purge` - delete messages in bulk',
          '`/role` - add or remove a role from a member'
        ].join('\n')
      );

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
