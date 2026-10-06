import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import type { Theme } from './theme';

/** True inside the Capacitor iOS/Android shell, false in a browser. */
export const isNative = Capacitor.isNativePlatform();

export function syncNativeStatusBar(theme: Theme) {
  if (!isNative) return;
  // Style.Dark = light text, for dark backgrounds.
  StatusBar.setStyle({ style: theme === 'dark' ? Style.Dark : Style.Light }).catch(() => {});
}
