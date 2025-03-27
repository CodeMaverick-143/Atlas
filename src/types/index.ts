export interface Country {
  name: {
    common: string;
    official: string;
  };
  capital: string[];
  region: string;
  subregion: string;
  population: number;
  languages: Record<string, string>;
  currencies: Record<string, {
    name: string;
    symbol: string;
  }>;
  flags: {
    png: string;
    svg: string;
  };
  area: number;
  borders: string[];
  latlng: [number, number];
  maps: {
    googleMaps: string;
  };
}

export interface CountryDetails extends Country {
  description: string;
  government: string;
  headOfState: string;
  gdp: number;
  mainIndustries: string[];
  traditions: string[];
  climate: string;
  exchangeRates: Record<string, number>;
  weather?: {
    main: {
      temp: number;
      humidity: number;
    };
    wind: {
      speed: number;
    };
    weather: Array<{
      description: string;
    }>;
  };
}