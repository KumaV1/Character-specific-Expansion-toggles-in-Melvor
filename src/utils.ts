import { GameVersionManager } from "./GameVersionManager";
import { SaveSlotConfigurationManager } from "./SaveSlotConfigurationManager";
import { CloudManagerExpansionIdentifier } from "./models/CloudManagerExpansionIdentifier";
import { ExpansionToggleState } from "./models/ExpansionToggleState";
import { SaveSlotExpansionCheckResults } from "./models/SaveSlotExpansionCheckResults";

/**
 * Set the account wide enablement toggle for an expansion
 * @param newState
 */
export async function setExpansionToggle(expansion: CloudManagerExpansionIdentifier, newState: boolean): Promise<void> {
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
        await enforceExpansionToggle(expansion, currentState, newState);
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
async function enforceExpansionToggle(expansion: CloudManagerExpansionIdentifier, oldState: boolean, newState: boolean): Promise<void> {
    let expansionParsed = undefined as undefined | 0 | 1 | 2 | 'TotH' | 'AoD' | 'ItA';
    switch (expansion) {
        case CloudManagerExpansionIdentifier.ThroneOfTheHerald:
            expansionParsed = GameVersionManager.isOfflineClientVersion
                ? 'TotH'
                : 0;
            break;
        case CloudManagerExpansionIdentifier.AtlasOfDiscovery:
            expansionParsed = GameVersionManager.isOfflineClientVersion
                ? 'AoD'
                : 1;
            break;
        case CloudManagerExpansionIdentifier.IntoTheAbyss:
            expansionParsed = GameVersionManager.isOfflineClientVersion
                ? 'ItA'
                : 2;
            break;
        default: // TODO: Possibly throw exception, as presumably a bug of this mod, if reaching here?
            break;
    }
    if (expansionParsed === undefined) {
        console.warn(`Failed to parse expansion ${expansion} to cloud manager identifier. No change of toggles will take place`);
        return;
    }

    //console.log([expansion, oldState, newState]);
    if (oldState !== newState) {
        await cloudManager.toggleExpansionLoading(expansionParsed);
        console.log('State after "await cloudManager.toggleExpansionLoading(expansion)"');
        console.log([expansionParsed, oldState, newState]);
    }
}