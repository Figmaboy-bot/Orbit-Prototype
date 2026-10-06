import { useState } from 'react';
import { Avatar, ScreenHeader } from '../components/ui';
import { favoriteIds, recentIds, recipients, type Recipient } from '../data';
import { Icon } from '../theme';

type Props = { onBack: () => void; onPick: (r: Recipient) => void };

export function Recipients({ onBack, onPick }: Props) {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();
  const matches = (r: Recipient) => !q || r.name.toLowerCase().includes(q) || r.handle.includes(q);
  const favorites = favoriteIds.map((id) => recipients[id]).filter(matches);
  const recent = recentIds.map((id) => recipients[id]).filter(matches);

  return (
    <div className="screen">
      <ScreenHeader title="Send" onBack={onBack} />
      <div className="screen-body recipients">
        <label className="search-bar">
          <Icon name="magnifier" size={20} />
          <input
            type="search"
            placeholder="Search name, @Orbit ID, phone, or email"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>

        {favorites.length > 0 && (
          <section className="recipient-section">
            <p className="section-label">Favorite Recipients</p>
            <div className="h-scroll favorites">
              {favorites.map((r) => (
                <RecipientCard key={r.id} recipient={r} onClick={() => onPick(r)} />
              ))}
            </div>
          </section>
        )}

        {recent.length > 0 && (
          <section className="recipient-section">
            <p className="section-label">Recent Recipients</p>
            <div className="recipient-list">
              {recent.map((r) => (
                <RecipientCard key={r.id} recipient={r} onClick={() => onPick(r)} />
              ))}
            </div>
          </section>
        )}

        {!favorites.length && !recent.length && <p className="empty-state">No Orbit users match “{query}”.</p>}
      </div>
    </div>
  );
}

function RecipientCard({ recipient: r, onClick }: { recipient: Recipient; onClick: () => void }) {
  return (
    <button className="recipient-card" onClick={onClick}>
      <Avatar art={r.art} bg={r.bg} size={40} />
      <span className="recipient-text">
        <span className="recipient-name">{r.name}</span>
        <span className="recipient-handle">{r.handle}</span>
      </span>
    </button>
  );
}
