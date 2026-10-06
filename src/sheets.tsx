import { useEffect, useRef, useState } from 'react';
import { InfoCard, PrimaryButton, Sheet, TextLink } from './components/ui';
import { formatMoney, type CurrencyCode, type Recipient } from './data';
import { Icon, useTheme } from './theme';

export function SendOptionsSheet({ onClose, onOrbitUser, onToast }: {
  onClose: () => void;
  onOrbitUser: () => void;
  onToast: (msg: string) => void;
}) {
  const options = [
    { title: 'Send to Orbit User', sub: 'Pay anyone using their @Orbit ID or phone.', icon: <Icon name="logo-icon" size={[29.899, 32]} />, onClick: onOrbitUser },
    { title: 'Send to Bank Account', sub: 'Transfer to any local or international bank.', icon: <Icon name="bank" size={32} />, onClick: () => onToast('Bank transfers aren’t part of this prototype') },
    { title: 'Send to Crypto Wallet', sub: 'Send USDC to any blockchain wallet.', icon: <Icon name="usdc-32" size={32} />, onClick: () => onToast('Crypto transfers aren’t part of this prototype') },
  ];
  return (
    <Sheet title="Send" onClose={onClose} backdrop="home-scrim">
      <div className="send-options">
        {options.map((o) => (
          <button key={o.title} className="send-option" onClick={o.onClick}>
            <span className="send-option-icon">{o.icon}</span>
            <span className="send-option-text">
              <span className="send-option-title">{o.title}</span>
              <span className="send-option-sub">{o.sub}</span>
            </span>
          </button>
        ))}
      </div>
    </Sheet>
  );
}

export function ConfirmSheet({ recipient, currency, amount, onClose, onSend }: {
  recipient: Recipient;
  currency: CurrencyCode;
  amount: number;
  onClose: () => void;
  onSend: () => void;
}) {
  const theme = useTheme();
  const money = formatMoney(currency, amount);
  return (
    <Sheet title="Transfer Confirmation" onClose={onClose}>
      <div className="confirm-body">
        <InfoCard rows={[{ label: 'Sending:', value: money, strong: true }, { label: 'To:', value: recipient.handle }]} />
        <InfoCard rows={[{ label: 'Recipient gets:', value: money, strong: true }, { label: 'Fee:', value: formatMoney(currency, 0) }]} />
        <InfoCard rows={[{ label: 'From Wallet:', value: `${currency} Wallet` }]} />
        <TextLink icon={theme === 'light' ? 'pencil' : undefined} onClick={onClose}>
          Edit
        </TextLink>
      </div>
      <PrimaryButton onClick={onSend}>Send Funds</PrimaryButton>
    </Sheet>
  );
}

const PIN_LENGTH = 6;

export function PinSheet({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) {
  const [pin, setPin] = useState('');
  const [reveal, setReveal] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => input.current?.focus(), []);

  const biometric = () => {
    setVerifying(true);
    setTimeout(onConfirm, 900);
  };

  return (
    <Sheet title="Transfer Confirmation" onClose={onClose}>
      <div className="pin-body">
        <div className="pin-top">
          <div className="pin-intro">
            <div className="pin-heading">
              <Icon name="lock-key" size={40} />
              <div className="pin-copy">
                <p className="pin-title">{verifying ? 'Verifying…' : 'Enter your PIN'}</p>
                <p className="pin-desc">For your security, confirm this action with your 6-digit PIN.</p>
              </div>
            </div>
            <div className="pin-row">
              <label className="pin-boxes" onClick={() => input.current?.focus()}>
                <input
                  ref={input}
                  className="pin-input"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={PIN_LENGTH}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, PIN_LENGTH))}
                  onKeyDown={(e) => e.key === 'Enter' && pin.length === PIN_LENGTH && onConfirm()}
                  aria-label="6-digit PIN"
                />
                {Array.from({ length: PIN_LENGTH }, (_, i) => (
                  <span key={i} className={`pin-box ${i < pin.length ? 'filled' : ''} ${i === pin.length ? 'current' : ''}`}>
                    {i < pin.length ? (reveal ? pin[i] : '•') : '_'}
                  </span>
                ))}
              </label>
              <button className="icon-button" onClick={() => setReveal((r) => !r)} aria-label={reveal ? 'Hide PIN' : 'Show PIN'}>
                <Icon name="eye-closed-pin" size={20} />
              </button>
            </div>
          </div>
          <TextLink icon="scan-smiley" onClick={biometric}>
            Use biometric instead
          </TextLink>
        </div>
        <div className="pin-actions">
          <PrimaryButton onClick={onConfirm} disabled={pin.length < PIN_LENGTH || verifying}>
            Confirm
          </PrimaryButton>
          <p className="forgot-pin">
            Forgot Pin?{' '}
            <button className="inline-link" onClick={() => { setPin(''); input.current?.focus(); }}>
              Reset
            </button>
          </p>
        </div>
      </div>
    </Sheet>
  );
}

export function SuccessSheet({ recipient, currency, amount, onClose, onDetails }: {
  recipient: Recipient;
  currency: CurrencyCode;
  amount: number;
  onClose: () => void;
  onDetails: () => void;
}) {
  return (
    <Sheet title="Transfer Confirmation" onClose={onClose} gap={24}>
      <div className="success-hero">
        <Icon name="seal-check" size={64} />
        <div className="success-text">
          <p className="success-title">Transaction Successful</p>
          <p className="success-sub">Your transfer to {recipient.handle} has been completed.</p>
        </div>
      </div>
      <InfoCard rows={[{ label: 'Amount Sent:', value: formatMoney(currency, amount), strong: true }]} />
      <div className="success-actions">
        <PrimaryButton onClick={onDetails}>View Details</PrimaryButton>
        <button className="inline-link done-link" onClick={onClose}>
          Done
        </button>
      </div>
    </Sheet>
  );
}
