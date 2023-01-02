import { Injectable, Logger } from '@nestjs/common'

import { PrismaService } from '@app/prisma/prisma.service'
import { Member } from '@prisma/client'

@Injectable()
export class RegisterService {
  private readonly logger = new Logger(RegisterService.name)

  constructor(private readonly prisma: PrismaService) {}

  async storeUnconfirmedForm(payload: Omit<Member, 'confirmed'>) {
    const member = this.prisma.member.upsert({
      where: {
        id_guildId: { id: payload.id, guildId: payload.guildId },
      },
      update: payload,
      create: payload,
    })
    return member
  }

  async confirmForm(userId: string, guildId: string) {
    const member = await this.prisma.member.update({
      where: { id_guildId: { id: userId, guildId } },
      data: { confirmed: true },
    })

    return member
  }

  async loadForm(userId: string, guildId: string) {
    const member = await this.prisma.member.findUnique({
      where: { id_guildId: { id: userId, guildId } },
    })

    if (!member) {
      throw new Error(`No form with user id ${userId} and guild id ${guildId}`)
    }

    return member
  }
}
