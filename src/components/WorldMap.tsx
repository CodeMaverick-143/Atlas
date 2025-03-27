import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';

function MapController() {
  const map = useMap();
  
  useEffect(() => {
    map.setView([20, 0], 2);
  }, [map]);
  
  return null;
}

export default function WorldMap() {
  const navigate = useNavigate();
  const [geoJsonData, setGeoJsonData] = useState(null);

  useEffect(() => {
    const fetchGeoJson = async () => {
      try {
        const response = await axios.get(
          'https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson'
        );
        setGeoJsonData(response.data);
      } catch (error) {
        console.error('Error fetching GeoJSON:', error);
      }
    };

    fetchGeoJson();
  }, []);

  const onEachFeature = (feature: any, layer: any) => {
    layer.on({
      click: () => {
        const countryCode = feature.properties.ISO_A2;
        navigate(`/country/${countryCode}`);
      },
      mouseover: (e: any) => {
        const layer = e.target;
        layer.setStyle({
          fillOpacity: 0.7,
          weight: 2,
          color: '#666',
        });
      },
      mouseout: (e: any) => {
        const layer = e.target;
        layer.setStyle({
          fillOpacity: 0.2,
          weight: 1,
          color: '#666',
        });
      },
    });

    // Add tooltip with country name
    const countryName = feature.properties.ADMIN;
    layer.bindTooltip(countryName, {
      permanent: false,
      direction: 'center',
      className: 'country-tooltip',
    });
  };

  const geoJsonStyle = {
    fillColor: '#3b82f6',
    weight: 1,
    opacity: 1,
    color: '#666',
    fillOpacity: 0.2,
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-[calc(100vh-4rem)]"
    >
      <MapContainer
        className="h-full w-full"
        center={[20, 0]}
        zoom={2}
        minZoom={2}
        maxZoom={8}
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {geoJsonData && (
          <GeoJSON
            data={geoJsonData}
            style={geoJsonStyle}
            onEachFeature={onEachFeature}
          />
        )}
        <MapController />
      </MapContainer>
    </motion.div>
  );
}