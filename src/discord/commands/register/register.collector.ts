/* post-interaction-collector.ts */
import { RegisterService } from '@app/api/register/register.service'
import { RoleService } from '@app/api/role/role.service'
import {
  createGenerationRoleOptions,
  createThincRoleOptions,
} from '@app/utils/role'
import { getGenerationName } from '@app/utils/student'
import { InteractionEventCollector, On } from '@discord-nestjs/core'
import { ButtonInteraction, userMention } from 'discord.js'

import { CANCEL_BUTTON_ID, CONFIRM_BUTTON_ID } from './register.constant'

@InteractionEventCollector({ time: 15000 })
export class PostInteractionCollector {
  constructor(
    private readonly registerService: RegisterService,
    private readonly roleService: RoleService,
  ) {}

  @On('collect')
  async onCollect(interaction: ButtonInteraction): Promise<void> {
    if (interaction.customId === CANCEL_BUTTON_ID) {
      await this.cancelRegistration(interaction)
    } else if (interaction.customId === CONFIRM_BUTTON_ID) {
      await this.confirmRegistration(interaction)
    } else {
      await interaction.reply({
        content: 'ไม่มีการตอบสนอง กรุณาลองใหม่อีกครั้ง',
      })
    }
  }

  async confirmRegistration(interaction: ButtonInteraction): Promise<void> {
    const form = await this.registerService.loadForm(
      interaction.user.id,
      interaction.guildId,
    )

    if (!form) {
      await interaction.update({
        content: 'ไม่พบข้อมูล กรุณาลองใหม่อีกครั้ง',
        embeds: [],
        components: [],
      })
      return
    }

    // prepare data
    const guild = interaction.guild
    const guildId = interaction.guildId
    const nickname = form.nickname
    const discordUserId = form.id
    const generation = form.generation
    const generationName = getGenerationName(generation)
    const mentionedUser = userMention(discordUserId)

    // find or create roles for user
    const [generationRole, thincRole] = await Promise.all([
      this.roleService.findOrCreateRole(
        guildId,
        createGenerationRoleOptions(generationName),
      ),
      this.roleService.findOrCreateRole(guildId, createThincRoleOptions()),
    ])
    // Add the roles to user
    await Promise.all([
      guild.members.cache.get(discordUserId).roles.add(generationRole),
      guild.members.cache.get(discordUserId).roles.add(thincRole),
    ])

    // Change user Discord nickname
    // Check if user is owner of guild, if so, don't change nickname
    if (guild.ownerId !== discordUserId) {
      await guild.members.cache
        .get(discordUserId)
        .setNickname(`${generationName} - ${nickname}`)
    }

    // Temporary fix for the issue 'The reply to this interaction has already been sent or deferred.'
    if (interaction.replied) return

    // update and reply result to user
    await interaction.update({
      content: 'ลงทะเบียนเสร็จสิ้น! อย่าลืม dismiss ข้อความนี้นะ',
      embeds: [],
      components: [],
    })

    await interaction.channel.send({
      content: `ยินดีต้อนรับคุณ "${nickname}" (${mentionedUser}) 🎉 ตอนนี้คุณได้เข้ามาเป็นส่วนหนึ่งของ Thinc. ${generationName} เรียบร้อยแล้ว! เย้ 🌈`,
      embeds: [],
      components: [],
    })
  }

  async cancelRegistration(interaction: ButtonInteraction): Promise<void> {
    await interaction.update({
      content: `งื้ออ ไว้มาลงทะเบียนใหม่น้าา ❤️`,
      embeds: [],
      components: [],
    })
  }
}
