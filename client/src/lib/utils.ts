import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast } from "sonner";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatEnumString(str: string) {
  return str.replace(/([A-Z])/g, " $1").trim();
}

export function formatPriceValue(value: number | null, isMin: boolean) {
  if (value === null || value === 0)
    return isMin ? "Any Min Price" : "Any Max Price";
  if (value >= 1000) {
    const kValue = value / 1000;
    return isMin ? `$${kValue}k+` : `<$${kValue}k`;
  }
  return isMin ? `$${value}+` : `<$${value}`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function cleanParams(params: Record<string, any>): Record<string, any> {
  return Object.fromEntries(
    Object.entries(params).filter(
      (
        [_, value], // eslint-disable-line @typescript-eslint/no-unused-vars
      ) =>
        value !== undefined &&
        value !== "any" &&
        value !== "" &&
        (Array.isArray(value) ? value.some((v) => v !== null) : value !== null),
    ),
  );
}

type MutationMessages = {
  success?: string;
  error: string;
};

export const withToast = async <T>(
  mutationFn: Promise<T>,
  messages: Partial<MutationMessages>,
) => {
  const { success } = messages;

  try {
    const result = await mutationFn;
    if (success) toast.success(success);
    return result;
  } catch (error) {
    let errorMessage = messages.error || "An error occurred";

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "object" && error !== null) {
      // Handle RTK Query errors
      const err = error as Record<string, unknown>;
      if (err.data !== undefined) {
        try {
          errorMessage = String(
            typeof err.data === "string"
              ? err.data
              : (err.data as Record<string, unknown>).message ||
                  (err.data as Record<string, unknown>).error ||
                  err.data,
          );
        } catch {
          errorMessage = String(err);
        }
      } else if (err.message) {
        errorMessage = String(err.message);
      } else if (err.error) {
        errorMessage = String(err.error);
      }
    } else if (typeof error === "string") {
      errorMessage = error;
    }

    toast.error(errorMessage);
    return undefined;
  }
};

export const createNewUserInDatabase = async (
  user: Record<string, unknown>,
  idToken: Record<string, unknown> | string,
  userRole: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fetchWithBQ: any,
) => {
  const createEndpoint =
    userRole?.toLowerCase() === "manager" ? "/managers" : "/tenants";

  let email = "";
  if (typeof idToken === "object" && idToken) {
    const payload = idToken.payload as Record<string, unknown>;
    if (payload?.email) {
      email = String(payload.email);
    }
  }

  const createUserResponse = await fetchWithBQ({
    url: createEndpoint,
    method: "POST",
    body: {
      cognitoId: user.userId,
      name: user.username,
      email,
      phoneNumber: "",
    },
  });

  return createUserResponse;
};
