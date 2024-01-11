import 'dotenv/config'
import { client } from './client'
import { api } from '../api'
import { Routes } from 'discord.js'
import { commandsList } from '../commands/commands-list'
import { staffUserInputCommand } from '../utils/staffUserInputCommand'

client.once('ready', () => {
  console.log(`Client is 🚀 and logged as ${client.user?.tag}`)
  // const server = client.guilds.cache.get(process.env.DISCORD_BOT_ID!)
  // console.log('server value: ', server?.members.guild.members.cache.map(member => console.log('roles of members of the channel: ', member.roles.guild.roles)))
})

client.on('interactionCreate', (interaction) => {
  if (interaction.isChatInputCommand()) {
    client.emit('staffUserInputCommand', client, interaction)
  } else if (!interaction.isChatInputCommand()) {
    return
  }
})

client.on('staffUserInputCommand', staffUserInputCommand)

try {
  api.put(
    Routes.applicationGuildCommands(process.env.CLIENT_ID!, process.env.DISCORD_BOT_ID!), {
      body: commandsList
    }
  )
  client.login(process.env.TOKEN)
} catch (err) {
  console.log('An error happens: ', err)
}