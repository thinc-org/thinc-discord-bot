import { Injectable, Logger } from '@nestjs/common'

import { PrismaService } from '@app/prisma/prisma.service'

@Injectable()
export class GuildService {
  private readonly logger = new Logger(GuildService.name)

  constructor(private readonly prisma: PrismaService) {}

  async registerGuild(guildId: string, guildName: string) {
    const guild = await this.prisma.guild.upsert({
      where: { id: guildId },
      create: { id: guildId, name: guildName },
      update: { name: guildName },
    })
    return guild
  }
}
