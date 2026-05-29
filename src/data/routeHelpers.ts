import type { BusRoute } from './types';

export type RouteTuple = [time: string, busName: string];

export type RouteOptions = {
  fromTamil?: string;
  toTamil?: string;
  via?: string;
};

/** Build a route from compact [time, busName] rows (as on timing boards). */
export function route(
  id: string,
  from: string,
  to: string,
  departures: RouteTuple[],
  options?: RouteOptions
): BusRoute {
  return {
    id,
    from,
    to,
    ...options,
    departures: departures.map(([time, busName]) => ({
      time,
      busName: normalizeBusName(busName),
    })),
  };
}

function normalizeBusName(name: string): string {
  const trimmed = name.trim();
  if (/^government\s+bus$/i.test(trimmed)) {
    return 'Government Bus';
  }
  return trimmed;
}
