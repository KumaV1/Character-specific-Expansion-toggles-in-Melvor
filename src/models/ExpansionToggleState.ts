export enum ExpansionToggleState {
    /** The expansion must be enabled */
    RequiredOn = "requiredOn",

    /** The expansion must not be enabled */
    RequiredOff = "requiredOff",

    /** It doesn't matter whether the expansion is enabled */
    NoPreference = "noPreference"
}