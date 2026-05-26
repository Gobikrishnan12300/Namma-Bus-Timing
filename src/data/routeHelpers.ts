import type { BusDeparture, BusRoute } from './types';

export const d = (time: string, busName: string): BusDeparture => ({
  time,
  busName: normalizeBusName(busName),
});

export function normalizeBusName(raw: string): string {
  const s = raw.trim().replace(/\s+/g, ' ');

  if (/^government\s+y$/i.test(s)) return 'Government Bus';

  const gov = s.match(/^government\s+bus(?:\s+(.+))?$/i);
  if (gov) {
    return gov[1] ? `Government Bus (${titleCase(gov[1])})` : 'Government Bus';
  }

  const town = s.match(/^town\s*bus\s*(.+)$/i) ?? s.match(/^townbus\s*([a-z0-9].*)$/i);
  if (town) {
    const detail = town[1].trim().replace(/^([a-z]+)(\d)/i, '$1 $2');
    return `Town Bus ${detail}`;
  }

  const acronyms: Record<string, string> = {
    'g k m': 'G.K.M.',
    gkm: 'G.K.M.',
    'g.k.m': 'G.K.M.',
    'g.k.m.': 'G.K.M.',
    'p.n.k': 'P.N.K.',
    'p.n.k.': 'P.N.K.',
    's.k.p': 'S.K.P.',
    's.k.p.': 'S.K.P.',
    's.k.t': 'S.K.T.',
    's.k.t.': 'S.K.T.',
    'k.r.t': 'K.R.T.',
    'k.r.t.': 'K.R.T.',
    'k.r.d': 'K.R.D.',
    'k.r.d.': 'K.R.D.',
    'n.t': 'N.T.',
    'n.b.t': 'N.B.T.',
    's.r.t': 'S.R.T.',
    vnr: 'V.N.R.',
  };

  const key = s.toLowerCase().replace(/\s+/g, ' ');
  if (acronyms[key]) return acronyms[key];

  return titleCase(s);
}

function titleCase(value: string): string {
  return value
    .split(' ')
    .filter(Boolean)
    .map((word) => {
      const lower = word.toLowerCase();
      if (lower === 'bus') return 'Bus';
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(' ');
}

type RouteOpts = {
  via?: string;
  fromTamil?: string;
  toTamil?: string;
};

export function route(
  id: string,
  from: string,
  to: string,
  entries: [string, string][],
  opts?: RouteOpts
): BusRoute {
  return {
    id,
    from,
    to,
    via: opts?.via,
    fromTamil: opts?.fromTamil,
    toTamil: opts?.toTamil,
    departures: entries.map(([time, bus]) => d(time, bus)),
  };
}
