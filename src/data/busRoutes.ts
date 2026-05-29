import type { BusRoute, EnrichedDeparture, EnrichedRoute } from './types';
import { ATTUR_GANGAVALLI_ROUTES } from './routes/attur-gangavalli';
import { ATTUR_MALLIYAKARAI_ROUTES } from './routes/attur-malliyakarai';
import { RASIPURAM_ROUTES } from './routes/rasipuram';
import { SALEM_ROUTES } from './routes/salem';
import { SENDHARAPATTI_ROUTES } from './routes/sendharapatti';
import { THURAIYUR_ROUTES } from './routes/thuraiyur';
import { TRICHY_ROUTES } from './routes/trichy';

export type { BusDeparture, BusRoute, EnrichedDeparture, EnrichedRoute } from './types';

/** All bus routes — each entry is one direction (From → To). */
export const BUS_ROUTES: BusRoute[] = [
  ...SENDHARAPATTI_ROUTES,
  ...ATTUR_MALLIYAKARAI_ROUTES,
  ...ATTUR_GANGAVALLI_ROUTES,
  ...TRICHY_ROUTES,
  ...RASIPURAM_ROUTES,
  ...SALEM_ROUTES,
  ...THURAIYUR_ROUTES,
];

export function enrichRoutes(routes: BusRoute[]): EnrichedRoute[] {
  return routes.map((routeItem): EnrichedRoute => {
    const sortMinutesList = resolveMinutesForRoute(
      routeItem.departures.map((x) => x.time)
    );
    const departures: EnrichedDeparture[] = routeItem.departures.map((dep, i) => ({
      ...dep,
      sortMinutes: sortMinutesList[i],
    }));
    return { ...routeItem, departures };
  });
}

function resolveMinutesForRoute(times: string[]): number[] {
  const minutes: number[] = [];
  let last = -1;

  for (const time of times) {
    const normalized = time.trim().replace('.', ':');
    const [h, m = 0] = normalized.split(':').map(Number);
    let value = h * 60 + m;

    if (last >= 0) {
      if (value < last) {
        if (h >= 1 && h <= 3 && last >= 11 * 60) {
          value += 12 * 60;
        } else if (h >= 1 && h <= 5 && last >= 13 * 60 && value < 6 * 60) {
          value += 12 * 60;
        }
      }
      if (last >= 12 * 60 && h >= 1 && h <= 3 && value < 4 * 60) {
        value += 12 * 60;
      }
    }

    minutes.push(value);
    last = value;
  }

  return minutes;
}
