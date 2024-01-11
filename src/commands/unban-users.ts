import { SlashCommandBuilder } from "discord.js";

export const unbanUsers = new SlashCommandBuilder()
.setName('unban-user')
.setDescription('Unban back to the channel a banned user')
.addUserOption(option => 
  option
    .setName('user')
    .setDescription('Choose one user to unban')
    .setRequired(true)
)
.addStringOption(option => 
  option
    .setName('reason')
    .setDescription('Reason for unban user')
    .setRequired(true)
)
.toJSON()