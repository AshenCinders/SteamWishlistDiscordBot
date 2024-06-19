import {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
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
