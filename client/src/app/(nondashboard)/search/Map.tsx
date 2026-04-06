"use client";

import React, { useMemo } from "react";
import { useAppSelector } from "@/state/redux";
import { useGetPropertiesQuery } from "@/state/api";
import dynamic from "next/dynamic";
import { AlertTriangle, Loader2 } from "lucide-react";

const SearchMap = dynamic(() => import("./SearchMap"), {
  ssr: false,
  loading: () => (
    <div className="basis-5/12 grow h-full rounded-3xl border border-slate-200 bg-white/85 p-4 shadow-sm">
      <div className="h-full rounded-2xl bg-slate-200 animate-pulse" />
    </div>
  ),
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

  if (isLoading) {
    return (
      <div className="basis-5/12 grow h-full rounded-3xl border border-slate-200 bg-white/85 p-4 shadow-sm">
        <div className="flex h-full items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      </div>
    );
  }

  if (isError || !properties) {
    return (
      <div className="basis-5/12 grow h-full rounded-3xl border border-red-200 bg-red-50/70 p-4 shadow-sm">
        <div className="flex h-full flex-col items-center justify-center rounded-2xl bg-white/80 text-center">
          <AlertTriangle className="h-7 w-7 text-red-500" />
          <p className="mt-2 text-sm font-medium text-red-700">
            Failed to load map data
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="basis-5/12 grow relative rounded-3xl border border-slate-200 bg-white/80 p-2 h-full overflow-hidden shadow-sm">
      <SearchMap properties={properties || []} center={center} />
    </div>
  );
};

export default Map;
