/* bot.module.ts */
import { Module } from '@nestjs/common'

import { PrismaModule } from '@app/prisma/prisma.module'
import { DiscordModule } from '@discord-nestjs/core'

import { BotSlashCommands } from './bot-slash.module'
import { BotGateway } from './bot.gateway'
import { RegisterCommandModule } from './register-command/register-command.module'

@Module({
  imports: [
    DiscordModule.forFeature(),
    BotSlashCommands,
    PrismaModule,
    RegisterCommandModule,
  ],
  providers: [BotGateway],
})
export class BotModule {}
