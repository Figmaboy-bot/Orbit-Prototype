import { InfoCard, PrimaryButton, ScreenHeader, TextLink } from '../components/ui';
import { formatMoney, type Transfer } from '../data';
import { Icon } from '../theme';

type Props = { transfer: Transfer; onBack: () => void; onToast: (msg: string) => void };

export function Details({ transfer: t, onBack, onToast }: Props) {
  const money = formatMoney(t.currency, t.amount);

  const downloadReceipt = () => {
    const lines = [
      'Orbit — Transfer Receipt',
      '',
      `Amount Sent:          ${money}`,
      `You Paid:             ${money}`,
      `Recipient Gets:       ${money}`,
      `Fee:                  ${formatMoney(t.currency, 0)}`,
      `Timestamp:            ${t.timestamp}`,
      'Transaction Duration: Instant',
      '',
      `Name:                 ${t.recipient.name}`,
      `Orbit ID:             ${t.recipient.handle}`,
      `Destination:          Orbit Wallet (${t.currency})`,
      ...(t.message ? ['', `Message:              ${t.message}`] : []),
    ];
    const url = URL.createObjectURL(new Blob([lines.join('\n')], { type: 'text/plain' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'orbit-receipt.txt';
    a.click();
    URL.revokeObjectURL(url);
    onToast('Receipt downloaded');
  };

  return (
    <div className="screen">
      <ScreenHeader title="Transaction Details" onBack={onBack} />
      <div className="screen-body details">
        <div className="details-hero">
          <Icon name="seal-check" size={64} />
          <div className="success-text">
            <p className="success-title">Transaction Successful</p>
            <p className="success-sub">Your transfer has been completed.</p>
          </div>
        </div>

        <div className="details-sections">
          <section className="details-section">
            <p className="details-label">Transaction Summary</p>
            <InfoCard
              className="on-bg"
              rows={[
                { label: 'Amount Sent:', value: money, strong: true },
                { label: 'You Paid:', value: money, strong: true },
                { label: 'Recipient Gets:', value: money, strong: true },
                { label: 'Fee:', value: formatMoney(t.currency, 0) },
                { label: 'Timestamp:', value: t.timestamp },
                { label: 'Transaction Duration:', value: 'Instant' },
              ]}
            />
          </section>
          <section className="details-section">
            <p className="details-label">Recipient</p>
            <InfoCard
              className="on-bg"
              rows={[
                { label: 'Name:', value: t.recipient.name },
                { label: 'Orbit ID:', value: t.recipient.handle },
                { label: 'Destination:', value: `Orbit Wallet (${t.currency})` },
              ]}
            />
          </section>
          {t.message && (
            <section className="details-section">
              <p className="details-label">Notes</p>
              <InfoCard className="on-bg" rows={[{ label: 'Message:', value: t.message }]} />
            </section>
          )}
        </div>

        <div className="details-actions">
          <PrimaryButton onClick={downloadReceipt} className="with-icon">
            <Icon name="file-arrow-down" size={24} />
            Download Receipt PDF
          </PrimaryButton>
          <TextLink icon="headset" onClick={() => onToast('Support will reach out shortly')}>
            Report an Issue
          </TextLink>
        </div>
      </div>
    </div>
  );
}
