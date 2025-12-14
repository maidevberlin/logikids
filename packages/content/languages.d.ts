/**
 * Supported languages - single source of truth
 * Add new languages here; check:translations will fail until translations exist
 *
 * When adding a new language:
 * 1. Add entry here with label, flag, and displayName
 * 2. Add translations in packages/frontend/public/locales/{lang}/
 * 3. Add TTS voice config in packages/backend/src/tts/service.ts (if TTS needed)
 */
export declare const LANGUAGES: {
    readonly de: {
        readonly label: "Deutsch";
        readonly countryCode: "DE";
        readonly displayName: "German";
    };
    readonly en: {
        readonly label: "English";
        readonly countryCode: "GB";
        readonly displayName: "English";
    };
};
export type Language = keyof typeof LANGUAGES;
export declare const SUPPORTED_LANGUAGES: [Language, ...Language[]];
export declare const DEFAULT_LANGUAGE: Language;
