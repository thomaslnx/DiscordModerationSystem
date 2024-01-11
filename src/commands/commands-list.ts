import { RESTPostAPIApplicationCommandsJSONBody } from 'discord.js'

import { banUsers } from './ban-users.ts'
import { unbanUsers } from './unban-users.ts'
import { timeoutUsers } from './timeout-users.ts'
import { temporaryRole } from './temporary-role.ts'

export const commandsList: RESTPostAPIApplicationCommandsJSONBody[] = [
    banUsers,
    unbanUsers,
    timeoutUsers,
    temporaryRole
  ]