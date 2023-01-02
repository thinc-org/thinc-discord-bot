import { Injectable, Logger } from '@nestjs/common'

import { InjectDiscordClient } from '@discord-nestjs/core'
import { Client, CreateRoleOptions, Role } from 'discord.js'

@Injectable()
export class RoleService {
  private readonly logger = new Logger(RoleService.name)

  constructor(@InjectDiscordClient() private readonly client: Client) {}

  async findOrCreateRole(guildId: string, roleOptions: CreateRoleOptions) {
    let role: Role
    const guild = this.client.guilds.cache.get(guildId)

    const roleName = roleOptions.name
    if (!roleName) {
      this.logger.error('Role name is required')
      return
    }

    // If given role name exists, update it
    if (guild.roles.cache.some((role) => role.name === roleName)) {
      role = guild.roles.cache.find((role) => role.name === roleName)
      role.setPermissions(roleOptions.permissions)
    }
    // Else, create a new role
    else {
      role = await guild.roles.create(roleOptions)
    }

    return role
  }
}
