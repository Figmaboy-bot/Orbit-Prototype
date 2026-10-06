# Orbit — Send to Orbit User prototype

A clickable prototype of the Orbit "Send to Orbit User" flow, built from the Orbit Figma file
(light frames `670:*`, dark frames `170:*`). Works with a light/dark toggle.

## Flow

1. **Home** → tap **Send** → Send sheet → **Send to Orbit User**
2. **Recipients**: search, or pick a favorite or recent recipient
3. **Amount**: choose a currency, enter an amount, add a message → **Continue**
4. **Transfer Confirmation** → **Send Funds**
5. **Enter your PIN**: any 6 digits, or **Use biometric instead**
6. **Transaction Successful** → **View Details** (or **Done** to go back Home)
7. **Transaction Details**: back returns Home, where the new transfer is at the top of Recent Transactions

Other buttons (Top Up, Convert, bank/crypto transfers, and so on) show a "not part of this prototype" toast.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # static build in dist/ (relative paths, so it can be hosted anywhere)
```

On desktop the phone frame scales to fit the window; at 500px wide or less it goes full-screen.

## Assets

All icons, flags and avatar layers are the original SVGs exported from Figma, in `public/assets`.
`scripts/download-assets.mjs` fetches them again from `scripts/assets-manifest.mjs`. Figma MCP
asset links expire after 7 days, so regenerate the manifest before re-running it.
