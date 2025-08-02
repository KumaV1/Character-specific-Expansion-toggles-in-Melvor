import { SaveSlotExpansionToggleStates } from "./SaveSlotExpansionToggleStates";

/**
 * Configuration for a save slot. Note that all properties are optional,
 * to represent no change ever having been made to an expansion (e.g. never toggled, or not owning expansion)
 */
export type SaveSlotExpansionConfiguration = Partial<SaveSlotExpansionToggleStates>;