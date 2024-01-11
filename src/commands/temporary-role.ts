import { PermissionsBitField, SlashCommandBuilder } from "discord.js";

export const temporaryRole = new SlashCommandBuilder()
.setName('temporary-role')
.setDescription('Set a temporary role to an user')
.addUserOption(option => 
  option
    .setName('user')
    .setDescription('Select an user to assign a temporary role')
    .setRequired(true)
)
.addRoleOption(option => 
  option
    .setName('role')
    .setDescription('Choose a role to assign to an user')
    .setRequired(true)
)
.addStringOption(option =>
  option
    .setName('role-duration')
    .setDescription('Time that this role will be assign to the user (30 min, 1h, 1 day, and so on)')
    .setRequired(true)
)
.setDefaultMemberPermissions(PermissionsBitField.Flags.ManageRoles)
.toJSON()