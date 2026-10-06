import { createContext, useContext, type CSSProperties } from 'react';

export type Theme = 'light' | 'dark';

export const ThemeContext = createContext<Theme>('light');
export const useTheme = () => useContext(ThemeContext);

// Icons that have no dark variant in the Figma file reuse the light art.
const lightOnly = new Set(['flag-usd-20', 'pencil']);

export function assetUrl(name: string, theme: Theme) {
  const dark = theme === 'dark' && !lightOnly.has(name) ? '.dark' : '';
  return `${import.meta.env.BASE_URL}assets/${name}${dark}.svg`;
}

export function useAsset() {
  const theme = useTheme();
  return (name: string) => assetUrl(name, theme);
}

type IconProps = {
  name: string;
  size: number | [number, number];
  /** Inset of the image inside its box, for art that bleeds past its frame. */
  inset?: string;
  className?: string;
  style?: CSSProperties;
};

export function Icon({ name, size, inset, className, style }: IconProps) {
  const asset = useAsset();
  const [w, h] = Array.isArray(size) ? size : [size, size];
  return (
    <span className={`icon ${className ?? ''}`} style={{ width: w, height: h, ...style }} aria-hidden>
      <span className="icon-art" style={inset ? { inset } : undefined}>
        <img alt="" src={asset(name)} />
      </span>
    </span>
  );
}
