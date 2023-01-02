import { Colors, CreateRoleOptions, PermissionFlagsBits } from 'discord.js'

export const createThincRoleOptions = (): CreateRoleOptions => ({
  name: 'Thinc.',
  color: Colors.Aqua,
  mentionable: true,
})

export const createGenerationRoleOptions = (
  name: string,
): CreateRoleOptions => ({
  name: name,
  color: Colors.Orange,
  mentionable: true,
  permissions: [
    PermissionFlagsBits.AddReactions,
    PermissionFlagsBits.AttachFiles,
    PermissionFlagsBits.Connect,
    PermissionFlagsBits.Speak,
    PermissionFlagsBits.UseExternalEmojis,
    PermissionFlagsBits.UseExternalStickers,
    PermissionFlagsBits.SendMessagesInThreads,
    PermissionFlagsBits.EmbedLinks,
  ],
})
