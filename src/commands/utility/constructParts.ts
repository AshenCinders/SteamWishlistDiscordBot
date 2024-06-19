import {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} from 'discord.js';

/**
 * Constructs a wishlist fetch modal
 * @returns A discord modal.
 */
export function newWishlistModal(): ModalBuilder {
    const identifierModal = new ModalBuilder({
        customId: 'idModal',
        title: 'WishlistBot',
    });
    const indentifierInput = new TextInputBuilder({
        customId: 'idText',
        label: 'Steam64/custom name',
        style: TextInputStyle.Paragraph,
        maxLength: 100,
        placeholder:
            'Please write the Steam64ID or custom name (from a custom Steam URL if there is one)',
        required: true,
    });
    const textActionRow =
        new ActionRowBuilder<TextInputBuilder>().addComponents(
            indentifierInput
        );
    identifierModal.addComponents(textActionRow);
    return identifierModal;
}

/**
 * Constructs a refetch button.
 * @param isDisabled is a bool that decidides of the button
 *  should be unclickable.
 * @param label is the text displayed on the button.
 * @returns A discord button for refetching data.
 */
export function newRefetchButton(
    isDisabled: boolean,
    label: string
): ActionRowBuilder<ButtonBuilder> {
    const buttonRefetch = new ButtonBuilder()
        .setCustomId('refetch')
        .setLabel(label)
        .setStyle(ButtonStyle.Primary)
        .setDisabled(isDisabled);

    return new ActionRowBuilder<ButtonBuilder>().addComponents(buttonRefetch);
}
