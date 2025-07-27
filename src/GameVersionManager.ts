/**
 * A manager determining certain game version states, which affect how the mod has to deal with some things
 */
export class GameVersionManager {
    public static isOfflineClientVersion: boolean;

    public static initialize() {
        // @ts-ignore: "isOffline" doesn't exist on type defintiion pre offline client
        const isOfflineFuncType = typeof mod.manager.isOffline;
        this.isOfflineClientVersion = isOfflineFuncType === 'function';
    }
}