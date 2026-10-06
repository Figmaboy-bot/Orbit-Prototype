import type { AvatarArt } from './avatars';

export type CurrencyCode = 'NGN' | 'USD' | 'EUR' | 'USDT';

export const currencies: { code: CurrencyCode; symbol: string }[] = [
  { code: 'NGN', symbol: '₦' },
  { code: 'USD', symbol: '$' },
  { code: 'EUR', symbol: '€' },
  { code: 'USDT', symbol: '$' },
];

export const symbolFor = (code: CurrencyCode) => currencies.find((c) => c.code === code)!.symbol;

export function formatMoney(code: CurrencyCode, value: number, { spaced = false } = {}) {
  const n = value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return `${symbolFor(code)}${spaced ? ' ' : ''}${n}`;
}

export type Recipient = {
  id: string;
  name: string;
  handle: string;
  art: AvatarArt;
  bg: string;
  currency: CurrencyCode;
};

const lilac = '#e1d0ff';
const blue = 'rgba(59, 78, 255, 0.2)';
const peach = '#ffe4cc';

export const recipients: Record<string, Recipient> = {
  lina: { id: 'lina', name: 'Lina Johnson', handle: '@lina.usd', art: 'lina', bg: lilac, currency: 'USD' },
  tomi: { id: 'tomi', name: 'Tomi Ogun', handle: '@tomi.ngn', art: 'tomi', bg: blue, currency: 'NGN' },
  sara: { id: 'sara', name: 'Sara Kim', handle: '@sara.eur', art: 'sara', bg: peach, currency: 'EUR' },
  jameslee: { id: 'jameslee', name: 'James Lee', handle: '@james.ui', art: 'lina', bg: lilac, currency: 'USD' },
  jamessmith: { id: 'jamessmith', name: 'James Smith', handle: '@james.smith', art: 'tomi', bg: blue, currency: 'USD' },
  emily: { id: 'emily', name: 'Emily Chen', handle: '@emily.chen', art: 'sara', bg: peach, currency: 'USD' },
  michael: { id: 'michael', name: 'Michael Brown', handle: '@michael.brown', art: 'michael', bg: '#d5f5e3', currency: 'USD' },
  sophia: {
    id: 'sophia',
    name: 'Sophia Garcia',
    handle: '@sophia.garcia',
    art: 'sophia',
    bg: 'linear-gradient(rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.7)), #ffce33',
    currency: 'USD',
  },
};

export const favoriteIds = ['lina', 'tomi', 'sara', 'jameslee'];
export const recentIds = ['lina', 'jamessmith', 'emily', 'michael', 'sophia'];

export type TxKind = 'convert' | 'received' | 'sent' | 'sent-new' | 'swap';

export type Transaction = {
  id: string;
  kind: TxKind;
  title: string;
  time: string;
  amount: string;
  positive: boolean;
};

export const initialTransactions: Transaction[] = [
  { id: 't1', kind: 'convert', title: 'Conversion USD → NGN', time: 'Today · 10:24 AM', amount: '-₦12,300.00', positive: false },
  { id: 't2', kind: 'received', title: 'Received @mariya.usdc', time: 'Yesterday', amount: '+$140.00', positive: true },
  { id: 't3', kind: 'sent', title: 'Transfer Sent  @tommy.orbit', time: 'Yesterday', amount: '-$50.00', positive: false },
  { id: 't4', kind: 'swap', title: 'Conversion USD → NGN', time: 'Today · 10:24 AM', amount: '-₦12,300.00', positive: false },
];

/** A completed transfer, shown on the success sheet and Transaction Details. */
export type Transfer = {
  recipient: Recipient;
  currency: CurrencyCode;
  amount: number;
  message: string;
  timestamp: string;
};
