"use client";

import SettingsForm from "@/components/SettingForm";
import {
  useDeleteManagerAccountMutation,
  useGetAuthUserQuery,
  useUpdateManagerSettingsMutation,
} from "@/state/api";
import { signOut } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import React from "react";

const ManagerSettings = () => {
  const { data: authUser, isLoading } = useGetAuthUserQuery();
  const [updateManager] = useUpdateManagerSettingsMutation();
  const [deleteManagerAccount] = useDeleteManagerAccountMutation();
  const router = useRouter();

  if (isLoading) return <>Loading...</>;

  const initialData = {
    name: authUser?.userInfo.name,
    email: authUser?.userInfo.email,
    phoneNumber: authUser?.userInfo.phoneNumber,
  };

  const handleSubmit = async (data: typeof initialData) => {
    await updateManager({
      cognitoId: authUser?.cognitoInfo?.userId,
      ...data,
    });
  };

  const handleDeleteAccount = async () => {
    await deleteManagerAccount({
      cognitoId: authUser!.cognitoInfo.userId,
    }).unwrap();
    await signOut();
    router.replace("/signin");
  };

  return (
    <SettingsForm
      initialData={initialData}
      onSubmit={handleSubmit}
      onDeleteAccount={handleDeleteAccount}
      userType="manager"
    />
  );
};

export default ManagerSettings;
