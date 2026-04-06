"use client";

import React from "react";
import {
  ControllerRenderProps,
  FieldValues,
  useFormContext,
  useFieldArray,
  Control,
} from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Edit, X, Plus } from "lucide-react";
import { registerPlugin } from "filepond";
import { FilePond } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

interface FormFieldProps {
  name: string;
  label: string;
  type?:
    | "text"
    | "email"
    | "textarea"
    | "number"
    | "select"
    | "switch"
    | "boolean-segmented"
    | "password"
    | "file"
    | "multi-input";
  placeholder?: string;
  options?: { value: string; label: string }[];
  accept?: string;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  value?: string;
  disabled?: boolean;
  multiple?: boolean;
  isIcon?: boolean;
  initialValue?: string | number | boolean | string[];
}

export const CustomFormField: React.FC<FormFieldProps> = ({
  name,
  label,
  type = "text",
  placeholder,
  options,

  className,
  inputClassName,
  labelClassName,
  disabled = false,

  isIcon = false,
  initialValue,
}) => {
  const { control } = useFormContext();

  const renderFormControl = (
    field: ControllerRenderProps<FieldValues, string>,
  ) => {
    switch (type) {
      case "textarea":
        return (
          <Textarea
            placeholder={placeholder}
            {...field}
            value={field.value ?? ""}
            rows={3}
            className={`border-gray-200 p-4 ${inputClassName}`}
          />
        );
      case "select":
        return (
          <Select
            value={field.value || (initialValue as string)}
            defaultValue={field.value || (initialValue as string)}
            onValueChange={field.onChange}
          >
            <SelectTrigger
              className={`w-full h-11 border-primary-300 bg-white px-3 shadow-sm transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-200 ${inputClassName}`}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className="z-70 max-h-72 w-full border border-primary-300 bg-white text-primary-800 shadow-xl">
              {options?.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="cursor-pointer rounded-md px-2 py-2 text-sm font-medium text-primary-700 hover:bg-primary-100 focus:bg-primary-100 focus:text-primary-900"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "switch":
        return (
          <div className="flex items-center justify-between rounded-lg border border-primary-200 bg-primary-50 px-3 py-2">
            <div className="flex flex-col">
              <FormLabel htmlFor={name} className={`text-sm ${labelClassName}`}>
                {label}
              </FormLabel>
              <span
                className={`text-xs font-semibold ${
                  Boolean(field.value) ? "text-green-700" : "text-gray-500"
                }`}
              >
                {Boolean(field.value) ? "ON" : "OFF"}
              </span>
            </div>
            <Switch
              checked={Boolean(field.value)}
              onCheckedChange={(checked) => field.onChange(checked)}
              id={name}
              className={`data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-gray-300 ${inputClassName}`}
            />
          </div>
        );
      case "boolean-segmented":
        return (
          <div className="space-y-2">
            <div className="inline-flex w-full rounded-lg border border-primary-300 bg-white p-1">
              <Button
                type="button"
                onClick={() => field.onChange(true)}
                className={`h-9 flex-1 rounded-md text-sm font-medium transition-colors ${
                  Boolean(field.value)
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-transparent text-primary-700 hover:bg-primary-100"
                }`}
              >
                Yes
              </Button>
              <Button
                type="button"
                onClick={() => field.onChange(false)}
                className={`h-9 flex-1 rounded-md text-sm font-medium transition-colors ${
                  !Boolean(field.value)
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-transparent text-primary-700 hover:bg-primary-100"
                }`}
              >
                No
              </Button>
            </div>
            <p
              className={`text-xs font-semibold ${
                Boolean(field.value) ? "text-green-700" : "text-red-700"
              }`}
            >
              {Boolean(field.value) ? "Selected: Yes" : "Selected: No"}
            </p>
          </div>
        );
      case "file":
        return (
          <FilePond
            className={`${inputClassName}`}
            onupdatefiles={(fileItems) => {
              const files = fileItems.map((fileItem) => fileItem.file);
              field.onChange(files);
            }}
            allowMultiple={true}
            labelIdle={`Drag & Drop your images or <span class="filepond--label-action">Browse</span>`}
            credits={false}
          />
        );
      case "number":
        return (
          <Input
            type="number"
            placeholder={placeholder}
            {...field}
            value={field.value ?? ""}
            className={`border-gray-200 p-4 ${inputClassName}`}
            disabled={disabled}
          />
        );
      case "multi-input":
        return (
          <MultiInputField
            name={name}
            control={control}
            placeholder={placeholder}
            inputClassName={inputClassName}
          />
        );
      default:
        return (
          <Input
            type={type}
            placeholder={placeholder}
            {...field}
            value={field.value ?? ""}
            className={`border-gray-200 p-4 ${inputClassName}`}
            disabled={disabled}
          />
        );
    }
  };

  return (
    <FormField
      control={control}
      name={name}
      defaultValue={initialValue}
      render={({ field }) => (
        <FormItem
          className={`${
            type !== "switch" && "rounded-md"
          } relative ${className}`}
        >
          {type !== "switch" && (
            <div className="flex justify-between items-center">
              <FormLabel className={`text-sm ${labelClassName}`}>
                {label}
              </FormLabel>

              {!disabled &&
                isIcon &&
                type !== "file" &&
                type !== "multi-input" && (
                  <Edit className="size-4 text-customgreys-dirtyGrey" />
                )}
            </div>
          )}
          <FormControl>
            {renderFormControl({
              ...field,
              value: field.value !== undefined ? field.value : initialValue,
            })}
          </FormControl>
          <FormMessage className="text-red-400" />
        </FormItem>
      )}
    />
  );
};
interface MultiInputFieldProps {
  name: string;
  control: Control<FieldValues>;
  placeholder?: string;
  inputClassName?: string;
}

const MultiInputField: React.FC<MultiInputFieldProps> = ({
  name,
  control,
  placeholder,
  inputClassName,
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  return (
    <div className="space-y-2">
      {fields.map((field, index) => (
        <div key={field.id} className="flex items-center space-x-2">
          <FormField
            control={control}
            name={`${name}.${index}`}
            render={({ field }) => (
              <FormControl>
                <Input
                  {...field}
                  placeholder={placeholder}
                  className={`flex-1 border-none bg-customgreys-darkGrey p-4 ${inputClassName}`}
                />
              </FormControl>
            )}
          />
          <Button
            type="button"
            onClick={() => remove(index)}
            variant="ghost"
            size="icon"
            className="text-customgreys-dirtyGrey"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        onClick={() => append("")}
        variant="outline"
        size="sm"
        className="mt-2 text-customgreys-dirtyGrey"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Item
      </Button>
    </div>
  );
};
