import { Constants } from "./Constants";
import { SaveSlotExpansionConfiguration } from "./models/SaveSlotExpansionConfiguration";

/**
 * Manages work with the settings (the expansion toggles)
 */
export class SaveSlotConfigurationManager {
    private static _ctx: Modding.ModContext;

    /** 
     * Current set of configurations, while the game is running.
     * Key is save slot number, value is the respective config
     */
    private static _currentConfigurations: Map<number, SaveSlotExpansionConfiguration>;

    /** Initialize on game start */
    public static initialize(ctx: Modding.ModContext) {
        SaveSlotConfigurationManager._ctx = ctx;

        // Get configs in storage
        const configsInStorage: { [key: number]: SaveSlotExpansionConfiguration } = ctx.accountStorage.getItem(Constants.STORAGE_KEY_SAVE_SLOT_EXPANSION_CONFIGS) ?? new Map();
        console.log('Config extraced from account storage while loading:');
        console.log(configsInStorage);

        // Set up config collection used while the game is running
        SaveSlotConfigurationManager._currentConfigurations = new Map();
        for (let i = 0; i < maxSaveSlots; i++) {
            const configInStorage: SaveSlotExpansionConfiguration | undefined = configsInStorage[i];
            if (configInStorage !== undefined) {
                SaveSlotConfigurationManager._currentConfigurations.set(i, configInStorage);
            }
        }

        console.log('Current configuration set up from storage data:');
        console.log(SaveSlotConfigurationManager._currentConfigurations);
    }

    /**
     * Writes the current state of @see {@link _currentConfigurations} into account storage
     */
    public static updateAccountStorage() {
        let newConfigs = {} as { [key: number]: SaveSlotExpansionConfiguration };
        SaveSlotConfigurationManager._currentConfigurations.forEach((value: SaveSlotExpansionConfiguration, key: number) => {
            newConfigs[key] = value;
        });

        console.log(newConfigs);
        this._ctx.accountStorage.setItem(Constants.STORAGE_KEY_SAVE_SLOT_EXPANSION_CONFIGS, newConfigs);
        console.log(this._ctx.accountStorage.getItem(Constants.STORAGE_KEY_SAVE_SLOT_EXPANSION_CONFIGS));
    }

    /**
     * Try get configuration for save slot
     * @param slotId
     * @returns
     */
    public static getConfiguration(slotId: number): SaveSlotExpansionConfiguration | undefined {
        return SaveSlotConfigurationManager._currentConfigurations.get(slotId);
    }

    /**
     * Updates the corresponding config entry. This does NOT save said info to storage, though
     * @param slotId
     * @param config
     */
    public static updateConfiguration(slotId: number, config: SaveSlotExpansionConfiguration) {
        SaveSlotConfigurationManager._currentConfigurations.set(slotId, config);
        console.log(SaveSlotConfigurationManager._currentConfigurations);
    }

    public static getAllCurrentConfigurations(): Map<number, SaveSlotExpansionConfiguration> {
        return SaveSlotConfigurationManager._currentConfigurations;
    }

    public static getAccountStorage(): Map<number, SaveSlotExpansionConfiguration> {
        return this._ctx.accountStorage.getItem(Constants.STORAGE_KEY_SAVE_SLOT_EXPANSION_CONFIGS);
    }
}