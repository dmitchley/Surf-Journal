export interface Swell {
  height: number;
  direction: number;
  power: number;
  period: number;
}



export interface SwellEntry {
  timestamp: number;
  swells: Swell[];
}

export interface MappedSwellData {
  timestamp: number;
  waveHeight: number[];
  waveDirection: number[];
  wavePower: number[];
  swellPeriod: number[];
}