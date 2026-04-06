"use client";

import Card from "@/components/Card";
import DashboardPropertyFilters from "@/components/DashboardPropertyFilters";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import { useGetPropertiesQuery } from "@/state/api";
import { useAppSelector } from "@/state/redux";
import React from "react";

const Properties = () => {
  const filters = useAppSelector((state) => state.global.filters);
  const { data: properties, isLoading, error } = useGetPropertiesQuery(filters);

  if (isLoading) return <Loading />;
  if (error) return <div>Error loading manager properties</div>;

  return (
    <div className="dashboard-container">
      <Header
        title="Properties"
        subtitle="View and manage all available property listings"
      />
      <DashboardPropertyFilters />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {properties?.map((property) => (
          <Card
            key={property.id}
            property={property}
            isFavorite={false}
            onFavoriteToggle={() => {}}
            showFavoriteButton={false}
            propertyLink={`/managers/properties/${property.id}`}
          />
        ))}
      </div>
      {(!properties || properties.length === 0) && (
        <p>No properties available yet</p>
      )}
    </div>
  );
};

export default Properties;
