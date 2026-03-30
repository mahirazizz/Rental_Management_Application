"use client";

import SettingsForm from "@/components/SettingForm";
import {
  useDeleteTenantAccountMutation,
  useGetAuthUserQuery,
  useUpdateTenantSettingsMutation,
} from "@/state/api";
import { signOut } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import React, { useMemo } from "react";

const TenantSettings = () => {
  const { data: authUser, isLoading } = useGetAuthUserQuery();
  const [updateTenant] = useUpdateTenantSettingsMutation();
  const [deleteTenantAccount] = useDeleteTenantAccountMutation();
  const router = useRouter();

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

  const handleDeleteAccount = async () => {
    await deleteTenantAccount({
      cognitoId: authUser.cognitoInfo.userId,
    }).unwrap();
    await signOut();
    router.replace("/signin");
  };

  return (
    <SettingsForm
      initialData={initialData}
      onSubmit={handleSubmit}
      onDeleteAccount={handleDeleteAccount}
      userType="tenant"
    />
  );
};

export default TenantSettings;
