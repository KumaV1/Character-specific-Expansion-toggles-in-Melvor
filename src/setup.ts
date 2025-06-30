import '../assets/Logo.png'
import { CharacterSelectionUiManager } from './CharacterSelectionUiManager';
import { TranslationManager } from './translation/TranslationManager';

export async function setup(ctx: Modding.ModContext) {
    TranslationManager.register();
    CharacterSelectionUiManager.patch(ctx);
}