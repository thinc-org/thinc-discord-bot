import { Colors, PermissionFlagsBits, RoleCreateOptions } from 'discord.js'

export const createThincRoleOptions = (): RoleCreateOptions => ({
  name: 'Thinc.',
  color: Colors.Aqua,
  mentionable: true,
})

export const createGenerationRoleOptions = (
  name: string,
): RoleCreateOptions => ({
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
