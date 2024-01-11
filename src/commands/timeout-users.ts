import { PermissionsBitField, SlashCommandBuilder } from "discord.js";

export const timeoutUsers = new SlashCommandBuilder()
.setName('user-timeout')
.setDescription('Set a user timeout of the guild')
.addUserOption(option => 
  option
    .setName('user')
    .setDescription('Choose an user to timeout')
    .setRequired(true)
)
.addStringOption(option =>
option
  .setName('duration')
  .setDescription('Timeout duration (30 min, 1h, 1 day, and so on)')
  .setRequired(true)
)
.addStringOption(option => 
option
  .setName('reason')
  .setDescription('The reason for the timeout')
  .setRequired(true)
)
.setDefaultMemberPermissions(PermissionsBitField.Flags.MuteMembers)
.toJSON()