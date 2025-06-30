import '../assets/Logo.png'
import { CharacterSelectionUiManager } from './CharacterSelectionUiManager';
import { SaveSlotConfigurationManager } from './SaveSlotConfigurationManager';
import { TranslationManager } from './translation/TranslationManager';

export async function setup(ctx: Modding.ModContext) {
    TranslationManager.register();
    SaveSlotConfigurationManager.initialize(ctx);
    CharacterSelectionUiManager.patch(ctx);
}