// src/MapComponent.js
import React, { useState } from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import axios from 'axios';

const MapClick = ({ onClick }) => {
  useMapEvents({
    click(e) {
      onClick(e.latlng);
    },
  });
  return null;
};

const MapComponent = () => {
  const [info, setInfo] = useState(null);

  const handleMapClick = async (latlng) => {
    const demoData = await fetchDemographicData(latlng);
    setInfo(demoData);
  };

  const fetchDemographicData = async ({ lat, lng , country , population}) => {
    try {

    //   const response = await axios.get(`https://restcountries.com/v3.1/latlng/${lat}, ${country},${population}`);
      
      const response = await axios.get("https://restcountries.com/v3.1/all");
      console.log('Country Data Response:', response.data);

      if (response.data.length === 0) {
        return {
          country: 'Unknown',
          population: 'N/A',
          area: 'N/A',
          lat: lat.toFixed(2),
          lng: lng.toFixed(2),
        };
      }

      const countryData = response.data[0];

      return {
        country: countryData.name.common,
        population: countryData.population,
        area: countryData.area,
        lat: countryData.latlng[0],
        lng: countryData.latlng[1],
      };
    } catch (error) {
      console.error('Error fetching demographic data:', error);
      return {
        country: 'Unknown',
        population: 'N/A',
        area: 'N/A',
        lat: lat.toFixed(2),
        lng: lng.toFixed(2),
      };
    }
  };

  return (
    <div>
      <MapContainer center={[20, 0]} zoom={2} style={{ height: '80vh', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapClick onClick={handleMapClick} />
      </MapContainer>
      {info && (
        <div style={{ padding: '20px', background: '#fff', position: 'absolute', top: '10%', left: '10%', zIndex: 1000 }}>
          <h3>Demographic Information</h3>
          <p><strong>Country:</strong> {info.country}</p>
          <p><strong>Population:</strong> {info.population}</p>
          <p><strong>Area:</strong> {info.area} km²</p>
          <p><strong>Coordinates:</strong> {info.lat}, {info.lng}</p>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
