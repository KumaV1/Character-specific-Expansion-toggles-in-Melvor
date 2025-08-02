import { ExpansionToggleState } from "./ExpansionToggleState";

/**
 * Check result for a specific expansion
 */
export interface SaveSlotExpansionCheckResult {
    [x: string]: any;
    /**
     * Which toggle state the user configured to be desired for the save slot
     */
    saveSlotConfigToggleState: ExpansionToggleState,

    /**
     * Whether the expansion is currently enabled on the cloud manager
     */
    isEnabled: boolean,

    /**
     * Whether data for the expansion is currently loaded
     */
    dataLoaded: boolean    
}