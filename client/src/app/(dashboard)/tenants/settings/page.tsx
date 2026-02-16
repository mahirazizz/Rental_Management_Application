"use client";

import SettingsForm from "@/components/SettingForm";
import {
  useGetAuthUserQuery,
  useUpdateTenantSettingsMutation,
} from "@/state/api";
import React, { useMemo } from "react";

const TenantSettings = () => {
  const { data: authUser, isLoading } = useGetAuthUserQuery();
  const [updateTenant] = useUpdateTenantSettingsMutation();

  const initialData = useMemo(
    () => ({
      name: authUser?.userInfo?.name ?? "",
      email: authUser?.userInfo?.email ?? "",
      phoneNumber: authUser?.userInfo?.phoneNumber ?? "",
    }),
    [
      authUser?.userInfo?.name,
      authUser?.userInfo?.email,
      authUser?.userInfo?.phoneNumber,
    ],
  );

  if (isLoading || !authUser) return <>Loading...</>;

  const handleSubmit = async (data: typeof initialData) => {
    await updateTenant({
      cognitoId: authUser?.cognitoInfo?.userId,
      ...data,
    });
  };

  return (
    <SettingsForm
      initialData={initialData}
      onSubmit={handleSubmit}
      userType="tenant"
    />
  );
};

export default TenantSettings;
