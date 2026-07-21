"use client";

import { useGetPropertyQuery } from "@/state/api";
import { Compass, MapPin } from "lucide-react";
import React, { useMemo } from "react";
import dynamic from "next/dynamic";

const LeafletMap = dynamic(() => import("./PropertyMap"), {
  ssr: false,
  loading: () => <div className="h-75 bg-gray-200 rounded-lg animate-pulse" />,
});

const PropertyLocation = ({ propertyId }: PropertyDetailsProps) => {
  const {
    data: property,
    isError,
    isLoading,
  } = useGetPropertyQuery(propertyId);
  const center = useMemo<[number, number]>(() => {
    if (
      property?.location?.coordinates?.latitude !== undefined &&
      property?.location?.coordinates?.longitude !== undefined
    ) {
      return [
        property.location.coordinates.latitude,
        property.location.coordinates.longitude,
      ];
    }
    return [34.05, -118.25];
  }, [property]);

  const directionsUrl = useMemo(() => {
    const lat = property?.location?.coordinates?.latitude;
    const lng = property?.location?.coordinates?.longitude;

    if (
      typeof lat === "number" &&
      typeof lng === "number" &&
      Number.isFinite(lat) &&
      Number.isFinite(lng)
    ) {
      return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    }

    return `https://maps.google.com/?q=${encodeURIComponent(
      property?.location?.address || "",
    )}`;
  }, [property]);

  if (isLoading) return <>Loading...</>;
  if (isError || !property) {
    return (
      <div className="py-16">
        <h3 className="text-xl font-semibold text-primary-800">
          Map and Location
        </h3>
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
          Failed to load property details. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="py-16">
      <h3 className="text-xl font-semibold my-3">Map and Location</h3>
      <div className="flex justify-between items-center text-sm text-primary-500 mt-2">
        <div className="flex items-center text-gray-500">
          <MapPin className="w-4 h-4 mr-1 text-gray-700" />
          Property Address:
          <span className="ml-2 font-semibold text-gray-700">
            {property.location?.address || "Address not available"}
          </span>
        </div>
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex justify-between items-center hover:underline gap-2 text-primary-600"
        >
          <Compass className="w-5 h-5" />
          Get Directions
        </a>
      </div>
      <div className="relative mt-4 h-75 rounded-lg overflow-hidden">
        <LeafletMap coordinates={center} />
      </div>
    </div>
  );
};

export default PropertyLocation;
