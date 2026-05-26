import {
  APP_DESCRIPTION,
  APP_NAME,
  APP_THEME_COLOR,
} from './constants/app';

/** Apply branding to the live document (browser tab, meta tags). */
export function setupBranding(): void {
  document.title = APP_NAME;

  let descriptionMeta = document.querySelector('meta[name="description"]');
  if (!descriptionMeta) {
    descriptionMeta = document.createElement('meta');
    descriptionMeta.setAttribute('name', 'description');
    document.head.appendChild(descriptionMeta);
  }
  descriptionMeta.setAttribute('content', APP_DESCRIPTION);

  let themeMeta = document.querySelector('meta[name="theme-color"]');
  if (!themeMeta) {
    themeMeta = document.createElement('meta');
    themeMeta.setAttribute('name', 'theme-color');
    document.head.appendChild(themeMeta);
  }
  themeMeta.setAttribute('content', APP_THEME_COLOR);
}
