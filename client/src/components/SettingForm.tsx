import { SettingsFormData, settingsSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import { Form } from "./ui/form";
import { CustomFormField } from "./FormField";
import { Button } from "./ui/button";

const SettingsForm = ({
  initialData,
  onSubmit,
  onDeleteAccount,
  userType,
}: SettingsFormProps) => {
  const [editMode, setEditMode] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const form = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: initialData,
  });

  useEffect(() => {
    if (!editMode) {
      form.reset(initialData);
    }
  }, [form, initialData, editMode]);

  const toggleEditMode = () => {
    setEditMode(!editMode);
    if (editMode) {
      form.reset(initialData);
    }
  };

  const handleSubmit = async (data: SettingsFormData) => {
    await onSubmit(data);
    setEditMode(false);
  };

  const handleDeleteAccount = async () => {
    const accountLabel = userType === "tenant" ? "tenant" : "manager";
    const shouldDelete = window.confirm(
      `Delete your ${accountLabel} account permanently? This action cannot be undone.`,
    );

    if (!shouldDelete) return;

    setIsDeleting(true);
    try {
      await onDeleteAccount();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="pt-8 pb-5 px-8">
      <div className="mb-5">
        <h1 className="text-xl font-semibold">
          {`${userType.charAt(0).toUpperCase() + userType.slice(1)} Settings`}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your account preferences and personal information
        </p>
      </div>
      <div className="bg-white rounded-xl p-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <CustomFormField name="name" label="Name" disabled={!editMode} />
            <CustomFormField
              name="email"
              label="Email"
              type="email"
              disabled={!editMode}
            />
            <CustomFormField
              name="phoneNumber"
              label="Phone Number"
              disabled={!editMode}
            />

            <div className="pt-4 flex justify-between">
              <Button
                type="button"
                onClick={toggleEditMode}
                className="bg-secondary-500 text-white hover:bg-secondary-600"
              >
                {editMode ? "Cancel" : "Edit"}
              </Button>
              {editMode && (
                <Button
                  type="submit"
                  className="bg-primary-700 text-white hover:bg-primary-800"
                >
                  Save Changes
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>

      <div className="mt-5 rounded-xl border border-red-200 bg-linear-to-r from-red-50 to-rose-50 p-6">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-red-100 p-2 text-red-700">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-red-800">
              {userType === "tenant"
                ? "Tenant Danger Zone"
                : "Manager Danger Zone"}
            </h2>
            <p className="mt-1 text-sm text-red-700/90">
              {userType === "tenant"
                ? "Deleting your tenant account is permanent and cannot be undone."
                : "Deleting your manager account is permanent and cannot be undone."}
            </p>
          </div>
        </div>

        <div className="mt-5 border-t border-red-200 pt-4">
          <Button
            type="button"
            onClick={handleDeleteAccount}
            disabled={isDeleting}
            className="w-full sm:w-auto bg-red-600 text-white hover:bg-red-700 active:bg-red-800"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting Account...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                {userType === "tenant"
                  ? "Delete Tenant Account"
                  : "Delete Manager Account"}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsForm;
