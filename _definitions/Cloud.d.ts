declare global {
    interface CloudManager {
        hasTotHEntitlement: boolean;
        hasTotHEntitlementAndIsEnabled: boolean;
        hasAoDEntitlement: boolean;
        hasAoDEntitlementAndIsEnabled: boolean;
        hasItAEntitlement: boolean;
        hasItAEntitlementAndIsEnabled: boolean;

        /**
         * Toggles the given expansion
         * @param expansion
         */
        toggleExpansionLoading(expansion: 'TotH' | 'AoD' | 'ItA'): void
    }

    const cloudManager: CloudManager;
}

export { };