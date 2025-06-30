import { ExpansionToggleState } from "./ExpansionToggleState";

/**
 * Configuration for a save slot. Note that all properties are optional,
 * to represent no change ever having been made to an expansion (e.g. never toggled, or not owning expansion)
 */
export interface SaveSlotExpansionConfiguration {
	toth?: ExpansionToggleState,
	aod?: ExpansionToggleState,
	ita?: ExpansionToggleState
}