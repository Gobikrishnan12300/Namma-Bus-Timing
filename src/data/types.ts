export type BusDeparture = {
  time: string;
  busName: string;
};

export type BusRoute = {
  id: string;
  from: string;
  to: string;
  fromTamil?: string;
  toTamil?: string;
  via?: string;
  departures: BusDeparture[];
};

export type EnrichedDeparture = BusDeparture & {
  sortMinutes: number;
};

export type EnrichedRoute = Omit<BusRoute, 'departures'> & {
  departures: EnrichedDeparture[];
};
