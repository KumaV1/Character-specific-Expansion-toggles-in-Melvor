import '../assets/Logo.png'
import { CharacterSelectionUiManager } from './CharacterSelectionUiManager';
import { GameVersionManager } from './GameVersionManager';
import { SaveSlotConfigurationManager } from './SaveSlotConfigurationManager';
import { TranslationManager } from './translation/TranslationManager';

export async function setup(ctx: Modding.ModContext) {
    TranslationManager.register();
    GameVersionManager.initialize();
    SaveSlotConfigurationManager.initialize(ctx);
    CharacterSelectionUiManager.patch(ctx);

    ctx.api({
        getIsOfflineClientVersion: () => GameVersionManager.isOfflineClientVersion,
        getAllCurrentConfigurations: () => SaveSlotConfigurationManager.getAllCurrentConfigurations(),
        getAccountStorage: () => SaveSlotConfigurationManager.getAccountStorage()
    });
}