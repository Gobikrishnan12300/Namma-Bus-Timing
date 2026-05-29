import React, { useMemo, useState } from 'react';
import { APP_NAME, APP_TAGLINE } from '../constants/app';
import {
  BUS_ROUTES,
  enrichRoutes,
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
  const [destinationFilter, setDestinationFilter] = useState<string>('all');
  const [searchText, setSearchText] = useState<string>('');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');

  const destinations = useMemo(
    () => ENRICHED_ROUTES.map((r) => ({ id: r.id, label: r.to, tamil: r.toTamil })),
    []
  );

  const filteredRoutes = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    return ENRICHED_ROUTES.map((route) => {
      if (destinationFilter !== 'all' && route.id !== destinationFilter) {
        return null;
      }

      const visibleDepartures = route.departures.filter((dep: EnrichedDeparture) => {
        if (!isMinutesInFilter(dep.sortMinutes, timeFilter)) return false;
        if (!query) return true;

        return (
          route.to.toLowerCase().includes(query) ||
          route.toTamil?.includes(searchText.trim()) ||
          route.via?.toLowerCase().includes(query) ||
          dep.busName.toLowerCase().includes(query) ||
          dep.time.includes(searchText.trim())
        );
      });

      if (visibleDepartures.length === 0) return null;

      return { ...route, departures: visibleDepartures };
    }).filter((r): r is EnrichedRoute => r !== null);
  }, [destinationFilter, searchText, timeFilter]);

  const totalBuses = filteredRoutes.reduce((sum, r) => sum + r.departures.length, 0);

  return (
    <div className="app-root">
      <header className="app-header">
        <div>
          <h1>{APP_NAME}</h1>
          <p className="app-subtitle">{APP_TAGLINE}</p>
        </div>
        <div className="app-badge">{totalBuses} buses listed</div>
      </header>

      <main className="app-main">
        <section className="filters-card">
          <h2>Search routes</h2>
          <div className="filters-grid">
            <div className="field">
              <label htmlFor="destination">Destination</label>
              <select
                id="destination"
                value={destinationFilter}
                onChange={(e) => setDestinationFilter(e.target.value)}
              >
                <option value="all">All destinations</option>
                {destinations.map((dest) => (
                  <option key={dest.id} value={dest.id}>
                    {dest.label}
                    {dest.tamil ? ` (${dest.tamil})` : ''}
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
              <label htmlFor="searchText">Search (time / bus / route)</label>
              <input
                id="searchText"
                type="text"
                placeholder="e.g. Government Bus, 7.25, Salem"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
          </div>
          <p className="filters-hint">
            Data from Thammampatti bus stand timing boards. Times shown as on the board (e.g. 6.00, 1.21).
            Please confirm at the stand before travel.
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
                <div>
                  <h2>
                    {route.from} → {route.to}
                  </h2>
                  {route.toTamil && <p className="route-tamil">{route.toTamil}</p>}
                  {route.via && <p className="route-via">Via: {route.via}</p>}
                </div>
                <span className="route-count">{route.departures.length} buses</span>
              </div>

              <div className="schedule-wrapper">
                <table className="schedule-table">
                  <thead>
                    <tr>
                      <th>#</th>
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
                        <td className="col-time" data-label="நேரம்">
                          {dep.time}
                        </td>
                        <td
                          className={
                            dep.busName === 'Government Bus'
                              ? 'col-bus col-bus--gov'
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

