/**
 * Identifiers for the expansions when communicating with the cloud manager.
 * IMPORTANT: Offline client changes the expansion identifiers to strings, 
 * which is why working with this enum should utilize "GameVersionManager.isOfflineClientVersion" to determine the actual value to use!
 */
export enum CloudManagerExpansionIdentifier {
    ThroneOfTheHerald = 'TotH',

    AtlasOfDiscovery = 'AoD',

    IntoTheAbyss = 'ItA'
}