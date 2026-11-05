import { useEffect, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import { loadCatalog } from '../store/catalogSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import './EcosystemOverview.scss';

interface Props { onExplore: () => void; }

export default function EcosystemOverview({ onExplore }: Props) {
  const dispatch = useAppDispatch();
  const { categories, integrations, status, error } = useAppSelector((state) => state.catalog);
  const isLoading = status === 'idle' || status === 'loading';
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const active = categories.find((category) => category.id === selected);
  const categoryLinks = useMemo(
    () => integrations.reduce((total, integration) => total + new Set(integration.categoryIds).size, 0),
    [integrations]
  );
  const featuredIntegrations = useMemo(() => (selected
    ? integrations.filter((integration) => integration.categoryIds.includes(selected))
    : integrations).slice(0, 6), [integrations, selected]);

  useEffect(() => {
    if (status === 'idle') void dispatch(loadCatalog());
  }, [dispatch, status]);

  return (
    <main className="ecosystem-overview" id="home">
      <div className="ecosystem-layout">
        <section className="ecosystem-copy">
          <div className="eyebrow"><span>INTEGRATION ECOSYSTEM</span><i /></div>
          <h1>A Connected<br />Security Ecosystem</h1>
          <p className="lead-copy">Integrate, automate, and extend your security stack with leading platforms across the cybersecurity landscape.</p>
          <div className="stats-row">
            <div className="stat"><span className="stat-symbol">▱</span><div><strong>{isLoading ? '—' : integrations.length}</strong><small>Platforms</small></div></div>
            <div className="stat"><span className="stat-symbol">▦</span><div><strong>{isLoading ? '—' : categories.length}</strong><small>Categories</small></div></div>
            <div className="stat"><span className="stat-symbol">∞</span><div><strong>{isLoading ? '—' : categoryLinks}</strong><small>Category links</small></div></div>
          </div>
          {status === 'failed' && (
            <div className="overview-catalog-error" role="alert">
              <span>{error}</span>
              <button type="button" onClick={() => { void dispatch(loadCatalog()); }}>Retry connection</button>
            </div>
          )}
          {active && <div className="selection-note"><span style={{ background: active.color }} /> <b>{active.name}</b> · {active.count} platforms <button onClick={() => setSelected(null)} aria-label="Clear selection">×</button></div>}
          <button className="btn-metron explore-cta" onClick={onExplore}>Explore Integrations <span>↗</span></button>
        </section>

        <section className="ecosystem-map" aria-label="Interactive Metron integration ecosystem">
          <div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="orbit orbit-three" />
          <div className="map-hub"><span className="hub-mark">m</span><b>metron</b><small>security</small></div>
          {categories.map((category, index) => {
            const isActive = selected === category.id;
            const angle = -Math.PI / 2 + (index / categories.length) * Math.PI * 2;
            const position = {
              x: 50 + Math.cos(angle) * 32,
              y: 50 + Math.sin(angle) * 40,
            };
            return <button
              key={category.id}
              className={`category-node ${isActive ? 'selected' : ''} ${selected && !isActive ? 'dimmed' : ''}`}
              style={{ '--node-color': category.color, '--x': `${position.x}%`, '--y': `${position.y}%` } as CSSProperties}
              onMouseEnter={() => setHovered(category.id)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(category.id)}
              onBlur={() => setHovered(null)}
              onClick={() => setSelected(isActive ? null : category.id)}
              aria-pressed={isActive}
              title={`${category.name}: ${category.count} platforms`}
            >
              <span>{category.icon}</span><b>{category.name}</b>
            </button>;
          })}
          {(hovered || selected) && (() => {
            const activeId = hovered || selected;
            const categoryIndex = categories.findIndex((item) => item.id === activeId);
            const info = categories[categoryIndex];
            if (!info) return null;
            const angle = -Math.PI / 2 + (categoryIndex / categories.length) * Math.PI * 2;
            const position = { x: 50 + Math.cos(angle) * 32, y: 50 + Math.sin(angle) * 40 };
            const cardStyle = {
              '--node-color': info.color,
              left: `${position.x}%`,
              top: `${position.y}%`,
            } as CSSProperties;
            return (
              <div className={`ecosystem-hover-card card-${info.id}`} style={cardStyle}>
                <span className="hover-icon">{info.icon}</span>
                <div className="hover-copy">
                  <strong>{info.name}</strong>
                  <small>Integration category · {info.count} platforms</small>
                </div>
              </div>
            );
          })()}
          {featuredIntegrations.map((integration, index) => {
            const angle = -Math.PI / 2 + (index / featuredIntegrations.length) * Math.PI * 2;
            const chipStyle = {
              left: `${50 + Math.cos(angle) * 42}%`,
              top: `${50 + Math.sin(angle) * 42}%`,
            } as CSSProperties;
            return (
              <span className="vendor-chip" key={integration.id} style={chipStyle} title={integration.name}>
                {integration.image && <img src={integration.image} alt="" loading="lazy" decoding="async" onError={(event) => { event.currentTarget.style.display = 'none'; }} />}
                {integration.name}
              </span>
            );
          })}
        </section>
      </div>
    </main>
  );
}