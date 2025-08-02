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
         * DEV NOTE: Type definition combines pre and post offline client!
         * @param expansion
         */
        toggleExpansionLoading(expansion: 0 | 1 | 2 | 'TotH' | 'AoD' | 'ItA'): void
    }

    const cloudManager: CloudManager;
}

export { };