'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

const MapDisplay = ({ posts }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [customIcon, setCustomIcon] = useState(null);
  const [hoverIcon, setHoverIcon] = useState(null);
  const [hoveredMarkerIndex, setHoveredMarkerIndex] = useState(null);

  const defaultPosition = [30, 0];

  useEffect(() => {
    const L = require('leaflet');
    setCustomIcon(
      new L.Icon({
        iconUrl: '/pin_icon.svg',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      })
    );
    setHoverIcon(
      new L.Icon({
        iconUrl: '/pin_hover.svg',
        iconSize: [33, 33],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      })
    );
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="w-full h-screen bg-gray-100 flex items-center justify-center">
        Loading map...
      </div>
    );
  }

  return (
    <MapContainer
      center={defaultPosition}
      zoom={3}
      style={{ height: '100vh', width: '100%' }}
      minZoom={3}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {posts.map((post, index) => (
        post.location && customIcon && hoverIcon && (
          <Marker
            key={index}
            position={[post.coordinates.latitude, post.coordinates.longitude]}
            icon={hoveredMarkerIndex === index ? hoverIcon : customIcon}
            eventHandlers={{
              mouseover: () => setHoveredMarkerIndex(index),
              mouseout: () => setHoveredMarkerIndex(null),
            }}
          >
            <Popup>
              <strong>{post.title}</strong>
              <br />
              {post.content}
              <br />
              <br />
              <strong>{post.location}: {post.coordinates.latitude}, {post.coordinates.longitude}</strong>
            </Popup>
          </Marker>
        )
      ))}
    </MapContainer>
  );
};

export default MapDisplay;