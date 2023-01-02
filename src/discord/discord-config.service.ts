import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { IConfiguration } from '@app/config/configuration'
import { RegisterCommandService } from '@app/discord/register-command/register-command.service'
import { PrismaService } from '@app/prisma/prisma.service'
import {
  DiscordModuleOption,
  DiscordOptionsFactory,
} from '@discord-nestjs/core'
import { RegisterCommandOptions } from '@discord-nestjs/core/dist/definitions/interfaces/register-command-options'
import { GatewayIntentBits } from 'discord.js'

@Injectable()
export class DiscordConfigService implements DiscordOptionsFactory {
  private readonly logger = new Logger(DiscordConfigService.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly registerService: RegisterCommandService,
  ) {}

  async createDiscordOptions(): Promise<DiscordModuleOption> {
    const guilds = await this.prisma.guild.findMany({ select: { id: true } })

    const discordConfig =
      this.configService.get<IConfiguration['discord']>('discord')

    this.logger.log(`Registering slash commands for ${guilds.length} guilds...`)

    const registerCommandOptions: RegisterCommandOptions[] = guilds.map(
      (guild) => ({
        forGuild: guild.id,
        removeCommandsBefore: true,
        trigger: () => this.registerService.getSubject(),
      }),
    )

    return {
      token: discordConfig.token,
      prefix: '!',
      discordClientOptions: {
        intents: [
          GatewayIntentBits.Guilds,
          GatewayIntentBits.GuildMessages,
          GatewayIntentBits.GuildVoiceStates,
          GatewayIntentBits.MessageContent,
        ],
      },
      registerCommandOptions,
      failOnLogin: true,
    }
  }
}
