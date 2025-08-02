export const it = {
    EXPANSION_TOGGLES_OPEN_BUTTON: 'Configure enabled expansions',

    EXPANSION_TOGGLE_STATE_requiredOn: 'Active',
    EXPANSION_TOGGLE_STATE_requiredOff: 'Inactive',
    EXPANSION_TOGGLE_STATE_noPreference: 'No preference',

    EXPANSION_CONFIGURATION_MODAL_TITLE: 'Configure expansion requirements',
    EXPANSION_CONFIGURATION_MODAL_CONFIRMATION_BUTTON: 'Save',
    EXPANSION_CONFIGURATION_MODAL_DENY_BUTTON: 'Cancel',
    EXPANSION_CONFIGURATION_MODAL_CONFIRMATION: 'Expansion requirements successfully updated',

    EXPANSION_MISMATCH_MODAL_TITLE: 'Expansion Mismatch',
    EXPANSION_MISMATCH_MODAL_CONFIRMATION_BUTTON: 'Adjust toggles',
    EXPANSION_MISMATCH_MODAL_DENY_BUTTON: 'Cancel',
    EXPANSION_MISMATCH_MODAL_PARAGRAPH_1: 'The currently configured expansions do not match the expansions currently toggled on/having their data gotten loaded.',
    EXPANSION_MISMATCH_MODAL_PARAGRAPH_2: 'Do you want to reload the game with the desired configuration? If you want to load into your save with the current expansions, then please cancel and adjust the expansion settings for the save slot.',
    EXPANSION_MISMATCH_MODAL_PARAGRAPH_3: 'There will be a forced 5s delay before reloading the game. Reason being, that changes to the toggles have to be synced via network requests, which unfortunately cannot be awaited (5s should usually be enough time for the requests to finish). NOTE: This may or may not be relevant anymore, upon release of the offline client.',
    EXPANSION_MISMATCH_MODAL_DESIRED_CONFIGURATION_HEADLINE: 'Desired configuration',
    EXPANSION_MISMATCH_MODAL_AS_IS_HEADLINE: 'Current state',
    EXPANSION_MISMATCH_MODAL_AS_IS_EXPLANATION_ENABLED_AND_DATA_LOADED: 'Active and data has been loaded',
    EXPANSION_MISMATCH_MODAL_AS_IS_EXPLANATION_NOT_ENABLED_AND_NOT_DATA_LOADED: 'Inactive and data has not been loaded',
    EXPANSION_MISMATCH_MODAL_AS_IS_EXPLANATION_ENABLED_BUT_NOT_DATA_LOADED: 'Active, but data has not been loaded (changed settings after reaching character selection)',
    EXPANSION_MISMATCH_MODAL_AS_IS_EXPLANATION_NOT_ENABLED_BUT_DATA_LOADED: 'Inactive, but data has been loaded (changed settings after reaching character selection)',
};