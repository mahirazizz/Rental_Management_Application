import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AmenityIcons, HighlightIcons } from "@/lib/constants";
import { formatEnumString } from "@/lib/utils";
import { useGetPropertyQuery } from "@/state/api";
import {
  Car,
  CheckCircle2,
  HelpCircle,
  PawPrint,
  Receipt,
  ShieldCheck,
} from "lucide-react";
import React from "react";

const PropertyDetails = ({ propertyId }: PropertyDetailsProps) => {
  const {
    data: property,
    isError,
    isLoading,
  } = useGetPropertyQuery(propertyId);

  if (isLoading) return <>Loading...</>;
  if (isError || !property) {
    return <>Property not Found</>;
  }

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <div className="mb-10 space-y-10">
      {/* Amenities */}
      <section className="rounded-2xl border border-primary-100 bg-linear-to-b from-white to-primary-50/30 p-6 sm:p-8 shadow-sm">
        <div className="mb-5">
          <h2 className="text-2xl font-semibold text-primary-800">
            Property Amenities
          </h2>
          <p className="mt-1 text-sm text-primary-600">
            Everything included with this home for a comfortable daily life.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {property.amenities.map((amenity: AmenityEnum) => {
            const Icon = AmenityIcons[amenity as AmenityEnum] || HelpCircle;
            return (
              <div
                key={amenity}
                className="group rounded-xl border border-primary-100 bg-white px-4 py-5 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-md"
              >
                <Icon className="mx-auto mb-2 h-6 w-6 text-primary-700 transition-colors group-hover:text-primary-800" />
                <span className="text-sm font-medium text-primary-800">
                  {formatEnumString(amenity)}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Highlights */}
      <section className="rounded-2xl border border-secondary-200 bg-linear-to-b from-secondary-50 to-white p-6 sm:p-8 shadow-sm">
        <div className="mb-5">
          <h3 className="text-2xl font-semibold text-primary-800">
            Highlights
          </h3>
          <p className="mt-1 text-sm text-primary-600">
            Standout features tenants usually care about most.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {property.highlights.map((highlight: HighlightEnum) => {
            const Icon =
              HighlightIcons[highlight as HighlightEnum] || HelpCircle;
            return (
              <div
                key={highlight}
                className="rounded-xl border border-primary-100 bg-white px-4 py-5 text-center shadow-sm"
              >
                <Icon className="mx-auto mb-2 h-6 w-6 text-primary-700" />
                <span className="text-sm font-medium text-primary-800">
                  {formatEnumString(highlight)}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Tabs Section */}
      <section className="rounded-2xl border border-primary-100 bg-white p-6 sm:p-8 shadow-sm">
        <h3 className="text-2xl font-semibold text-primary-800">
          Fees and Policies
        </h3>
        <p className="mt-2 text-sm text-primary-600">
          The fees below are based on community-supplied data and may exclude
          additional fees and utilities.
        </p>
        <Tabs defaultValue="required-fees" className="mt-6">
          <TabsList className="grid h-auto w-full grid-cols-1 gap-2 bg-transparent p-0 sm:grid-cols-3">
            <TabsTrigger
              value="required-fees"
              className="rounded-lg border border-primary-100 bg-primary-50 px-4 py-2 text-primary-700 data-[state=active]:border-primary-700 data-[state=active]:bg-primary-700 data-[state=active]:text-white"
            >
              Required Fees
            </TabsTrigger>
            <TabsTrigger
              value="pets"
              className="rounded-lg border border-primary-100 bg-primary-50 px-4 py-2 text-primary-700 data-[state=active]:border-primary-700 data-[state=active]:bg-primary-700 data-[state=active]:text-white"
            >
              Pets
            </TabsTrigger>
            <TabsTrigger
              value="parking"
              className="rounded-lg border border-primary-100 bg-primary-50 px-4 py-2 text-primary-700 data-[state=active]:border-primary-700 data-[state=active]:bg-primary-700 data-[state=active]:text-white"
            >
              Parking
            </TabsTrigger>
          </TabsList>

          <TabsContent value="required-fees" className="mt-5">
            <div className="max-w-2xl rounded-xl border border-secondary-200 bg-secondary-50 p-4 sm:p-5">
              <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-primary-800">
                <Receipt className="h-4 w-4" />
                One-time move-in fees
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-lg border border-primary-100 bg-white px-4 py-3">
                  <span className="font-medium text-primary-700">
                    Application Fee
                  </span>
                  <span className="font-semibold text-primary-800">
                    {formatCurrency(property.applicationFee)}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-primary-100 bg-white px-4 py-3">
                  <span className="font-medium text-primary-700">
                    Security Deposit
                  </span>
                  <span className="font-semibold text-primary-800">
                    {formatCurrency(property.securityDeposit)}
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="pets" className="mt-5">
            <div className="max-w-2xl rounded-xl border border-primary-100 bg-primary-50 p-4 sm:p-5">
              <div className="flex items-center gap-2">
                <PawPrint className="h-5 w-5 text-primary-700" />
                <p className="font-semibold text-primary-800">Pet Policy</p>
              </div>
              <p className="mt-3 flex items-center gap-2 text-primary-700">
                <CheckCircle2 className="h-4 w-4" />
                Pets are {property.isPetsAllowed ? "allowed" : "not allowed"}
              </p>
            </div>
          </TabsContent>

          <TabsContent value="parking" className="mt-5">
            <div className="max-w-2xl rounded-xl border border-primary-100 bg-primary-50 p-4 sm:p-5">
              <div className="flex items-center gap-2">
                <Car className="h-5 w-5 text-primary-700" />
                <p className="font-semibold text-primary-800">Parking Policy</p>
              </div>
              <p className="mt-3 flex items-center gap-2 text-primary-700">
                <ShieldCheck className="h-4 w-4" />
                Parking is{" "}
                {property.isParkingIncluded ? "included" : "not included"}
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
};

export default PropertyDetails;
