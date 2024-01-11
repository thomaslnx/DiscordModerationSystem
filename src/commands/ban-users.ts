import { PermissionsBitField, SlashCommandBuilder } from "discord.js";

export const banUsers = new SlashCommandBuilder()
.setName('ban-user')
.setDescription(
  'Ban users that break the rules'
)
.addUserOption((option) => 
  option
    .setName('user')
    .setDescription('Choose the user that you wanna ban')
    .setRequired(true)
)
.addStringOption((option) => 
  option
    .setName('reason')
    .setMaxLength(300)
    .setDescription('The reason for the ban')
    .setRequired(true)
)
.setDefaultMemberPermissions(PermissionsBitField.Flags.BanMembers)
.toJSON()