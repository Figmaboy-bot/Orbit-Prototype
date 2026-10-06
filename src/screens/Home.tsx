import { useState } from 'react';
import { Avatar, CurrencyFlag, MaskedFlag } from '../components/ui';
import type { Transaction } from '../data';
import { Icon, useAsset, useTheme } from '../theme';

const wallets = [
  { code: 'NGN', whole: '₦ 420,000', flag: <CurrencyFlag code="NGN" size={14} /> },
  { code: 'USD', whole: '$ 1,650', flag: <Icon name="flag-usd-14" size={14} /> },
  { code: 'EUR', whole: '€ 420,000', flag: <MaskedFlag prefix="flag-eur-14" size={14} /> },
  { code: 'NGN', whole: '₦ 420,000', flag: <CurrencyFlag code="NGN" size={14} /> },
] as const;

type Props = {
  transactions: Transaction[];
  onSend: () => void;
  onToast: (msg: string) => void;
};

export function Home({ transactions, onSend, onToast }: Props) {
  const theme = useTheme();
  const asset = useAsset();
  const [hidden, setHidden] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const soon = (what: string) => () => onToast(`${what} isn’t part of this prototype`);

  const actions = [
    { label: 'Top Up', icon: 'plus-circle', accent: true, onClick: soon('Top Up') },
    { label: 'Send', icon: 'arrow-line-up', onClick: onSend },
    { label: 'Convert', icon: 'arrows-cc', onClick: soon('Convert') },
    { label: 'More', icon: 'dots-three', onClick: soon('More') },
  ];

  return (
    <div className="screen home">
      <header className="home-header">
        <div className="home-user">
          <Avatar art="lina" bg={theme === 'dark' ? '#150433' : '#e1d0ff'} size={40} />
          <div className="home-greeting">
            <p className="home-hello">
              Welcome back, Sulaimon <span className="emoji">👋</span>,
            </p>
            <p className="home-tagline">Your money in motion</p>
          </div>
        </div>
        <button className="bell-button" onClick={soon('Notifications')} aria-label="Notifications">
          <Icon name="bell" size={24} inset="-8.33% 0 0 0" />
        </button>
      </header>

      <div className="home-body">
        <section className="home-top">
          <div className="balance-card">
            <div className="balance-pattern" aria-hidden>
              <div className="balance-pattern-art">
                <span className="icon-art" style={{ inset: '-0.26% -0.16%' }}>
                  <img alt="" src={asset('balance-pattern')} />
                </span>
              </div>
            </div>
            <div className="balance-content">
              <div className="balance-label-row">
                <span className="balance-label">Total Balance in</span>
                <button className="balance-currency" onClick={soon('Currency switching')}>
                  <span className="balance-currency-inner">
                    <CurrencyFlag code="NGN" size={14} />
                    <span>NGN</span>
                  </span>
                  <Icon name="caret-up-down" size={12} />
                </button>
              </div>
              <div className="balance-amount-row">
                <p className="balance-amount">
                  {hidden ? (
                    <span className="whole">₦ ••••••</span>
                  ) : (
                    <>
                      <span className="whole">₦ 2,470,220</span>
                      <span className="cents">.54</span>
                    </>
                  )}
                </p>
                <button className="icon-button" onClick={() => setHidden((h) => !h)} aria-label={hidden ? 'Show balance' : 'Hide balance'}>
                  <Icon name="eye-closed-balance" size={20} />
                </button>
              </div>
            </div>
          </div>

          <div className="quick-actions">
            {actions.map((a) => (
              <button key={a.label} className="quick-action" onClick={a.onClick}>
                <span className={`quick-action-pill ${a.accent ? 'accent' : ''}`}>
                  <Icon name={a.icon} size={24} />
                </span>
                <span className="quick-action-label">{a.label}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="home-section">
          <p className="section-label">Wallets</p>
          <div className="h-scroll wallets">
            {wallets.map((w, i) => (
              <div key={i} className="wallet-card">
                <div className="wallet-code">
                  {w.flag}
                  <span>{w.code}</span>
                </div>
                <p className="wallet-amount">
                  <span className="whole">{w.whole}</span>
                  <span className="cents">.00</span>
                </p>
              </div>
            ))}
          </div>
        </section>

        {showBanner && (
          <div className="invite-banner">
            <p className="invite-text">
              Earn <em>10 USDC</em> for every user
              <br />
              you invite!
            </p>
            <div className="invite-gift" aria-hidden>
              <div className="invite-gift-art">
                <Icon name="gift" size={[151.712, 124.463]} />
              </div>
            </div>
            <button className="invite-close" onClick={() => setShowBanner(false)} aria-label="Dismiss">
              <Icon name="banner-x" size={20} />
            </button>
          </div>
        )}

        <section className="home-section">
          <p className="section-label">Recent Transactions</p>
          <div className="tx-list">
            {transactions.map((tx) => (
              <div key={tx.id} className="tx-row">
                <TxIcon kind={tx.kind} />
                <div className="tx-text">
                  <div className="tx-main">
                    <p className="tx-title">{tx.title}</p>
                    <p className="tx-time">{tx.time}</p>
                  </div>
                  <p className={`tx-amount ${tx.positive ? 'positive' : 'negative'}`}>{tx.amount}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <nav className="bottom-nav">
        <button className="nav-item active" aria-current="page">
          <Icon name="nav-home" size={24} />
          <span>Home</span>
        </button>
        <button className="nav-item" onClick={soon('Cards')} aria-label="Cards">
          <Icon name="nav-card" size={24} />
        </button>
        <button className="nav-item" onClick={soon('Profile')} aria-label="Profile">
          <Icon name="nav-user" size={24} />
        </button>
      </nav>
    </div>
  );
}

function TxIcon({ kind }: { kind: Transaction['kind'] }) {
  const asset = useAsset();
  if (kind === 'convert') {
    return (
      <span className="tx-icon">
        <span className="tx-convert">
          <Icon name="tx-convert" size={24} />
        </span>
        <Icon name="tx-convert-flag-a" size={10} style={{ position: 'absolute', left: 32, top: 18 }} />
        <Icon name="tx-convert-flag-b" size={10} style={{ position: 'absolute', left: 6, top: 19 }} />
      </span>
    );
  }
  if (kind === 'swap') {
    return (
      <span className="tx-icon">
        <Icon name="arrows-left-right" size={24} className="tx-center" />
      </span>
    );
  }
  return (
    <span className="tx-icon">
      <span className="tx-arrow">
        <Icon name="tx-arrow-up" size={24} style={{ position: 'absolute', inset: 0 }} />
        <span className={`tx-arrow-vector ${kind === 'received' ? 'flipped' : ''}`}>
          <span className="icon-art" style={{ inset: '-4.35% -4.55%' }}>
            <img alt="" src={asset('tx-arrow-vector')} />
          </span>
        </span>
        {kind === 'received' && (
          <span className="tx-flag-usd">
            <Icon name="tx-flag-usd" size={[13.333, 10]} />
          </span>
        )}
        {kind === 'sent' && <MaskedFlag prefix="tx-flag-eur" size={10} style={{ position: 'absolute', right: 0, top: 0 }} />}
      </span>
    </span>
  );
}
