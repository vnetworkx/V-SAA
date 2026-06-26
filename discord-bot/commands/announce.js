const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('announce')
    .setDescription('Send an announcement to a channel.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('Channel to send the announcement to')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('title')
        .setDescription('Announcement title')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('message')
        .setDescription('Announcement message')
        .setRequired(true)
    ),
  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');
    const title = interaction.options.getString('title');
    const message = interaction.options.getString('message');

    const embed = new EmbedBuilder()
      .setTitle(title)
      .setDescription(message)
      .setColor(0xFEE75C)
      .setTimestamp();

    await channel.send({ embeds: [embed] });

    await interaction.reply({
      content: `Announcement sent to ${channel}.`,
      ephemeral: true
    });
  }
};
