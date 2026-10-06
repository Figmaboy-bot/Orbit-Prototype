import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { StatusBar } from './components/ui';
import {
  formatMoney,
  initialTransactions,
  recipients,
  type CurrencyCode,
  type Recipient,
  type Transaction,
  type Transfer,
} from './data';
import { Amount } from './screens/Amount';
import { Details } from './screens/Details';
import { Home } from './screens/Home';
import { Recipients } from './screens/Recipients';
import { isNative, syncNativeStatusBar } from './platform';
import { ConfirmSheet, PinSheet, SendOptionsSheet, SuccessSheet } from './sheets';
import { ThemeContext, type Theme } from './theme';

type Screen = 'home' | 'recipients' | 'amount' | 'details';
type SheetName = 'send' | 'confirm' | 'pin' | 'success' | null;

const PHONE_W = 430;
const PHONE_H = 932;

const systemTheme = (): Theme => (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

function initialTheme(): Theme {
  // The installed app follows the phone's appearance setting.
  if (isNative) return systemTheme();
  try {
    const saved = localStorage.getItem('orbit-theme');
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {
    /* storage unavailable */
  }
  return systemTheme();
}

function nowStamp() {
  const t = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  return `Today · ${t}`;
}

export default function App() {
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const [screen, setScreen] = useState<Screen>('home');
  const [sheet, setSheet] = useState<SheetName>(null);
  const [recipient, setRecipient] = useState<Recipient>(recipients.lina);
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [transfer, setTransfer] = useState<Transfer | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [toast, setToast] = useState<string | null>(null);
  const scale = usePhoneScale();

  useEffect(() => {
    if (!isNative) return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => setTheme(systemTheme());
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    syncNativeStatusBar(theme);
    if (isNative) return;
    try {
      localStorage.setItem('orbit-theme', theme);
    } catch {
      /* storage unavailable */
    }
  }, [theme]);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(id);
  }, [toast]);

  const value = parseFloat(amount) || 0;

  const pickRecipient = (r: Recipient) => {
    setRecipient(r);
    setCurrency(r.currency);
    setScreen('amount');
  };

  const completeTransfer = () => {
    const done: Transfer = { recipient, currency, amount: value, message: message.trim(), timestamp: nowStamp() };
    setTransfer(done);
    setTransactions((txs) => [
      {
        id: `t${Date.now()}`,
        kind: 'sent-new',
        title: `Transfer Sent  ${recipient.handle}`,
        time: done.timestamp,
        amount: `-${formatMoney(currency, value)}`,
        positive: false,
      },
      ...txs,
    ]);
    setSheet('success');
  };

  const finish = (next: Screen) => {
    setSheet(null);
    setAmount('');
    setMessage('');
    setScreen(next);
  };

  return (
    <ThemeContext.Provider value={theme}>
      <div className="stage">
        <div className="phone-slot" style={{ width: PHONE_W * scale, height: PHONE_H * scale }}>
          <div className="phone" style={{ transform: scale === 1 ? undefined : `scale(${scale})` }}>
            <div key={screen} className="screen-layer">
              {screen === 'home' && <Home transactions={transactions} onSend={() => setSheet('send')} onToast={setToast} />}
              {screen === 'recipients' && <Recipients onBack={() => setScreen('home')} onPick={pickRecipient} />}
              {screen === 'amount' && (
                <Amount
                  recipient={recipient}
                  currency={currency}
                  amount={amount}
                  message={message}
                  onCurrency={setCurrency}
                  onAmount={setAmount}
                  onMessage={setMessage}
                  onChangeRecipient={() => setScreen('recipients')}
                  onBack={() => setScreen('recipients')}
                  onContinue={() => setSheet('confirm')}
                />
              )}
              {screen === 'details' && transfer && (
                <Details transfer={transfer} onBack={() => setScreen('home')} onToast={setToast} />
              )}
            </div>

            <StatusBar />
            <div className={`home-indicator ${screen === 'home' ? 'on-home' : ''}`}>
              <span />
            </div>

            {sheet === 'send' && (
              <SendOptionsSheet
                onClose={() => setSheet(null)}
                onOrbitUser={() => {
                  setSheet(null);
                  setScreen('recipients');
                }}
                onToast={setToast}
              />
            )}
            {sheet === 'confirm' && (
              <ConfirmSheet
                recipient={recipient}
                currency={currency}
                amount={value}
                onClose={() => setSheet(null)}
                onSend={() => setSheet('pin')}
              />
            )}
            {sheet === 'pin' && <PinSheet onClose={() => setSheet(null)} onConfirm={completeTransfer} />}
            {sheet === 'success' && transfer && (
              <SuccessSheet
                recipient={transfer.recipient}
                currency={transfer.currency}
                amount={transfer.amount}
                onClose={() => finish('home')}
                onDetails={() => finish('details')}
              />
            )}

            {toast && (
              <div className="toast" role="status">
                {toast}
              </div>
            )}
          </div>
        </div>

        {!isNative && (
          <button
            className="theme-toggle"
            onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            <span className="theme-toggle-dot" />
            <span className="theme-toggle-label">{theme === 'light' ? 'Dark mode' : 'Light mode'}</span>
          </button>
        )}
      </div>
    </ThemeContext.Provider>
  );
}

/** Scales the 430×932 phone down to fit short desktop windows; phones get full-bleed via CSS. */
function usePhoneScale() {
  const [scale, setScale] = useState(1);
  const frame = useRef(0);
  useLayoutEffect(() => {
    const update = () => {
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        if (isNative || window.innerWidth <= 500) return setScale(1);
        setScale(Math.min(1, (window.innerHeight - 48) / PHONE_H, (window.innerWidth - 32) / PHONE_W));
      });
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return scale;
}
