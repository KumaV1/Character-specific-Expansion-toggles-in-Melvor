/** Define custom properties */
declare global {
    interface SaveSlotDisplayElement {
        /**
         * A divider to place before the expansion toggles button, in the menu list
         */
        expansionTogglesDivider?: HTMLDivElement,

        /**
         * The button for opening expansion toggles, in the menu list
         */
        expansionTogglesButton?: HTMLAnchorElement
    }
}

export { }