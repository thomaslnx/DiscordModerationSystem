import { 
  CacheType,
  ChatInputCommandInteraction,
  Client,
  GuildTextBasedChannel,
  PermissionsBitField,
} from 'discord.js'
import ms from 'ms'
import { setTimeout } from 'timers'

export const staffUserInputCommand = async (client: Client, interaction: ChatInputCommandInteraction<CacheType>) => {
  // checking if there is a interaction
  if (!interaction) { 
    return
  }

  switch (interaction.commandName) {
    /**
     * Ban user logic 
    */
    case 'ban-user': {
      const userToBeBanned = interaction.options.getUser('user')
      const userMakingBanning = interaction.member?.user.id
      const reasonForBan = interaction.options.getString('reason')
      const channelToSendLog = interaction.guild?.channels.cache.get('1192943720971120782') as GuildTextBasedChannel

      try {
        // check if user has permissions to run this command
        if (!interaction.guild?.members.me?.permissions.has(PermissionsBitField.Flags.BanMembers)) {
          interaction.reply('You do not have permission to ban users!')
          return
        }

        // Check if the user is trying ban himself
        if (userToBeBanned!.id === userMakingBanning) {
          interaction.reply('You cannot ban yourself')
          return
        }

        await interaction.guild?.members.ban(userToBeBanned!, { reason: reasonForBan! })
          .catch(err => {
            interaction.reply('Happens an error trying to ban this user!')
            return
          })
        /** according with I have read on the documentation, theres no reason to attach a DM
        ** for a banned user, so Discord API doesn't permit such action. That's the why I
        ** comment this line bellow.
        ** source: https://discordjs.guide/slash-commands/permissions.html#dm-permission
        */
        // await interaction.user.send(`You got banned by the following reason: ${reasonForBan}`)
        channelToSendLog.send(`Username: ${userToBeBanned!.username} userId: ${userToBeBanned!.id} was banned :no_entry: by the following reason: ${reasonForBan}`)
        interaction.reply(`User ${userToBeBanned} banned successfully! :no_entry:`)
        return
      }
      catch (err) {
        // console.log(`Theres an error trying ban the user: ${userToBeBanned}`, '\n', 'error description: ', err)
        interaction.reply(`Theres an error trying ban the user: ${userToBeBanned}`)
        return
      }
    }

    /**
     * Unban user logic
    */
    case 'unban-user': {
      const userToBeUnbanned = interaction.options.getUser('user')
      const memberRunningCommand = interaction.guild?.members.cache.get(interaction.user.id)
      const isThereAnyBan = await interaction.guild?.bans.fetch()
      const bannedUserId = isThereAnyBan?.find(bannedUser => bannedUser.user.id === userToBeUnbanned?.id)
      let unbanReason = interaction.options.getString('reason')

      // checks if user has permission to run this command
      if (!memberRunningCommand?.permissions.has(PermissionsBitField.Flags.BanMembers)) {
        interaction.reply('You have no permission to unban members :bangbang:')
          .catch(err => console.log(`Happens this error ${err} when trying send reply`))
        return
      }

      // check if exists user at ban section
      if (isThereAnyBan!.size === 0) {
        await interaction.reply('There no one banned from this guild!')
        return
      }

      if (!bannedUserId) {
        await interaction.reply('User Id provided to be unbanned not find in this server')
        return
      }

      try {
        await interaction.guild?.bans.remove(userToBeUnbanned!, unbanReason!)
        interaction.reply(`${userToBeUnbanned} has been unbanned :partying_face:`)
      } catch (err) {
        interaction.reply('This user cannot be unban!')
        return
      }
    }

    /**
     * Time out user Logic
    */

    case 'user-timeout': {
      const userToTimeout = interaction.options.getUser('user')
      const timeoutDuration = interaction.options.getString('duration')
      const timeoutReason = interaction.options.getString('reason')
      const isUserExistInThisGuild = await interaction.guild?.members.fetch(userToTimeout!)
      const timeoutChannel = interaction.guild?.channels.cache.get('1194045096157515897') as GuildTextBasedChannel
      const memberRunningCommand = interaction.guild?.members.cache.get(interaction.user.id) // with this i get the has method
      const msDuration = ms(timeoutDuration!)
      let userIsInGuild = ''
      let botUser = ''

      // gets the userId to being timed out in this guild for verifications
      try {
        await interaction.guild?.members.cache.filter(userInGuild => {
          if (userInGuild.id === userToTimeout!.id) {
            userIsInGuild = userInGuild.user.id
          }
        })
      } catch (err) {
        interaction.reply('This user does not exist in this server!')
        return
      }

      // gets the botId to make some verifications
      await interaction.guild?.members.cache.filter(role => {
        if (role.user.bot === true) {
          botUser = role.user.id
        }
      })

      // check if the user receiving a timeout is a bot or the user giving the timeout
      if (botUser === userIsInGuild  || userIsInGuild === interaction.member!.user.id) {
        interaction.reply('You cannot timeout a bot or yourself!')
        return
      }

      // check if timeoutDuration provide is a number
      if (isNaN(msDuration)) {
        await interaction.reply('Please provide a valid timeout duration - (number)')
        return
      }
      
      // check if msDuration is less than 5s and greater than 28 days
      if (msDuration < 5000 || msDuration > 2.419e9) {
        await interaction.reply('Timeout durant cannot be less than 5s and greater than 28 days')
        return
      }

      const userToTimeoutRolePosition = await isUserExistInThisGuild!.roles.highest.position // role position of user to being timed out
      const userRunningCommandRolePosition = interaction.guild?.members.me?.roles.highest.position // role position of the user running timeout command
      const botRolePosition = interaction.guild?.members.me?.roles.highest.position // role position from channel bot

      // these two if check if the user being timed out has the same role position level of the user setting the timeout and the bot.
      if (userToTimeoutRolePosition >= userRunningCommandRolePosition!) {
        await interaction.reply('You cannot timeout this user because he have same/higher role than you')
        return
      }

      if (userToTimeoutRolePosition >= botRolePosition!) {
        await interaction.reply('This user cannot be timed out because he have same/higher role than bot')
        return
      }

      // checks if user has permission to run this command
      if (!memberRunningCommand?.permissions.has(PermissionsBitField.Flags.MuteMembers)) {
        interaction.reply('You have no permission to mute members')
        return
      }

      try {
        const { default: prettyMs } = await import('pretty-ms')

        // Check if user is already timed out, if so the time out is updated
        if (isUserExistInThisGuild!.isCommunicationDisabled()) {
          await isUserExistInThisGuild.timeout(msDuration, timeoutReason!)
          await interaction.reply(`${isUserExistInThisGuild} timeout :timer::timer_clock: has been updated to ${prettyMs(msDuration, { verbose: true })}`)
          timeoutChannel.send(`Username: ${isUserExistInThisGuild!.user} userId: ${isUserExistInThisGuild!.id} was timed out ⏲️ by the following reason: ${timeoutReason}`)
          setTimeout(() => {
            isUserExistInThisGuild.timeout(null)
            timeoutChannel.send(`Username: ${isUserExistInThisGuild!.user} userId: ${isUserExistInThisGuild!.id} has your time out penalty removed! ✅`)
          }, msDuration)
          return
        }

        await isUserExistInThisGuild!.timeout(msDuration, timeoutReason!)
        await interaction.reply(`${isUserExistInThisGuild} was timed out ⏲️ for ${prettyMs(msDuration, { verbose: true })}. Reason: ${timeoutReason}`)
        timeoutChannel.send(`Username: ${isUserExistInThisGuild} userId: ${isUserExistInThisGuild!.id} was timed out ⏲️ by the following reason: ${timeoutReason}`)
          .catch(err => interaction.editReply(`${err.message}`))
        setTimeout(() => {
          isUserExistInThisGuild?.timeout(null)
          timeoutChannel.send(`Username: ${isUserExistInThisGuild!.user} userId: ${isUserExistInThisGuild!.id} has your time out penalty removed! ✅`)
            .catch(err => (interaction.editReply(`${err.message}`)))
        }, msDuration)
        return
      } catch (err) {
        interaction.reply(`Theres an error timing out this user: ${err}`)
        return
      }
    }

    /**
     * Temporary role logic
    */

    case 'temporary-role': {
      const guild = interaction.guild
      const userToAddRole = guild?.members.cache.get(interaction.options.getUser('user')!.id)
      const roleToAdd = interaction.options.getRole('role')
      const roleDuration = interaction.options.getString('role-duration')
      const { user } = interaction
      const memberRunningCommand = interaction.guild?.members.cache.get(user.id) // with this i get the has method
      const msDuration = ms(roleDuration!)
      const rolesChannel= interaction.guild?.channels.cache.get('1194371482445430985') as GuildTextBasedChannel

      /*
      * ==> member?.permissions.has(PermissionsBitField.Flags.MuteMembers))
      * this command gives me the has method which enables me to check if the user has required permissions
      * to run a command. Although this check in the end is useless because if the user's role has no permission
      * to do that operation the command even shows up when typed
      * */

      // Check if user has permissions to run this slash command
      if (!memberRunningCommand?.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
        interaction.reply('You have no permission to manage roles')
        return
      }

      // check if duration is a number
      if (isNaN(msDuration)) {
        await interaction.reply('Please provide a valid timeout duration - (number)')
        return
      }

      // check if msDuration is less than 5s and greater than 28 days
      if (msDuration < 5000 || msDuration > 2.419e9) {
        await interaction.reply('Temporary role time cannot be less than 5s and greater than 28 days')
        return
      }

      try {
        const { default: prettyMs } = await import('pretty-ms')
        userToAddRole!.roles.add(roleToAdd!.id)
        rolesChannel.send(`User: ${userToAddRole?.displayName} receive a new role and it will be available for this time: ${prettyMs(msDuration, { verbose: true })}`)
        await interaction.reply(`User: received a new role: ${roleToAdd!.name} for this period of time: ${prettyMs(msDuration, { verbose: true })}`)
        
        setTimeout(() => {
          userToAddRole?.roles.remove(roleToAdd!.id)
          rolesChannel.send(`User: ${userToAddRole?.displayName} has the new role removed from your profile`)
          interaction.editReply(`User: Has the role: ${roleToAdd!.name} removed from your profile`)
        }, msDuration)
      } catch (err) {
        interaction.reply(`happens an error: ${err}`)
        console.log(err)
      }
    }
  }
}