/**
 * App branding — imported from the single source of truth.
 * To rename the app, edit ONLY: src/config/branding.json
 * Then run: npm run sync-branding (or npm start / npm run build — runs automatically)
 */
import branding from '../config/branding.json';

export type BrandingConfig = typeof branding;

export const APP_NAME = branding.appName;
export const APP_SHORT_NAME = branding.appShortName;
export const APP_TAGLINE = branding.appTagline;
export const APP_DESCRIPTION = branding.appDescription;
export const APP_PACKAGE_NAME = branding.packageName;
export const APP_THEME_COLOR = branding.themeColor;
export const APP_BACKGROUND_COLOR = branding.backgroundColor;

/** Default export for tooling/scripts that read branding. */
export default branding;
