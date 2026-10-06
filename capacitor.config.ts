import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.orbit.prototype',
  appName: 'Orbit',
  webDir: 'dist',
  backgroundColor: '#f8f8f8',
  ios: {
    // Screens scroll inside the app; stop the whole web view from rubber-banding.
    scrollEnabled: false,
    // Draw edge to edge; the CSS uses safe-area insets instead.
    contentInset: 'never',
  },
  plugins: {
    StatusBar: { overlaysWebView: true },
  },
};

export default config;
