import { SaveSlotConfigurationManager } from "./SaveSlotConfigurationManager";
import { CloudManagerExpansionIdentifier } from "./models/CloudManagerExpansionIdentifier";
import { ExpansionToggleState } from "./models/ExpansionToggleState";
import { SaveSlotExpansionCheckResults } from "./models/SaveSlotExpansionCheckResults";

/**
 * Set the account wide enablement toggle for an expansion
 * @param newState
 */
export function setExpansionToggle(expansion: CloudManagerExpansionIdentifier, newState: boolean): void {
    let currentState: boolean | undefined = undefined;
    switch (expansion) {
        case CloudManagerExpansionIdentifier.ThroneOfTheHerald:
            currentState = cloudManager.hasTotHEntitlementAndIsEnabled;
            break;
        case CloudManagerExpansionIdentifier.AtlasOfDiscovery:
            currentState = cloudManager.hasAoDEntitlementAndIsEnabled;
            break;
        case CloudManagerExpansionIdentifier.IntoTheAbyss:
            currentState = cloudManager.hasItAEntitlementAndIsEnabled;
            break;
        default:
            break;
    }

    if (currentState === undefined) {
        console.warn(`Failed to determine current toggle state for expansion ${expansion}. No change of toggles will take place`);
    } else {
        enforceExpansionToggle(expansion, currentState, newState);
    }

}

/**
 * Check, whether the given save slot's expansion configuration match with what's currently loaded
 * @param saveSlotId
 * @param isCloud
 */
export function computeExpansionValidityForSave(saveSlotId: number, isCloud: boolean): SaveSlotExpansionCheckResults {
    const config = SaveSlotConfigurationManager.getConfiguration(saveSlotId);

    const dataLoadedCheckResults = getDataLoadedExpansions();

    return {
        toth: {
            saveSlotConfigToggleState: config?.toth ?? ExpansionToggleState.NoPreference,
            isEnabled: cloudManager.hasTotHEntitlementAndIsEnabled,
            dataLoaded: dataLoadedCheckResults.toth
        },
        aod: {
            saveSlotConfigToggleState: config?.aod ?? ExpansionToggleState.NoPreference,
            isEnabled: cloudManager.hasAoDEntitlementAndIsEnabled,
            dataLoaded: dataLoadedCheckResults.aod
        },
        ita: {
            saveSlotConfigToggleState: config?.ita ?? ExpansionToggleState.NoPreference,
            isEnabled: cloudManager.hasItAEntitlementAndIsEnabled,
            dataLoaded: dataLoadedCheckResults.ita
        }
    }
}

/**
 * Get info on which expansions had their data loaded (cloud manager can be changed after data is in a loaded state!)
 * @returns
 */
function getDataLoadedExpansions(): { toth: boolean, aod: boolean, ita: boolean } {
    return {
        toth: game.registeredNamespaces.hasNamespace(Namespaces.Throne),
        aod: game.registeredNamespaces.hasNamespace(Namespaces.AtlasOfDiscovery),
        ita: game.registeredNamespaces.hasNamespace(Namespaces.IntoTheAbyss),
    };
}

/**
 * Set toggle, based on knowijnhg
 * @param expansion
 * @param newState
 */
function enforceExpansionToggle(expansion: CloudManagerExpansionIdentifier, oldState: boolean, newState: boolean): void {
    console.log([expansion, oldState, newState]);
    if (oldState !== newState) {
        cloudManager.toggleExpansionLoading(expansion);
    }
}