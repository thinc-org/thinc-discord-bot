import { Logger } from '@nestjs/common'

import { RegisterService } from '@app/api/register/register.service'
import { IsModalInteractionGuard } from '@app/discord/guards/modal'
import {
  getGenerationFromStudentId,
  getGenerationName,
  isStudentId,
} from '@app/utils/student'
import { ModalFieldsTransformPipe } from '@discord-nestjs/common'
import {
  Command,
  DiscordCommand,
  On,
  Payload,
  UseCollectors,
  UseGuards,
  UsePipes,
} from '@discord-nestjs/core'
import { Field } from '@discord-nestjs/core'
import {
  ModalActionRowComponentBuilder,
  userMention,
} from '@discordjs/builders'
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CommandInteraction,
  EmbedBuilder,
  ModalBuilder,
  ModalSubmitInteraction,
  TextInputBuilder,
  TextInputStyle,
} from 'discord.js'
import { TextInputModalData } from 'discord.js'

import { PostInteractionCollector } from './register.collector'
import {
  CANCEL_BUTTON_ID,
  CONFIRM_BUTTON_ID,
  MODAL_FIRST_NAME_ID,
  MODAL_ID,
  MODAL_LAST_NAME_ID,
  MODAL_NICKNAME_ID,
  MODAL_STUDENT_ID_ID,
} from './register.constant'

export class RegisterCommandDTO {
  @Field(MODAL_NICKNAME_ID)
  nickname: TextInputModalData

  @Field(MODAL_FIRST_NAME_ID)
  firstName: TextInputModalData

  @Field(MODAL_LAST_NAME_ID)
  lastName: TextInputModalData

  @Field(MODAL_STUDENT_ID_ID)
  studentId: TextInputModalData
}

@Command({
  name: 'register',
  description: 'Apply for registration',
})
@UseCollectors(PostInteractionCollector)
export class RegisterCommand implements DiscordCommand {
  private readonly logger = new Logger(RegisterCommand.name)

  constructor(private readonly registerService: RegisterService) {}

  async handler(interaction: CommandInteraction): Promise<void> {
    const modal = new ModalBuilder()
      .setTitle('Welcome to Thailand incubator club 🎉')
      .setCustomId(MODAL_ID)

    const nicknameComponent = new TextInputBuilder()
      .setCustomId(MODAL_NICKNAME_ID)
      .setLabel('Your nickname (EN)')
      .setStyle(TextInputStyle.Short)

    const firstNameComponent = new TextInputBuilder()
      .setCustomId(MODAL_FIRST_NAME_ID)
      .setLabel('Your first name (EN)')
      .setStyle(TextInputStyle.Short)

    const lastNameComponent = new TextInputBuilder()
      .setCustomId(MODAL_LAST_NAME_ID)
      .setLabel('Your last name (EN)')
      .setStyle(TextInputStyle.Short)

    const studentIdComponent = new TextInputBuilder()
      .setCustomId(MODAL_STUDENT_ID_ID)
      .setLabel('Your student ID')
      .setStyle(TextInputStyle.Short)

    const rows = [
      nicknameComponent,
      firstNameComponent,
      lastNameComponent,
      studentIdComponent,
    ].map((component) =>
      new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
        component,
      ),
    )

    modal.addComponents(...rows)

    await interaction.showModal(modal)
  }

  @On('interactionCreate')
  @UsePipes(ModalFieldsTransformPipe) // ModalFieldsTransformPipe is required if you want use DTO
  @UseGuards(IsModalInteractionGuard)
  async onModalSubmit(
    @Payload() payload: RegisterCommandDTO,
    modal: ModalSubmitInteraction,
  ) {
    // get discord user data
    const user = modal.user

    this.logger.log(
      `Modal ${modal.customId} submitted, User ${user.id} - ${payload.studentId.value}`,
    )

    // check if this modal is not for this command
    if (modal.customId !== MODAL_ID) return

    // extract data from payload
    const { nickname, firstName, lastName, studentId } = payload

    // If data is invalid, show error message
    if (!isStudentId(studentId.value)) {
      await modal.reply({
        content: 'รหัสนักศึกษาไม่ถูกต้อง',
        ephemeral: true,
      })
    }

    // caculate the user generation
    const generation = getGenerationFromStudentId(studentId.value)
    const generationName = getGenerationName(generation)

    // store unconfirmed data to database
    await this.registerService.storeUnconfirmedForm({
      id: user.id,
      nickname: nickname.value,
      firstName: firstName.value,
      lastName: lastName.value,
      studentId: studentId.value,
      guildId: modal.guildId,
      generation: generation,
    })

    // create embed message for modal reply
    const userProfile = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('กรุณาตรวจสอบข้อมูล')
      .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
      .setDescription('กรุณาตรวจสอบข้อมูลของคุณอีกครั้งก่อนกดยืนยันข้อมูล')
      .addFields(
        { name: 'Nickname', value: nickname.value, inline: true },
        { name: '\u200B', value: '\u200B', inline: true },
        { name: 'Student ID', value: studentId.value, inline: true },
      )
      .addFields(
        { name: 'First Name', value: firstName.value, inline: true },
        { name: '\u200B', value: '\u200B', inline: true },
        { name: 'Last Name', value: lastName.value, inline: true },
        {
          name: 'Generation',
          value: generationName,
        },
      )
      .setTimestamp()
    // create button for modal reply
    const components = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId(CANCEL_BUTTON_ID)
        .setLabel('ยกเลิก')
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId(CONFIRM_BUTTON_ID)
        .setLabel('ยืนยัน')
        .setStyle(ButtonStyle.Primary),
    )
    // reply modal
    const metionedUser = userMention(user.id)
    await modal.reply({
      content: `เอ๊ะ ข้อมูลของคุณ​ ${metionedUser} ถูกไหมนะ? ตรวจสอบข้อมูลก่อนกดยืนยัน!`,
      embeds: [userProfile],
      components: [components],
      ephemeral: true,
    })
  }
}
