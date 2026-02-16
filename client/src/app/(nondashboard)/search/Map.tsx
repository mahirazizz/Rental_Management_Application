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
    if (filters.coordinates?.length === 2) {
      return [filters.coordinates[1], filters.coordinates[0]];
    }
    return [34.05, -118.25];
  }, [filters.coordinates]);

  if (isLoading) return <>Loading...</>;
  if (isError || !properties) return <div>Failed to fetch properties</div>;

  return (
    <div className="basis-5/12 grow relative rounded-xl">
      <SearchMap properties={properties || []} center={center} />
    </div>
  );
};

export default Map;
