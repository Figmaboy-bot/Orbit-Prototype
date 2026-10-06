import { Avatar, CurrencyFlag, PrimaryButton, ScreenHeader } from '../components/ui';
import { currencies, symbolFor, type CurrencyCode, type Recipient } from '../data';
import { Icon } from '../theme';

type Props = {
  recipient: Recipient;
  currency: CurrencyCode;
  amount: string;
  message: string;
  onCurrency: (c: CurrencyCode) => void;
  onAmount: (v: string) => void;
  onMessage: (v: string) => void;
  onChangeRecipient: () => void;
  onBack: () => void;
  onContinue: () => void;
};

/** Keeps the field to digits with at most one point and two decimals. */
function sanitize(raw: string) {
  const cleaned = raw.replace(/[^\d.]/g, '');
  const [whole, ...rest] = cleaned.split('.');
  const wholeTrimmed = whole.replace(/^0+(?=\d)/, '');
  return rest.length ? `${wholeTrimmed || '0'}.${rest.join('').slice(0, 2)}` : wholeTrimmed;
}

export function Amount(p: Props) {
  const symbol = symbolFor(p.currency);
  const value = parseFloat(p.amount) || 0;

  return (
    <div className="screen">
      <ScreenHeader title="Send" onBack={p.onBack} />
      <div className="screen-body amount">
        <section className="panel">
          <p className="panel-label">Send to</p>
          <div className="send-to-row">
            <div className="send-to-person">
              <Avatar art={p.recipient.art} bg={p.recipient.bg} size={64} />
              <div className="send-to-text">
                <p className="send-to-name">{p.recipient.name}</p>
                <p className="send-to-handle">{p.recipient.handle}</p>
              </div>
            </div>
            <button className="pill-button" onClick={p.onChangeRecipient}>
              Change
            </button>
          </div>
        </section>

        <section className="panel">
          <p className="panel-label">Select Currency</p>
          <div className="currency-chips" role="radiogroup" aria-label="Currency">
            {currencies.map((c) => (
              <button
                key={c.code}
                role="radio"
                aria-checked={c.code === p.currency}
                className={`currency-chip ${c.code === p.currency ? 'active' : ''}`}
                onClick={() => p.onCurrency(c.code)}
              >
                <CurrencyFlag code={c.code} size={20} />
                <span>{c.code}</span>
              </button>
            ))}
          </div>
          <label className={`amount-field ${p.amount ? 'filled' : ''}`}>
            <span className="amount-symbol">{symbol} </span>
            <input
              inputMode="decimal"
              placeholder="0.00"
              value={p.amount}
              onChange={(e) => p.onAmount(sanitize(e.target.value))}
              aria-label="Amount"
              autoFocus
            />
          </label>
          <label className="message-field">
            <input
              placeholder="Add a message (e.g., “Thanks!”)"
              value={p.message}
              maxLength={80}
              onChange={(e) => p.onMessage(e.target.value)}
            />
            <Icon name="smiley" size={20} />
          </label>
        </section>

        <section className="info-card fees-card">
          <div className="info-row">
            <span className="info-label">Fees:</span>
            <span className="info-value">{symbol} 0.00</span>
          </div>
          <div className="info-row">
            <span className="info-label">Transaction Duration:</span>
            <span className="info-value">Instant</span>
          </div>
        </section>
      </div>

      <div className="bottom-cta">
        <PrimaryButton onClick={p.onContinue} disabled={value <= 0}>
          Continue
        </PrimaryButton>
      </div>
    </div>
  );
}
