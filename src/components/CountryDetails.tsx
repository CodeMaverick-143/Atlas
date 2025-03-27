import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { motion } from 'framer-motion';
import { ChevronLeft, DollarSign, Building2, Mountain, BookOpen } from 'lucide-react';
import axios from 'axios';
import type { CountryDetails } from '../types';

export default function CountryDetails() {
  const { countryCode } = useParams<{ countryCode: string }>();

  const { data: country, isLoading, error } = useQuery<CountryDetails>(
    ['country', countryCode],
    async () => {
      const response = await axios.get(`https://restcountries.com/v3.1/alpha/${countryCode}`);
      const countryData = response.data[0];
      
      // Fetch additional data from Wikipedia API
      const wikiResponse = await axios.get(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(countryData.name.common)}`
      );
      
      // Fetch weather data for the capital using Open-Meteo API
      const weatherResponse = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${countryData.latlng[0]}&longitude=${countryData.latlng[1]}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`
      );

      // Fetch exchange rates
      const exchangeResponse = await axios.get(
        `https://api.exchangerate-api.com/v4/latest/USD`
      );

      // Fetch country-specific traditions and industries from Wikipedia
      const traditionsResponse = await axios.get(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(countryData.name.common + ' culture')}`
      );

      // Convert weather code to description
      const weatherCodes: Record<number, string> = {
        0: 'Clear sky',
        1: 'Mainly clear',
        2: 'Partly cloudy',
        3: 'Overcast',
        45: 'Foggy',
        48: 'Depositing rime fog',
        51: 'Light drizzle',
        53: 'Moderate drizzle',
        55: 'Dense drizzle',
        61: 'Slight rain',
        63: 'Moderate rain',
        65: 'Heavy rain',
        71: 'Slight snow',
        73: 'Moderate snow',
        75: 'Heavy snow',
        77: 'Snow grains',
        80: 'Slight rain showers',
        81: 'Moderate rain showers',
        82: 'Violent rain showers',
        85: 'Slight snow showers',
        86: 'Heavy snow showers',
        95: 'Thunderstorm',
        96: 'Thunderstorm with slight hail',
        99: 'Thunderstorm with heavy hail'
      };

      // Extract traditions and industries from Wikipedia data
      const extractTraditionsAndIndustries = (text: string) => {
        const traditions: string[] = [];
        const industries: string[] = [];

        // Common industry keywords
        const industryKeywords = [
          'industry', 'manufacturing', 'agriculture', 'tourism', 'technology',
          'mining', 'fishing', 'forestry', 'energy', 'services', 'finance',
          'textiles', 'automotive', 'electronics', 'chemicals', 'construction'
        ];

        // Common tradition keywords
        const traditionKeywords = [
          'festival', 'celebration', 'ceremony', 'ritual', 'custom',
          'tradition', 'holiday', 'festivity', 'cultural', 'heritage',
          'dance', 'music', 'art', 'cuisine', 'craft', 'folklore'
        ];

        // Split text into sentences
        const sentences = text.split(/[.!?]+/);

        sentences.forEach(sentence => {
          const lowerSentence = sentence.toLowerCase();
          
          // Check for industries
          industryKeywords.forEach(keyword => {
            if (lowerSentence.includes(keyword)) {
              const industry = sentence.trim();
              if (!industries.includes(industry)) {
                industries.push(industry);
              }
            }
          });

          // Check for traditions
          traditionKeywords.forEach(keyword => {
            if (lowerSentence.includes(keyword)) {
              const tradition = sentence.trim();
              if (!traditions.includes(tradition)) {
                traditions.push(tradition);
              }
            }
          });
        });

        return {
          traditions: traditions.slice(0, 5), // Limit to top 5 traditions
          industries: industries.slice(0, 5)  // Limit to top 5 industries
        };
      };

      const { traditions, industries } = extractTraditionsAndIndustries(wikiResponse.data.extract);

      return {
        ...countryData,
        description: wikiResponse.data.extract,
        weather: {
          main: {
            temp: weatherResponse.data.current.temperature_2m,
            humidity: weatherResponse.data.current.relative_humidity_2m
          },
          wind: {
            speed: weatherResponse.data.current.wind_speed_10m
          },
          weather: [{
            description: weatherCodes[weatherResponse.data.current.weather_code] || 'Unknown'
          }]
        },
        exchangeRates: exchangeResponse.data.rates,
        traditions: traditions.length > 0 ? traditions : [
          'Traditional Festivals',
          'Cultural Celebrations',
          'Local Customs',
          'Traditional Cuisine',
          'Art and Music'
        ],
        mainIndustries: industries.length > 0 ? industries : [
          'Agriculture',
          'Manufacturing',
          'Services',
          'Tourism',
          'Technology'
        ],
        government: countryData.government || 'Constitutional Republic',
        headOfState: countryData.headOfState || 'President',
        gdp: countryData.gdp || 0,
        climate: countryData.climate || 'Temperate'
      };
    }
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !country) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500">Error loading country data</p>
        <Link to="/" className="mt-4 text-blue-500 hover:underline">Return to Map</Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-7xl mx-auto px-4 py-8"
    >
      <div className="flex items-center mb-8">
        <Link
          to="/"
          className="flex items-center text-white hover:text-gray-200"
        >
          <ChevronLeft className="h-5 w-5" />
          <span>Back to Map</span>
        </Link>
      </div>

      {/* Header Section */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg shadow-lg p-6 mb-8">
        <div className="flex items-center space-x-6">
          <img
            src={country.flags.svg}
            alt={`Flag of ${country.name.common}`}
            className="w-24 h-auto shadow-lg rounded"
          />
          <div>
            <h1 className="text-4xl font-bold text-white">
              {country.name.common}
            </h1>
            <p className="text-xl text-white/90">{country.name.official}</p>
            <p className="mt-2 text-white/80">{country.description}</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-8">
          {/* Political Information */}
          <section className="bg-white/10 backdrop-blur-sm rounded-lg shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Building2 className="h-6 w-6 text-blue-400" />
              <h2 className="text-2xl font-semibold text-white">Political Information</h2>
            </div>
            <div className="space-y-4">
              <InfoRow title="Capital" value={country.capital[0]} />
              <InfoRow title="Government Type" value={country.government} />
              <InfoRow title="Head of State" value={country.headOfState} />
              <InfoRow title="Population" value={country.population.toLocaleString()} />
            </div>
          </section>

          {/* Economic Information */}
          <section className="bg-white/10 backdrop-blur-sm rounded-lg shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <DollarSign className="h-6 w-6 text-green-400" />
              <h2 className="text-2xl font-semibold text-white">Economic Information</h2>
            </div>
            <div className="space-y-4">
              <InfoRow title="GDP" value={`$${country.gdp.toLocaleString()}`} />
              <InfoRow 
                title="Currencies" 
                value={Object.values(country.currencies)
                  .map(curr => `${curr.name} (${curr.symbol})`)
                  .join(', ')} 
              />
              <div>
                <h3 className="font-medium mb-2 text-white">Main Industries</h3>
                <ul className="list-disc list-inside space-y-1 text-white/90">
                  {country.mainIndustries.map((industry, index) => (
                    <li key={index}>{industry}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2 text-white">Exchange Rates (USD)</h3>
                <div className="grid grid-cols-2 gap-2 text-white/90">
                  {Object.entries(country.exchangeRates)
                    .filter(([currency]) => 
                      Object.keys(country.currencies).includes(currency)
                    )
                    .map(([currency, rate]) => (
                      <div key={currency} className="text-sm">
                        <span className="font-medium">{currency}:</span> {rate}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </section>

          {/* Cultural Information */}
          <section className="bg-white/10 backdrop-blur-sm rounded-lg shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <BookOpen className="h-6 w-6 text-purple-400" />
              <h2 className="text-2xl font-semibold text-white">Cultural Information</h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2 text-white">Languages</h3>
                <ul className="list-disc list-inside space-y-1 text-white/90">
                  {Object.values(country.languages).map((language) => (
                    <li key={language}>{language}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2 text-white">Traditions</h3>
                <ul className="list-disc list-inside space-y-1 text-white/90">
                  {country.traditions.map((tradition, index) => (
                    <li key={index}>{tradition}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Geographic Information */}
          <section className="bg-white/10 backdrop-blur-sm rounded-lg shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Mountain className="h-6 w-6 text-orange-400" />
              <h2 className="text-2xl font-semibold text-white">Geographic Information</h2>
            </div>
            <div className="space-y-4">
              <InfoRow title="Region" value={`${country.subregion}, ${country.region}`} />
              <InfoRow title="Area" value={`${country.area.toLocaleString()} km²`} />
              <InfoRow title="Climate" value={country.climate} />
              <InfoRow title="Coordinates" value={`${country.latlng[0]}, ${country.latlng[1]}`} />
              <div>
                <h3 className="font-medium mb-2 text-white">Bordering Countries</h3>
                <div className="flex flex-wrap gap-2">
                  {country.borders?.map((border) => (
                    <span key={border} className="px-3 py-1 bg-white/20 rounded-full text-sm text-white">
                      {border}
                    </span>
                  ))}
                </div>
              </div>
              {country.weather && (
                <div className="mt-4 p-4 bg-white/20 rounded-lg">
                  <h3 className="font-medium mb-2 text-white">Current Weather in {country.capital[0]}</h3>
                  <div className="grid grid-cols-2 gap-2 text-white/90">
                    <div>Temperature: {Math.round(country.weather.main.temp)}°C</div>
                    <div>Humidity: {country.weather.main.humidity}%</div>
                    <div>Wind: {country.weather.wind.speed} m/s</div>
                    <div>Conditions: {country.weather.weather[0].description}</div>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </motion.div>
  );
}

function InfoRow({ title, value }: { title: string; value: string }) {
  return (
    <div>
      <h3 className="font-medium text-white/70">{title}</h3>
      <p className="text-lg text-white">{value}</p>
    </div>
  );
}