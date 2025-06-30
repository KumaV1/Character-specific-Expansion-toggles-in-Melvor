import { Constants } from "./Constants";
import { SaveSlotConfigurationManager } from "./SaveSlotConfigurationManager";
import { ExpansionToggleState } from "./models/ExpansionToggleState"

/**
 * Manages UI changes to character selection menu
 */
export class CharacterSelectionUiManager {
    /**
     * Patch methods
     * @param ctx
     */
    public static patch(ctx: Modding.ModContext): void {
        /**
         * Patch set slot, so the function is set with the proper id as parameter
         */
        ctx.patch(SaveSlotDisplayElement, 'setSlotID').after(function (returnValue: void, slotID: number) {
            // Check whether custom elements have yet to be added
            if (!this.expansionTogglesDivider && !this.expansionTogglesButton) {
                CharacterSelectionUiManager.AddDividerAndButton(this);
            }

            // Safety check that elements now exist (should always be true)
            if (this.expansionTogglesDivider && this.expansionTogglesButton) {
                this.expansionTogglesButton.onclick = () => CharacterSelectionUiManager.openExpansionToggles(slotID);
            }
        });

        /**
         * While "showCloudSettings", "showLocalSettings" and "showEmptySaveSettings" do exist, 
         * it's probably fine to just show the button in all cases?
         */
    }

    /**
     * Adds the divider and button elements for mod's functionality, but with no onclick triggers yet!
     * @param element
     */
    private static AddDividerAndButton(slotDisplayElement: SaveSlotDisplayElement) {
        // Divider
        let divider: HTMLDivElement = createElement('div', {
            classList: ['dropdown-divider'],
            attributes: [['role', 'separator']]
        });

        // Button
        const icon: HTMLElement = createElement('i', {
            classList: ['fa', 'fa-sliders-h', 'mr-1']
        });
        const text: HTMLSpanElement = createElement('span', {
            text: getLangString(`${Constants.MOD_NAMESPACE}_EXPANSION_TOGGLES_OPEN_BUTTON`)                  
        });
        let button: HTMLAnchorElement = createElement('a', {
            classList: ['dropdown-item', 'pointer-enabled']
        });
        button.appendChild(icon);
        button.appendChild(text);

        // Set properties to elements
        slotDisplayElement.expansionTogglesDivider = divider;
        slotDisplayElement.expansionTogglesButton = button;

        // Add elements to UI
        slotDisplayElement.deleteSettingsDivider.insertAdjacentElement('beforebegin', slotDisplayElement.expansionTogglesDivider);
        slotDisplayElement.deleteSettingsDivider.insertAdjacentElement('beforebegin', slotDisplayElement.expansionTogglesButton);
    }

    /**
     * Open expansion toggle modal for given save slot
     * @param slotId
     */
    private static openExpansionToggles(slotId: number) {
        console.log('openExpansionToggles called, with slot id ' + slotId);
        SaveSlotConfigurationManager.updateConfiguration(slotId, {
            toth: slotId < 3
                ? ExpansionToggleState.RequiredOn
                : slotId < 6
                    ? ExpansionToggleState.RequiredOff
                    : ExpansionToggleState.NoPreference
        });
        SaveSlotConfigurationManager.updateAccountStorage();
    }
}