import { Constants } from "./Constants";
import { SaveSlotConfigurationManager } from "./SaveSlotConfigurationManager";
import { CloudManagerExpansionIdentifier } from "./models/CloudManagerExpansionIdentifier";
import { ExpansionToggleState } from "./models/ExpansionToggleState"
import { SaveSlotExpansionCheckResult } from "./models/SaveSlotExpansionCheckResult";
import { SaveSlotExpansionCheckResults } from "./models/SaveSlotExpansionCheckResults";
import { SaveSlotExpansionToggleStates } from "./models/SaveSlotExpansionToggleStates";
import { computeExpansionValidityForSave, setExpansionToggle } from "./utils";

/**
 * Manages UI changes to character selection menu
 */
export class CharacterSelectionUiManager {
    /**
     * Patch methods
     * @param ctx
     */
    public static patch(ctx: Modding.ModContext): void {
        CharacterSelectionUiManager.patchElements(ctx);
    }

    /**
     * Patches elements, using the usual patching logic provided by the game
     * @param ctx
     */
    private static patchElements(ctx: Modding.ModContext) {
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
         * it's probably fine to just show the button in all cases? (NEVERMIND TIS COMMENT, SEE COMMENT BLOCK ON LINE 52 ONWARDS)
         */
        ctx.patch(SaveSlotDisplayElement, 'setCloudSave').after(function (returnValue: void, slotID: number, cloudInfo: SaveGameHeader, localInfo?: SaveGameHeader): void {
            if (this.forceLoadOption.onclick !== null) {
                const originalOnClick = this.forceLoadOption.onclick;
                this.forceLoadOption.onclick = null;

                this.forceLoadOption.onclick = async (e) => {
                    const checkResults = computeExpansionValidityForSave(slotID, true);

                    if (CharacterSelectionUiManager.checkResultsAreInvalid(checkResults)) {
                        await CharacterSelectionUiManager.fireExpansionMismatchPrompt(checkResults);
                    } else {
                        originalOnClick.call(this.forceLoadOption, e);
                    }
                };
            }
        });

        /**
         * While "showCloudSettings", "showLocalSettings" and "showEmptySaveSettings" do exist, 
         * it's probably fine to just show the button in all cases? (NEVERMIND TIS COMMENT, SEE COMMENT BLOCK ON LINE 52 ONWARDS)
         */
        ctx.patch(SaveSlotDisplayElement, 'setLocalSave').after(function (returnValue: void, slotID: number, cloudInfo: SaveGameHeader, localInfo?: SaveGameHeader): void {
            if (this.forceLoadOption.onclick !== null) {
                const originalOnClick = this.forceLoadOption.onclick;
                this.forceLoadOption.onclick = null;

                this.forceLoadOption.onclick = async (e) => {
                    const checkResults = computeExpansionValidityForSave(slotID, false);

                    if (CharacterSelectionUiManager.checkResultsAreInvalid(checkResults)) {
                        await CharacterSelectionUiManager.fireExpansionMismatchPrompt(checkResults);
                    } else {
                        originalOnClick.call(this.forceLoadOption, e);
                    }
                };
            }
        });

        ctx.patch(CharacterDisplayElement, 'setCharacter').after(function (returnValue: void, slotID: number, headerInfo: SaveGameHeader, isCloud: boolean, disableCallbacks?: boolean): void {
            if (this.selectCharacterButton.onclick !== null) {
                const originalOnClick = this.selectCharacterButton.onclick;
                this.selectCharacterButton.onclick = null;

                this.selectCharacterButton.onclick = async (e) => {
                    const checkResults = computeExpansionValidityForSave(slotID, isCloud);

                    if (CharacterSelectionUiManager.checkResultsAreInvalid(checkResults)) {
                        await CharacterSelectionUiManager.fireExpansionMismatchPrompt(checkResults);
                    } else {
                        originalOnClick.call(this.selectCharacterButton, e);
                    }
                };
            }
        });
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
    private static async openExpansionToggles(slotId: number): Promise<void> {
        console.log('openExpansionToggles called, with slot id ' + slotId);
        await CharacterSelectionUiManager.fireConfigurationPrompt(slotId);
    }

    /**
     * 
     * @param saveSlotId
     */
    private static async fireConfigurationPrompt(saveSlotId: number): Promise<void> {
        SwalLocale.fire({
            title: getLangString(`${Constants.MOD_NAMESPACE}_EXPANSION_CONFIGURATION_MODAL_TITLE`),
            icon: 'info',
            html: CharacterSelectionUiManager.buildConfigurationPromptContent(saveSlotId),
            showConfirmButton: true,
            confirmButtonText: getLangString(`${Constants.MOD_NAMESPACE}_EXPANSION_CONFIGURATION_MODAL_CONFIRMATION_BUTTON`),
            showDenyButton: true,
            denyButtonText: getLangString(`${Constants.MOD_NAMESPACE}_EXPANSION_CONFIGURATION_MODAL_DENY_BUTTON`),
            preConfirm: () => {
                return {
                    toth: (<HTMLInputElement>document.getElementById(Constants.CONFIGURATION_MODAL_TOTH_INPUT_ELEMENT_ID))?.value,
                    aod: (<HTMLInputElement>document.getElementById(Constants.CONFIGURATION_MODAL_AOD_INPUT_ELEMENT_ID))?.value,
                    ita: (<HTMLInputElement>document.getElementById(Constants.CONFIGURATION_MODAL_ITA_INPUT_ELEMENT_ID))?.value
                };
            }
        }).then(async (result: { isConfirmed: boolean, value: Partial<SaveSlotExpansionToggleStates> }) => {
            if (result.isConfirmed) {
                SaveSlotConfigurationManager.updateConfiguration(saveSlotId, result.value);
                SaveSlotConfigurationManager.updateAccountStorage();
                console.log('New expansion configuration:');
                console.log(result.value);
                fireTopToast(`<div class="block block-rounded-double bg-dark p-2">
                  <div class="media d-flex align-items-center push">
                    <div class="media-body text-left">
                      <div class="text-success">
                        ${getLangString(`${Constants.MOD_NAMESPACE}_EXPANSION_CONFIGURATION_MODAL_CONFIRMATION`)}
                      </div>
                    </div>
                  </div>
                </div>`, 5000)
            }
        });
    }

    /**
     * 
     * @param checkResults
     */
    private static async fireExpansionMismatchPrompt(checkResults: SaveSlotExpansionCheckResults): Promise<void> {
        SwalLocale.fire({
            title: getLangString(`${Constants.MOD_NAMESPACE}_EXPANSION_MISMATCH_MODAL_TITLE`),
            icon: 'warning',
            html: CharacterSelectionUiManager.buildExpansionMismatchPromptContent(checkResults),
            showConfirmButton: true,
            confirmButtonText: getLangString(`${Constants.MOD_NAMESPACE}_EXPANSION_MISMATCH_MODAL_CONFIRMATION_BUTTON`),
            showDenyButton: true,
            denyButtonText: getLangString(`${Constants.MOD_NAMESPACE}_EXPANSION_MISMATCH_MODAL_DENY_BUTTON`),
        }).then(async (result: { value: any }) => {
            if (result.value) {
                // DEV NOTE: "cloudManager.enabledExpansions" isn't accessible from outside. The only way to change the toggles seems to be with the "toggleExpansionLoading" method
                // TODO: Change to loop...
                console.log('Before expansion toggles (only works on those also entitled)');
                console.log([cloudManager.hasTotHEntitlementAndIsEnabled, cloudManager.hasAoDEntitlementAndIsEnabled, cloudManager.hasItAEntitlementAndIsEnabled]);
                switch (checkResults.toth.saveSlotConfigToggleState) {
                    case ExpansionToggleState.RequiredOn:
                        await setExpansionToggle(CloudManagerExpansionIdentifier.ThroneOfTheHerald, true);
                        break;
                    case ExpansionToggleState.RequiredOff:
                        await setExpansionToggle(CloudManagerExpansionIdentifier.ThroneOfTheHerald, false);
                        break;
                    case ExpansionToggleState.NoPreference:
                    default: // TODO: Possibly throw exception, as presumably a bug of this mod, if reaching here?
                        break;
                }
                switch (checkResults.aod.saveSlotConfigToggleState) {
                    case ExpansionToggleState.RequiredOn:
                        await setExpansionToggle(CloudManagerExpansionIdentifier.AtlasOfDiscovery, true);
                        break;
                    case ExpansionToggleState.RequiredOff:
                        await setExpansionToggle(CloudManagerExpansionIdentifier.AtlasOfDiscovery, false);
                        break;
                    case ExpansionToggleState.NoPreference:
                    default: // TODO: Possibly throw exception, as presumably a bug of this mod, if reaching here?
                        break;
                }
                switch (checkResults.ita.saveSlotConfigToggleState) {
                    case ExpansionToggleState.RequiredOn:
                        await setExpansionToggle(CloudManagerExpansionIdentifier.IntoTheAbyss, true);
                        break;
                    case ExpansionToggleState.RequiredOff:
                        await setExpansionToggle(CloudManagerExpansionIdentifier.IntoTheAbyss, false);
                        break;
                    case ExpansionToggleState.NoPreference:
                    default: // TODO: Possibly throw exception, as presumably a bug of this mod, if reaching here?
                        break;
                }
                console.log('After expansion toggles (only works on those also entitled)');
                console.log([cloudManager.hasTotHEntitlementAndIsEnabled, cloudManager.hasAoDEntitlementAndIsEnabled, cloudManager.hasItAEntitlementAndIsEnabled]);

                SwalLocale.fire({
                    title: 'Adjustment confirmed',
                    icon: 'success',
                    html: 'Please wait 5 seconds, the game will soon reload to reflect the changes made',
                    showConfirmButton: false,
                    showDenyButton: false,
                });

                setTimeout(function () {
                    window.location.reload();
                }, 5000);
            }
        });
    }

    /**
     * Check whether the check results indicate an invalid situation
     * @param checkResults
     */
    private static checkResultsAreInvalid(checkResults: SaveSlotExpansionCheckResults): boolean {
        for (const [key, value] of Object.entries(checkResults)) {
            const propValue: SaveSlotExpansionCheckResult = value; // help with type assertion
            if (checkResults.hasOwnProperty(key)) {
                switch (propValue.saveSlotConfigToggleState) {
                    case ExpansionToggleState.RequiredOn:
                        if (!propValue.isEnabled || !propValue.dataLoaded) {
                            return true;
                        }
                        break;
                    case ExpansionToggleState.RequiredOff:
                        if (propValue.isEnabled || propValue.dataLoaded) {
                            return true;
                        }
                        break;
                    case ExpansionToggleState.NoPreference:
                        break;
                    default:
                        break; // TODO: Possibly throw exception, as presumably a bug of this mod, if reaching here?
                }
            }
        }

        return false;
    }

    private static buildConfigurationPromptContent(saveSlotId: number): string {
        const config = SaveSlotConfigurationManager.getConfiguration(saveSlotId);
        console.log(config);

        // Most external wrapper
        const wrapper = createElement('div', {
            classList: ['overflow-hidden']
        });

        // Sub wrapper
        const subWrapper = createElement('div', { // just following a similar format to the mod profile mis match, not sure if this actually serves a purpose
            classList: ['overflow-hidden']
        });
        wrapper.appendChild(subWrapper);

        // Toggles
        // TODO: Improve code-reusage
        if (cloudManager.hasTotHEntitlement) {
            console.log(config?.toth);
            const tothTextElement = createElement('span', {
                classList: ['mr-2'],
                text: 'Throne of the Herald'
            });
            const tothSelectElement = createElement('select', {
                id: Constants.CONFIGURATION_MODAL_TOTH_INPUT_ELEMENT_ID
            });

            const optionElement1 = createElement('option');
            optionElement1.value = ExpansionToggleState.RequiredOn;
            optionElement1.text = getLangString(`${Constants.MOD_NAMESPACE}_EXPANSION_TOGGLE_STATE_requiredOn`);
            if (config?.toth === ExpansionToggleState.RequiredOn) {
                optionElement1.setAttribute('selected', 'selected'); // Set attribute, so that SweetAlert properly pre-selects a certain select option
            }
            tothSelectElement.add(optionElement1);

            const optionElement2 = createElement('option');
            optionElement2.value = ExpansionToggleState.RequiredOff;
            optionElement2.text = getLangString(`${Constants.MOD_NAMESPACE}_EXPANSION_TOGGLE_STATE_requiredOff`);
            if (config?.toth === ExpansionToggleState.RequiredOff) {
                optionElement2.setAttribute('selected', 'selected');
            }
            tothSelectElement.add(optionElement2);

            const optionElement3 = createElement('option');
            optionElement3.value = ExpansionToggleState.NoPreference; // TODO: Maybe make this the first option, instead of the last (due to this basically being the default logic-wise)
            optionElement3.text = getLangString(`${Constants.MOD_NAMESPACE}_EXPANSION_TOGGLE_STATE_noPreference`);
            if (config?.toth === ExpansionToggleState.NoPreference) {
                optionElement3.setAttribute('selected', 'selected');
            }
            tothSelectElement.add(optionElement3);

            subWrapper.appendChild(tothTextElement);
            subWrapper.appendChild(tothSelectElement);
        }
        if (cloudManager.hasAoDEntitlement) {
            const aodTextElement = createElement('span', {
                classList: ['mr-2'],
                text: 'Atlas of Discovery'
            });
            const aodSelectElement = createElement('select', {
                id: Constants.CONFIGURATION_MODAL_AOD_INPUT_ELEMENT_ID
            });

            const optionElement1 = createElement('option');
            optionElement1.value = ExpansionToggleState.RequiredOn;
            optionElement1.text = getLangString(`${Constants.MOD_NAMESPACE}_EXPANSION_TOGGLE_STATE_requiredOn`);
            if (config?.aod === ExpansionToggleState.RequiredOn) {
                optionElement1.setAttribute('selected', 'selected');
            }
            aodSelectElement.add(optionElement1);

            const optionElement2 = createElement('option');
            optionElement2.value = ExpansionToggleState.RequiredOff;
            optionElement2.text = getLangString(`${Constants.MOD_NAMESPACE}_EXPANSION_TOGGLE_STATE_requiredOff`);
            if (config?.aod === ExpansionToggleState.RequiredOff) {
                optionElement2.setAttribute('selected', 'selected');
            }
            aodSelectElement.add(optionElement2);

            const optionElement3 = createElement('option');
            optionElement3.value = ExpansionToggleState.NoPreference;
            optionElement3.text = getLangString(`${Constants.MOD_NAMESPACE}_EXPANSION_TOGGLE_STATE_noPreference`);
            if (config?.aod === ExpansionToggleState.NoPreference) {
                optionElement3.setAttribute('selected', 'selected');
            }
            aodSelectElement.add(optionElement3);

            if (cloudManager.hasTotHEntitlement) {
                subWrapper.appendChild(createElement('br'));
                subWrapper.appendChild(createElement('br'));
            }
            subWrapper.appendChild(aodTextElement);
            subWrapper.appendChild(aodSelectElement);
        }
        if (cloudManager.hasItAEntitlement) {
            const itaTextElement = createElement('span', {
                classList: ['mr-2'],
                text: 'Into the Abyss'
            });
            const itaSelectElement = createElement('select', {
                id: Constants.CONFIGURATION_MODAL_ITA_INPUT_ELEMENT_ID
            });

            const optionElement1 = createElement('option');
            optionElement1.value = ExpansionToggleState.RequiredOn;
            optionElement1.text = getLangString(`${Constants.MOD_NAMESPACE}_EXPANSION_TOGGLE_STATE_requiredOn`);
            if (config?.ita === ExpansionToggleState.RequiredOn) {
                optionElement1.setAttribute('selected', 'selected');
            }
            itaSelectElement.add(optionElement1);

            const optionElement2 = createElement('option');
            optionElement2.value = ExpansionToggleState.RequiredOff;
            optionElement2.text = getLangString(`${Constants.MOD_NAMESPACE}_EXPANSION_TOGGLE_STATE_requiredOff`);
            if (config?.ita === ExpansionToggleState.RequiredOff) {
                optionElement2.setAttribute('selected', 'selected');
            }
            itaSelectElement.add(optionElement2);

            const optionElement3 = createElement('option');
            optionElement3.value = ExpansionToggleState.NoPreference;
            optionElement3.text = getLangString(`${Constants.MOD_NAMESPACE}_EXPANSION_TOGGLE_STATE_noPreference`);
            if (config?.ita === ExpansionToggleState.NoPreference) {
                optionElement3.setAttribute('selected', 'selected');
            }
            itaSelectElement.add(optionElement3);

            if (cloudManager.hasTotHEntitlement || cloudManager.hasItAEntitlement) {
                subWrapper.appendChild(createElement('br'));
                subWrapper.appendChild(createElement('br'));
            }
            subWrapper.appendChild(itaTextElement);
            subWrapper.appendChild(itaSelectElement);
        }

        // Return overall html
        console.log(wrapper);
        console.log(wrapper.innerHTML);
        return wrapper.innerHTML;
    }

    /**
     * he content for the expansion mismatch prompt
     * @param checkResult
     * @returns
     */
    private static buildExpansionMismatchPromptContent(checkResults: SaveSlotExpansionCheckResults): string {
        // Most external wrapper
        const wrapper = createElement('div', {
            classList: ['overflow-hidden']
        });

        // Sub wrapper
        const subWrapper = createElement('div', { // just following a similar format to the mod profile mis match, not sure if this actually serves a purpose
            classList: ['overflow-hidden']
        });
        wrapper.appendChild(subWrapper);

        // Description
        const descParagraph1 = getLangString(`${Constants.MOD_NAMESPACE}_EXPANSION_MISMATCH_MODAL_PARAGRAPH_1`);
        const descParagraph2 = getLangString(`${Constants.MOD_NAMESPACE}_EXPANSION_MISMATCH_MODAL_PARAGRAPH_2`);
        const descParagraph3 = getLangString(`${Constants.MOD_NAMESPACE}_EXPANSION_MISMATCH_MODAL_PARAGRAPH_3`);
        const description = createElement('div', {
            innerHTML: `<p>${descParagraph1}</p><p>${descParagraph2}</p><p class="font-size-sm text-warning"><i>${descParagraph3}</i></p>`
        });
        const summaryContainer = createElement('div', {
            classList: ['row']
        });
        subWrapper.appendChild(description);
        subWrapper.appendChild(summaryContainer);

        // Summary between description and buttons
        const configurationSummaryContainer = createElement('div', {
            classList: ['col-12', 'mb-1']
        });
        const asIsSummaryContainer = createElement('div', {
            classList: ['col-12', 'mb-0']
        });
        summaryContainer.appendChild(configurationSummaryContainer);
        summaryContainer.appendChild(asIsSummaryContainer);

        // Sub containers (avoid content overflows)
        const configSubContainerHeadline = getLangString(`${Constants.MOD_NAMESPACE}_EXPANSION_MISMATCH_MODAL_DESIRED_CONFIGURATION_HEADLINE`);
        const configurationSummarySubContainer = createElement('div', {
            classList: ['col-12', 'block', 'block-rounded', 'block-link-pop', 'pt-2', 'pl-2', 'pb-2', 'mb-1'],
            innerHTML: `<div class="font-size-sm mb-2 text-info">${configSubContainerHeadline}</span>`
        });
        let configurationSummaryUl = `<ul class="mb-0">`;
        if (cloudManager.hasTotHEntitlement) {
            configurationSummaryUl += `${CharacterSelectionUiManager.buildConfigurationSummaryExpansionEntry('Throne of the Herald', checkResults.toth.saveSlotConfigToggleState)}`;
        }
        if (cloudManager.hasAoDEntitlement) {
            configurationSummaryUl += `${CharacterSelectionUiManager.buildConfigurationSummaryExpansionEntry('Atlas of Discovery', checkResults.aod.saveSlotConfigToggleState)}`;
        }
        if (cloudManager.hasItAEntitlement) {
            configurationSummaryUl += `${CharacterSelectionUiManager.buildConfigurationSummaryExpansionEntry('Into the Abyss', checkResults.ita.saveSlotConfigToggleState)}`;
        }
        configurationSummaryUl += `</ul>`
        configurationSummarySubContainer.innerHTML += configurationSummaryUl;
        summaryContainer.appendChild(configurationSummarySubContainer);

        const asIsSubContainerHeadline = getLangString(`${Constants.MOD_NAMESPACE}_EXPANSION_MISMATCH_MODAL_AS_IS_HEADLINE`);
        const asIsSummarySubContainer = createElement('div', {
            classList: ['col-12', 'block', 'block-rounded', 'block-link-pop', 'pt-2', 'pl-2', 'pb-2', 'mb-0'],
            innerHTML: `<div class="font-size-sm mb-2 text-info">${asIsSubContainerHeadline}</span>`
        });
        let asIsSummaryUl = '<ul class="mb-0">';
        if (cloudManager.hasTotHEntitlement) {
            asIsSummaryUl += `${CharacterSelectionUiManager.buildAsIsSummaryExpansionEntry('Throne of the Herald', checkResults.toth)}`;
        }
        if (cloudManager.hasAoDEntitlement) {
            asIsSummaryUl += `${CharacterSelectionUiManager.buildAsIsSummaryExpansionEntry('Atlas of Discovery', checkResults.aod)}`;
        }
        if (cloudManager.hasItAEntitlement) {
            asIsSummaryUl += `${CharacterSelectionUiManager.buildAsIsSummaryExpansionEntry('Into the Abyss', checkResults.ita)}`;
        }
        asIsSummaryUl += `</ul>`;
        asIsSummarySubContainer.innerHTML += asIsSummaryUl;
        summaryContainer.appendChild(asIsSummarySubContainer);

        // Return overall html
        return wrapper.innerHTML;
    }

    /**
     * 
     * @param expansionName
     * @param toggleState
     * @returns
     */
    private static buildConfigurationSummaryExpansionEntry(expansionName: string, toggleState: ExpansionToggleState): string {
        return `<li class="text-left mt-2"><span class="font-weight-bold">${expansionName}:</span> <span>${getLangString(Constants.MOD_NAMESPACE + "_EXPANSION_TOGGLE_STATE_" + toggleState)}</span></li>`
    }

    /**
     * 
     * @param expansionName
     * @param toggleState
     * @returns
     */
    private static buildAsIsSummaryExpansionEntry(expansionName: string, checkResult: SaveSlotExpansionCheckResult): string {
        let explanation = '';
        if (checkResult.isEnabled && checkResult.dataLoaded) {
            explanation = getLangString(`${Constants.MOD_NAMESPACE}_EXPANSION_MISMATCH_MODAL_AS_IS_EXPLANATION_ENABLED_AND_DATA_LOADED`);
        } else if (!checkResult.isEnabled && !checkResult.dataLoaded) {
            explanation = getLangString(`${Constants.MOD_NAMESPACE}_EXPANSION_MISMATCH_MODAL_AS_IS_EXPLANATION_NOT_ENABLED_AND_NOT_DATA_LOADED`);
        } else if (checkResult.isEnabled && !checkResult.dataLoaded) {
            explanation = getLangString(`${Constants.MOD_NAMESPACE}_EXPANSION_MISMATCH_MODAL_AS_IS_EXPLANATION_ENABLED_BUT_NOT_DATA_LOADED`);
        } else if (!checkResult.isEnabled && checkResult.dataLoaded) {
            explanation = getLangString(`${Constants.MOD_NAMESPACE}_EXPANSION_MISMATCH_MODAL_AS_IS_EXPLANATION_NOT_ENABLED_BUT_DATA_LOADED`);
        }

        let explanationColor = '' as '' | 'info' | 'success' | 'danger';

        switch (checkResult.saveSlotConfigToggleState) {
            case ExpansionToggleState.RequiredOn:
                explanationColor = checkResult.isEnabled && checkResult.dataLoaded
                    ? 'success'
                    : 'danger';
                break;
            case ExpansionToggleState.RequiredOff:
                explanationColor = !checkResult.isEnabled && !checkResult.dataLoaded
                    ? 'success'
                    : 'danger';
                break;
            case ExpansionToggleState.NoPreference:
                explanationColor = 'info';
                break;
            default:
                break; // throw exception, as likely mod bug, if reaches here?
        }

        const explanationClassAttribute = explanationColor != ''
            ? ` class="text-${explanationColor}"`
            : '';
        return `<li class="text-left mt-2"><span class="font-weight-bold">${expansionName}:</span> <span${explanationClassAttribute}">${explanation}</span></li>`;
    }
}