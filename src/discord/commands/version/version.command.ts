import { Injectable, Logger } from '@nestjs/common'

import { packageJson } from '@app/package'
import { TransformPipe } from '@discord-nestjs/common'
import { Command, DiscordCommand, UsePipes } from '@discord-nestjs/core'
import { InteractionReplyOptions } from 'discord.js'

@Command({
  name: 'version',
  description: 'Show the version of the discord bot',
})
@UsePipes(TransformPipe)
@Injectable()
export class VersionCommand implements DiscordCommand {
  private readonly logger = new Logger(VersionCommand.name)

  handler(): InteractionReplyOptions {
    this.logger.log(`Performing 'version' command...`)
    return {
      content: `Version ${packageJson.version}`,
      ephemeral: true,
    }
  }
}
