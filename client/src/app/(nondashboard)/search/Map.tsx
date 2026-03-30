"use client";

import React, { useMemo } from "react";
import { useAppSelector } from "@/state/redux";
import { useGetPropertiesQuery } from "@/state/api";
import dynamic from "next/dynamic";

const SearchMap = dynamic(() => import("./SearchMap"), {
  ssr: false,
  loading: () => <div className="basis-5/12 bg-gray-200 rounded-xl animate-pulse" />,
});

const Map = () => {
  const filters = useAppSelector((state) => state.global.filters);
  const {
    data: properties,
    isLoading,
    isError,
  } = useGetPropertiesQuery(filters);

  const center = useMemo<[number, number]>(() => {
    const hasValidFilterCoordinates =
      filters.coordinates?.length === 2 &&
      (filters.coordinates[0] !== 0 || filters.coordinates[1] !== 0);

    if (hasValidFilterCoordinates) {
      return [filters.coordinates[1], filters.coordinates[0]];
    }

    const firstPropertyWithCoordinates = properties?.find(
      (property) =>
        property.location?.coordinates?.latitude !== undefined &&
        property.location?.coordinates?.longitude !== undefined,
    );

    if (firstPropertyWithCoordinates) {
      return [
        firstPropertyWithCoordinates.location.coordinates.latitude,
        firstPropertyWithCoordinates.location.coordinates.longitude,
      ];
    }

    return [34.05, -118.25];
  }, [filters.coordinates, properties]);

  if (isLoading) return <>Loading...</>;
  if (isError || !properties) return <div>Failed to fetch properties</div>;

  return (
    <div className="basis-5/12 grow relative rounded-xl h-full overflow-hidden">
      <SearchMap properties={properties || []} center={center} />
    </div>
  );
};

export default Map;
