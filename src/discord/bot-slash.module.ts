import { Module } from '@nestjs/common'

import { PrismaModule } from '@app/prisma/prisma.module'
import {
  ReflectMetadataProvider,
  registerFilterGlobally,
} from '@discord-nestjs/core'

// import { NotiCommand, notiSubCommands } from './commands/noti/noti.command'
import { PingCommand } from './commands/ping/ping.command'
import { CommandErrorFilter } from './filters/common-error.filter'

@Module({
  imports: [PrismaModule],
  providers: [
    ReflectMetadataProvider,
    PingCommand,
    {
      provide: registerFilterGlobally(),
      useClass: CommandErrorFilter,
    },
  ],
})
export class BotSlashCommands {}
