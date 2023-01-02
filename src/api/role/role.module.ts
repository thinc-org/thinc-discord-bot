import { Module } from '@nestjs/common'

import { DiscordModule } from '@discord-nestjs/core'

import { RoleService } from './role.service'

@Module({
  imports: [DiscordModule.forFeature()],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
