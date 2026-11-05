import { useEffect, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import { loadCatalog } from '../store/catalogSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import type { Integration } from '../types/integration.types';
import './IntegrationDirectory.scss';

interface Props { onBack: () => void; }

const categoryNames = (item: Integration, categoryNamesById: Map<string, string>) => item.categoryIds
  .map((id) => categoryNamesById.get(id))
  .filter(Boolean) as string[];

function getVendorPositions(items: Integration[]) {
  const ringScales = items.length > 42
    ? [0.72, 0.86, 1]
    : items.length > 18
      ? [0.8, 1]
      : [1];
  const groups = ringScales.map((_, ringIndex) => items.filter((__, index) => index % ringScales.length === ringIndex));

  return items.map((item, index) => {
    const ringIndex = index % ringScales.length;
    const slot = Math.floor(index / ringScales.length);
    const groupSize = groups[ringIndex].length;
    const angle = -Math.PI / 2 + ((slot + ringIndex / 2) / groupSize) * Math.PI * 2;
    const scale = ringScales[ringIndex];
    const left = 50 + Math.cos(angle) * 44 * scale;
    const top = 50 + Math.sin(angle) * 42 * scale;
    const featured = items.length <= 18 && index === 0;
    const medium = items.length <= 18 && (index === 1 || index === items.length - 1);

    return {
      item,
      ringIndex,
      featured,
      medium,
      style: {
        left: `${left}%`,
        top: `${top}%`,
        '--vendor-width': items.length > 42 ? '22px' : featured ? '132px' : medium ? '112px' : '98px',
        '--vendor-height': items.length > 42 ? '22px' : featured ? '76px' : medium ? '68px' : '60px',
      } as CSSProperties,
    };
  });
}

export default function IntegrationDirectory({ onBack }: Props) {
  const dispatch = useAppDispatch();
  const { categories, integrations, status, error } = useAppSelector((state) => state.catalog);
  const isLoading = status === 'idle' || status === 'loading';
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('asc');
  const [selectedId, setSelectedId] = useState<string | null>("null");

  useEffect(() => {
    if (status === 'idle') void dispatch(loadCatalog());
  }, [dispatch, status]);

  const filtered = useMemo(() => integrations
    .filter((item) => item.name.toLowerCase().includes(query.trim().toLowerCase()))
    .filter((item) => category === 'all' || item.categoryIds.includes(category))
    .sort((a, b) => sort === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)), [query, category, sort]);

  const categoryNamesById = useMemo(() => new Map(categories.map((item) => [item.id, item.name])), [categories]);
  const vendorPositions = useMemo(() => getVendorPositions(filtered), [filtered]);
  const selected = filtered.find((item) => item.id === selectedId) ?? null;
  const orbitScales = category === 'all' ? [63, 76, 88] : [88];

  return (
    <main className="directory-page">
      <div className="explorer-layout">
        <div className="directory-topline">
          <div className="directory-mini-label">
            <span className="directory-eyebrow">INTEGRATION PORTFOLIO</span>
            <i />
          </div>
          <button className="back-link" onClick={onBack}>← Back to Ecosystem</button>
        </div>

        <header className="directory-heading">
          <div>
            <span className="directory-kicker">INTERACTIVE ECOSYSTEM</span>
            <h1>Explore Integrations</h1>
          </div>
          <p>{isLoading ? 'Loading security platforms...' : `Explore ${integrations.length} security platforms across ${categories.length} connected categories.`}</p>
        </header>

        <div className="directory-toolbar">
          <label className="search-box">
            <span aria-hidden="true">⌕</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search integrations..."
              aria-label="Search integrations"
            />
          </label>
          <div className="directory-results-line" aria-live="polite">
            <strong>{isLoading ? 'Loading integrations...' : `${filtered.length} integrations`}</strong>
            <label>
              Sort
              <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort integrations">
                <option value="asc">A–Z</option>
                <option value="desc">Z–A</option>
              </select>
            </label>
          </div>
        </div>

        <section className="ecosystem-explorer" aria-label="Interactive integration ecosystem">
          <div className="ecosystem-orbits" aria-hidden="true">
            <span className="orbit-ring category-orbit" />
            {orbitScales.map((scale) => (
              <span className="orbit-ring vendor-orbit" key={scale} style={{ '--orbit-scale': `${scale}%` } as CSSProperties} />
            ))}
          </div>

          <div className="metron-hub">
            <span className="hub-mark">m</span>
            <strong>metron</strong>
            <small>security</small>
            <button className={`hub-all ${category === 'all' ? 'active' : ''}`} onClick={() => { setCategory('all'); setSelectedId(null); }}>
              All categories
            </button>
          </div>

          <nav className="category-ring" aria-label="Filter integrations by category">
            {categories.map((item, index) => {
              const angle = -Math.PI / 2 + (index / categories.length) * Math.PI * 2;
              const style = {
                left: `${50 + Math.cos(angle) * 17}%`,
                top: `${50 + Math.sin(angle) * 20}%`,
                '--category-color': item.color,
              } as CSSProperties;

              return (
                <button
                  key={item.id}
                  className={`explorer-category-node ${category === item.id ? 'selected' : ''}`}
                  style={style}
                  onClick={() => { setCategory(item.id); setSelectedId(null); }}
                  aria-pressed={category === item.id}
                >
                  <span className="category-icon" aria-hidden="true">{item.icon}</span>
                  <span className="category-name">{item.name}</span>
                </button>
              );
            })}
          </nav>

          <div className={`vendor-ring ${category === 'all' ? 'show-all' : ''}`} aria-label="Related integration vendors">
            {isLoading ? <p className="empty-state">Loading integrations...</p> : status === 'failed' ? (
              <div className="directory-catalog-error" role="alert">
                <p>{error}</p>
                <button type="button" onClick={() => { void dispatch(loadCatalog()); }}>Retry connection</button>
              </div>
            ) : vendorPositions.length ? vendorPositions.map(({ item, ringIndex, featured, medium, style }) => {
              const names = categoryNames(item, categoryNamesById);
              return (
                <article
                  key={item.id}
                  className={`vendor-node ${featured ? 'featured' : ''} ${medium ? 'medium' : ''} ${selectedId === item.id ? 'selected' : ''}`}
                  data-ring={ringIndex}
                  style={style}
                >
                  <button
                    className="vendor-orbit-card"
                    type="button"
                    onClick={() => setSelectedId(item.id)}
                    aria-label={`View ${item.name} details`}
                    aria-pressed={selectedId === item.id}
                  >
                    <span className="vendor-logo" aria-hidden="true">
                      <span className="vendor-initials">{item.initials}</span>
                      {item.image && <img src={item.image} alt="" loading="lazy" decoding="async" onError={(event) => { event.currentTarget.style.display = 'none'; }} />}
                    </span>
                    <strong>{item.name}</strong>
                    <span className="vendor-category">{names[0] ?? 'Integration'}</span>
                  </button>
                  <div className="vendor-preview" aria-hidden="true">
                    <strong>{item.name}</strong>
                    <span>{names.join(' · ') || 'Integration'}</span>
                  </div>
                </article>
              );
            }) : <p className="empty-state">No integrations match your search.</p>}
          </div>

          {selected && (
            <div className="detail-backdrop" onClick={(event) => { if (event.target === event.currentTarget) setSelectedId(null); }}>
              <aside className="integration-detail" role="dialog" aria-modal="true" aria-labelledby="integration-detail-title">
                <button className="detail-close" onClick={() => setSelectedId(null)} aria-label="Close integration details">×</button>
                <div className="detail-heading">
                  <span className="vendor-logo detail-logo" aria-hidden="true">
                    <span className="vendor-initials">{selected.initials}</span>
                    {selected.image && <img src={selected.image} alt="" decoding="async" onError={(event) => { event.currentTarget.style.display = 'none'; }} />}
                  </span>
                  <div>
                    <span className="detail-eyebrow">INTEGRATION DETAILS</span>
                    <h2 id="integration-detail-title">{selected.name}</h2>
                  </div>
                </div>
                <dl className="detail-metadata">
                  <div><dt>Category</dt><dd>{categoryNames(selected, categoryNamesById).join(', ') || 'Uncategorized'}</dd></div>
                  <div><dt>Status</dt><dd>{selected.status}</dd></div>
                </dl>
                <p className="detail-description">{selected.description || 'No additional integration details are available.'}</p>
                <a className="contact-integration" href={`mailto:info@metronsecurity.com?subject=${encodeURIComponent(`Integration enquiry: ${selected.name}`)}`}>
                  Contact Metron <span aria-hidden="true">↗</span>
                </a>
              </aside>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}