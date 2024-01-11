import { REST } from 'discord.js'

export const api = new REST({ version: '10' }).setToken(process.env.TOKEN!)