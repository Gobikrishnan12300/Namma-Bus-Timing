import React, { useMemo, useState } from 'react';
import { APP_NAME, APP_TAGLINE } from '../constants/app';
import {
  BUS_ROUTES,
  enrichRoutes,
  routeLabel,
  type EnrichedDeparture,
  type EnrichedRoute,
} from '../data/busRoutes';
import {
  isMinutesInFilter,
  timeFilterLabel,
  type TimeFilter,
} from '../utils/time';

const ENRICHED_ROUTES: EnrichedRoute[] = enrichRoutes(BUS_ROUTES);

const App: React.FC = () => {
  const [routeFilter, setRouteFilter] = useState<string>('all');
  const [searchText, setSearchText] = useState<string>('');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');

  const routeOptions = useMemo(
    () =>
      ENRICHED_ROUTES.map((r) => ({
        id: r.id,
        label: routeLabel(r),
        fromTamil: r.fromTamil,
        toTamil: r.toTamil,
      })),
    []
  );

  const filteredRoutes = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    return ENRICHED_ROUTES.map((route) => {
      if (routeFilter !== 'all' && route.id !== routeFilter) {
        return null;
      }

      const visibleDepartures = route.departures.filter((dep: EnrichedDeparture) => {
        if (!isMinutesInFilter(dep.sortMinutes, timeFilter)) return false;
        if (!query) return true;

        return (
          route.from.toLowerCase().includes(query) ||
          route.to.toLowerCase().includes(query) ||
          route.fromTamil?.includes(searchText.trim()) ||
          route.toTamil?.includes(searchText.trim()) ||
          route.via?.toLowerCase().includes(query) ||
          dep.busName.toLowerCase().includes(query) ||
          dep.time.includes(searchText.trim())
        );
      });

      if (visibleDepartures.length === 0) return null;

      return { ...route, departures: visibleDepartures };
    }).filter((r): r is EnrichedRoute => r !== null);
  }, [routeFilter, searchText, timeFilter]);

  const totalBuses = filteredRoutes.reduce((sum, r) => sum + r.departures.length, 0);
  const showRouteColumn = routeFilter === 'all';

  return (
    <div className="app-root">
      <header className="app-header">
        <div>
          <h1>{APP_NAME} <span className="app-subtitle">(Created by Gobikrishnan)</span></h1>
          <p className="app-subtitle">{APP_TAGLINE}</p>
        </div>
        <div className="app-badge">{totalBuses} buses listed</div>
      </header>

      <main className="app-main">
        <section className="filters-card">
          <h2>Search routes</h2>
          <div className="filters-grid">
            <div className="field">
              <label htmlFor="route">Route (From → To)</label>
              <select
                id="route"
                value={routeFilter}
                onChange={(e) => setRouteFilter(e.target.value)}
              >
                <option value="all">All routes</option>
                {routeOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="timeFilter">Time of day</label>
              <select
                id="timeFilter"
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value as TimeFilter)}
              >
                {Object.entries(timeFilterLabel).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="searchText">Search (from / to / time / bus)</label>
              <input
                id="searchText"
                type="text"
                placeholder="e.g. Salem, Rasipuram, 7.25, Government Bus"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
          </div>
          <p className="filters-hint">
            Thammampatti bus stand timings — each list shows departures in one direction (From → To).
            Times as on the board (e.g. 6.00, 1.21). Please confirm at the stand before travel.
          </p>
        </section>

        {filteredRoutes.length === 0 ? (
          <section className="table-card empty-state">
            <p>No buses found for the selected filters.</p>
            <p>Try clearing search text or changing time of day.</p>
          </section>
        ) : (
          filteredRoutes.map((route) => (
            <section key={route.id} className="route-card">
              <div className="route-card-header">
                <div className="route-endpoints">
                  <div className="route-endpoint route-endpoint--from">
                    <span className="route-endpoint-label">From</span>
                    <span className="route-endpoint-name">{route.from}</span>
                    {route.fromTamil && (
                      <span className="route-endpoint-tamil">{route.fromTamil}</span>
                    )}
                  </div>
                  <span className="route-arrow" aria-hidden="true">
                    →
                  </span>
                  <div className="route-endpoint route-endpoint--to">
                    <span className="route-endpoint-label">To</span>
                    <span className="route-endpoint-name">{route.to}</span>
                    {route.toTamil && (
                      <span className="route-endpoint-tamil">{route.toTamil}</span>
                    )}
                  </div>
                </div>
                <div className="route-meta">
                  {route.via && <span className="route-via-badge">Via {route.via}</span>}
                  <span className="route-count">{route.departures.length} buses</span>
                </div>
              </div>

              <div className="schedule-wrapper">
                <table className="schedule-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      {showRouteColumn && <th>பாதை (Route)</th>}
                      <th>நேரம் (Time)</th>
                      <th>பேருந்து (Bus)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {route.departures.map((dep, index) => (
                      <tr key={`${dep.time}-${dep.busName}-${index}`}>
                        <td className="col-num" data-label="#">
                          {index + 1}
                        </td>
                        {showRouteColumn && (
                          <td className="col-route" data-label="பாதை">
                            {route.from} → {route.to}
                            {route.via ? ` · ${route.via}` : ''}
                          </td>
                        )}
                        <td className="col-time" data-label="நேரம்">
                          {dep.time}
                        </td>
                        <td
                          className={
                            dep.busName.startsWith('Government Bus')
                              ? 'col-bus col-bus--gov'
                              : dep.busName.startsWith('Town Bus')
                                ? 'col-bus col-bus--town'
                                : 'col-bus'
                          }
                          data-label="பேருந்து"
                        >
                          {dep.busName}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))
        )}
      </main>

      <footer className="app-footer">
        <span>{APP_NAME}</span>
        <span>For reference only – verify locally</span>
      </footer>
    </div>
  );
};

export default App;
