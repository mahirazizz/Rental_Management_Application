"use client";

import React, { useMemo, useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { Property } from "@/types/prismaTypes";

interface SearchMapProps {
  properties: Property[];
  center: [number, number];
}

const SearchMap: React.FC<SearchMapProps> = ({ properties, center }) => {
  const [isMapReady, setIsMapReady] = useState(false);

  const defaultIcon = useMemo(() => {
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
  }, []);

  const propertiesWithValidCoordinates = useMemo(
    () =>
      (properties || []).filter((property) => {
        const lat = property.location?.coordinates?.latitude;
        const lng = property.location?.coordinates?.longitude;
        return (
          typeof lat === "number" &&
          typeof lng === "number" &&
          Number.isFinite(lat) &&
          Number.isFinite(lng)
        );
      }),
    [properties],
  );

  return (
    <div className="h-full w-full">
      <MapContainer
        center={center}
        zoom={9}
        whenReady={() => setIsMapReady(true)}
        className="map-container rounded-xl h-full w-full"
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {isMapReady &&
          propertiesWithValidCoordinates.map((property) => (
            <Marker
              key={property.id}
              position={[
                property.location.coordinates.latitude,
                property.location.coordinates.longitude,
              ]}
              icon={defaultIcon}
            >
              <Popup>
                <div className="marker-popup">
                  <div className="marker-popup-image"></div>
                  <div>
                    <a
                      href={`/search/${property.id}`}
                      target="_blank"
                      className="marker-popup-title"
                      rel="noreferrer"
                    >
                      {property.name}
                    </a>
                    <p className="marker-popup-price">
                      ${property.pricePerMonth}
                      <span className="marker-popup-price-unit"> / month</span>
                    </p>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
};

export default SearchMap;
