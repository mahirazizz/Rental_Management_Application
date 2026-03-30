"use client";

import React, { useEffect, useMemo, useState } from "react";
import { debounce } from "lodash";
import { Search, RotateCcw } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { FiltersState, initialState, setFilters } from "@/state";
import { useAppDispatch, useAppSelector } from "@/state/redux";
import { cleanParams } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DashboardPropertyFilters = () => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.global.filters);
  const [locationInput, setLocationInput] = useState(filters.location);

  useEffect(() => {
    setLocationInput(filters.location);
  }, [filters.location]);

  const updateURL = useMemo(
    () =>
      debounce((nextFilters: FiltersState) => {
        const cleanFilters = cleanParams(nextFilters);
        const updatedSearchParams = new URLSearchParams();

        Object.entries(cleanFilters).forEach(([key, value]) => {
          updatedSearchParams.set(
            key,
            Array.isArray(value) ? value.join(",") : value.toString(),
          );
        });

        const query = updatedSearchParams.toString();
        router.push(query ? `${pathname}?${query}` : pathname, {
          scroll: false,
        });
      }, 300),
    [pathname, router],
  );

  useEffect(() => {
    return () => {
      updateURL.cancel();
    };
  }, [updateURL]);

  const handleFilterChange = <K extends keyof FiltersState>(
    key: K,
    value: FiltersState[K],
  ) => {
    const nextFilters = { ...filters, [key]: value };
    dispatch(setFilters({ [key]: value }));
    updateURL(nextFilters);
  };

  const handleLocationSearch = () => {
    handleFilterChange("location", locationInput);
  };

  const handleReset = () => {
    dispatch(setFilters(initialState.filters));
    updateURL(initialState.filters);
  };

  return (
    <div className="mb-6 p-3 bg-white rounded-xl border border-gray-200 flex flex-wrap items-center gap-3">
      <div className="flex items-center">
        <Input
          placeholder="Search location"
          value={locationInput}
          onChange={(e) => setLocationInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleLocationSearch();
          }}
          className="w-44 rounded-l-lg rounded-r-none border-r-0"
        />
        <Button
          onClick={handleLocationSearch}
          className="rounded-l-none rounded-r-lg"
        >
          <Search className="w-4 h-4" />
        </Button>
      </div>

      <Select
        value={filters.beds}
        onValueChange={(value) => handleFilterChange("beds", value)}
      >
        <SelectTrigger className="w-28 rounded-lg">
          <SelectValue placeholder="Beds" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          <SelectItem value="any">Any Beds</SelectItem>
          <SelectItem value="1">1+ bed</SelectItem>
          <SelectItem value="2">2+ beds</SelectItem>
          <SelectItem value="3">3+ beds</SelectItem>
          <SelectItem value="4">4+ beds</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.baths}
        onValueChange={(value) => handleFilterChange("baths", value)}
      >
        <SelectTrigger className="w-28 rounded-lg">
          <SelectValue placeholder="Baths" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          <SelectItem value="any">Any Baths</SelectItem>
          <SelectItem value="1">1+ bath</SelectItem>
          <SelectItem value="2">2+ baths</SelectItem>
          <SelectItem value="3">3+ baths</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.propertyType}
        onValueChange={(value) => handleFilterChange("propertyType", value)}
      >
        <SelectTrigger className="w-40 rounded-lg">
          <SelectValue placeholder="Property Type" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          <SelectItem value="any">Any Property Type</SelectItem>
          <SelectItem value="Rooms">Rooms</SelectItem>
          <SelectItem value="Tinyhouse">Tinyhouse</SelectItem>
          <SelectItem value="Apartment">Apartment</SelectItem>
          <SelectItem value="Villa">Villa</SelectItem>
          <SelectItem value="Townhouse">Townhouse</SelectItem>
          <SelectItem value="Cottage">Cottage</SelectItem>
        </SelectContent>
      </Select>

      <Button variant="outline" onClick={handleReset} className="rounded-lg">
        <RotateCcw className="w-4 h-4 mr-2" />
        Reset
      </Button>
    </div>
  );
};

export default DashboardPropertyFilters;
