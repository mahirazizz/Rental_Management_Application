"use client";

import React, { useMemo } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, Marker, TileLayer } from "react-leaflet";

interface PropertyMapProps {
  coordinates: [number, number];
}

const PropertyMap: React.FC<PropertyMapProps> = ({ coordinates }) => {
  const defaultIcon = useMemo(
    () => {
      // @ts-expect-error - L.icon exists but TypeScript doesn't recognize it
      return L.icon({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });
    },
    [],
  );

  return (
    <div>
      <MapContainer
        center={coordinates}
        zoom={14}
        className="h-75 w-full rounded-lg"
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={coordinates} icon={defaultIcon} />
      </MapContainer>
    </div>
  );
};

export default PropertyMap;
