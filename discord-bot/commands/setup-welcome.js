const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setup-welcome")
    .setDescription("Open the dashboard to configure welcome messages"),
  async execute(interaction) {
    const url = `${process.env.DASHBOARD_URL}/dashboard/${interaction.guildId}`;
    await interaction.reply({
      content: `Open the dashboard here: ${url}`,
      ephemeral: true,
    });
  },
};