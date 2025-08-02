import { ExpansionToggleState } from "./ExpansionToggleState";

/**
 * An explicit definition of how the toggle states (be it config or actual) of each expansion are interpreted in a respective context.
 */
export type SaveSlotExpansionToggleStates = {
	toth: ExpansionToggleState,
	aod: ExpansionToggleState,
	ita: ExpansionToggleState
}