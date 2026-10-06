import type { CSSProperties, ReactNode } from 'react';
import { avatarLayers, type AvatarArt } from '../data/avatars';
import type { CurrencyCode } from '../data';
import { Icon, useAsset } from '../theme';

export function Avatar({ art, bg, size }: { art: AvatarArt; bg: string; size: number }) {
  const base = `${import.meta.env.BASE_URL}assets/avatars/${art}`;
  return (
    <span className="avatar" style={{ width: size, height: size, background: bg }} aria-hidden>
      {avatarLayers[art].map(([box, art_inset], i) => (
        <span key={i} className="avatar-layer" style={{ inset: box }}>
          <span className="icon-art" style={art_inset ? { inset: art_inset } : undefined}>
            <img alt="" src={`${base}/${i}.svg`} />
          </span>
        </span>
      ))}
    </span>
  );
}

/**
 * The EUR flag is built in Figma from a base disc plus a luminance-masked
 * union-jack layer; `prefix` picks the asset set for the size it was drawn at.
 */
export function MaskedFlag({ prefix, size, style }: { prefix: string; size: number; style?: CSSProperties }) {
  const asset = useAsset();
  const mask = `url("${asset(`${prefix}-mask`)}")`;
  return (
    <span className="masked-flag" style={{ width: size, height: size, ...style }} aria-hidden>
      <img alt="" src={asset(`${prefix}-base`)} style={{ position: 'absolute', inset: '0.02% -16.65% 0 -16.67%' }} />
      <span
        className="masked-flag-cross"
        style={{
          maskImage: mask,
          WebkitMaskImage: mask,
          maskSize: `${size * 1.3332}px ${size * 0.99985}px`,
          WebkitMaskSize: `${size * 1.3332}px ${size * 0.99985}px`,
          maskPosition: `${size * 0.17636}px ${size * 0.09093}px`,
          WebkitMaskPosition: `${size * 0.17636}px ${size * 0.09093}px`,
        }}
      >
        <img alt="" src={asset(`${prefix}-cross`)} />
      </span>
    </span>
  );
}

export function CurrencyFlag({ code, size }: { code: CurrencyCode; size: 14 | 20 }) {
  if (code === 'EUR') return <MaskedFlag prefix={`flag-eur-${size}`} size={size} />;
  if (code === 'USDT') return <Icon name={size === 20 ? 'usdc-20' : 'usdc-32'} size={size} />;
  return <Icon name={`flag-${code.toLowerCase()}-${size}`} size={size} />;
}

export function StatusBar() {
  return (
    <div className="status-bar">
      <div className="status-left">
        <span className="status-time">9:41</span>
      </div>
      <div className="status-island" />
      <div className="status-right">
        <Icon name="statusbar" size={[85.782, 14.224]} inset="-4.63% -0.53% 0 0" />
      </div>
    </div>
  );
}

export function ScreenHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <header className="screen-header">
      <button className="icon-button back-button" onClick={onBack} aria-label="Back">
        <Icon name="arrow-left" size={24} />
      </button>
      <h1 className="screen-title">{title}</h1>
    </header>
  );
}

export function CloseButton({ onClick, className }: { onClick: () => void; className?: string }) {
  return (
    <button className={`close-button ${className ?? ''}`} onClick={onClick} aria-label="Close">
      <Icon name="x" size={20} />
    </button>
  );
}

export function Sheet({
  title,
  onClose,
  gap = 16,
  backdrop,
  children,
}: {
  title: string;
  onClose: () => void;
  gap?: number;
  /** Extra backdrop class; the Home "Send" sheet uses a dark scrim in both themes. */
  backdrop?: string;
  children: ReactNode;
}) {
  return (
    <div className={`sheet-backdrop ${backdrop ?? ''}`} onClick={onClose}>
      <div className="sheet" style={{ gap }} role="dialog" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <div className="sheet-header">
          <span className="close-button spacer" aria-hidden />
          <h2 className="sheet-title">{title}</h2>
          <CloseButton onClick={onClose} />
        </div>
        {children}
      </div>
    </div>
  );
}

export function PrimaryButton({
  children,
  onClick,
  disabled,
  className,
}: {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button className={`primary-button ${className ?? ''}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

/** Purple text link; light designs draw it with an icon and bottom rule. */
export function TextLink({ icon, children, onClick }: { icon?: string; children: ReactNode; onClick: () => void }) {
  return (
    <button className={`text-link ${icon ? 'with-icon' : ''}`} onClick={onClick}>
      {icon && <Icon name={icon} size={24} className="text-link-icon" />}
      <span>{children}</span>
    </button>
  );
}

export type Row = { label: string; value: string; strong?: boolean };

export function InfoCard({ rows, className }: { rows: Row[]; className?: string }) {
  return (
    <div className={`info-card ${className ?? ''}`}>
      {rows.map((r) => (
        <div key={r.label} className="info-row">
          <span className="info-label">{r.label}</span>
          <span className={`info-value ${r.strong ? 'strong' : ''}`}>{r.value}</span>
        </div>
      ))}
    </div>
  );
}
