"use client";

import Card from "@/components/Card";
import DashboardPropertyFilters from "@/components/DashboardPropertyFilters";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import { useGetAuthUserQuery, useGetPropertiesQuery } from "@/state/api";
import { useAppSelector } from "@/state/redux";
import React from "react";

const Properties = () => {
  const { data: authUser } = useGetAuthUserQuery();
  const filters = useAppSelector((state) => state.global.filters);
  const managerCognitoId = authUser?.cognitoInfo?.userId;
  const {
    data: managerProperties,
    isLoading: isManagerPropertiesLoading,
    error: managerPropertiesError,
  } = useGetPropertiesQuery(
    { ...filters, managerCognitoId },
    {
      skip: !managerCognitoId,
    },
  );
  const {
    data: allProperties,
    isLoading: isAllPropertiesLoading,
    error: allPropertiesError,
  } = useGetPropertiesQuery(filters);

  const hasManagerProperties = (managerProperties?.length ?? 0) > 0;
  const visibleProperties = hasManagerProperties
    ? managerProperties
    : allProperties;
  const isLoading = isManagerPropertiesLoading || isAllPropertiesLoading;
  const error = managerPropertiesError && allPropertiesError;

  if (isLoading) return <Loading />;
  if (error) return <div>Error loading manager properties</div>;

  return (
    <div className="dashboard-container">
      <Header
        title="My Properties"
        subtitle={
          hasManagerProperties
            ? "View and manage your property listings"
            : "No manager-linked listings found, showing available properties"
        }
      />
      <DashboardPropertyFilters />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {visibleProperties?.map((property) => (
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
      {(!visibleProperties || visibleProperties.length === 0) && (
        <p>No properties available yet</p>
      )}
    </div>
  );
};

export default Properties;
