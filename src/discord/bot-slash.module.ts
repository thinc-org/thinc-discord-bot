import { Module } from '@nestjs/common'

import { RegisterModule } from '@app/api/register/register.module'
import { RoleModule } from '@app/api/role/role.module'
import { PrismaModule } from '@app/prisma/prisma.module'
import {
  ReflectMetadataProvider,
  registerFilterGlobally,
} from '@discord-nestjs/core'

import { PingCommand } from './commands/ping/ping.command'
import { RegisterCommand } from './commands/register/register.command'
import { VersionCommand } from './commands/version/version.command'
import { CommandErrorFilter } from './filters/common-error.filter'

@Module({
  imports: [PrismaModule, RegisterModule, RoleModule],
  providers: [
    ReflectMetadataProvider,
    PingCommand,
    RegisterCommand,
    VersionCommand,
    {
      provide: registerFilterGlobally(),
      useClass: CommandErrorFilter,
    },
  ],
})
export class BotSlashCommands {}
