import { Injectable, Logger } from '@nestjs/common'

import { PrismaService } from '@app/prisma/prisma.service'
import { InjectDiscordClient, Once, PrefixCommand } from '@discord-nestjs/core'
import { Client, Message } from 'discord.js'

import { RegisterCommandService } from './register-command/register-command.service'

@Injectable()
export class BotGateway {
  private readonly logger = new Logger(BotGateway.name)

  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
    private readonly prisma: PrismaService,
    private readonly registerService: RegisterCommandService,
  ) {}

  @Once('ready')
  onReady() {
    this.logger.log(`Bot ${this.client.user.tag} was started!`)
  }

  @PrefixCommand('start')
  async startPrefix(message: Message): Promise<string> {
    const guildId = message.guildId
    const guildName = message.guild.name
    try {
      await this.prisma.guild.upsert({
        where: { id: guildId },
        create: { id: guildId, name: guildName },
        update: { name: guildName },
      })
      this.logger.log(`Triggering register command for guild ${guildId}`)
      this.registerService.triggerRegisterCommand()
      return `Registered slash commands to guild "${guildName}"`
    } catch (err) {
      this.logger.error(err)
      return 'Something went wrong'
    }
  }
}
