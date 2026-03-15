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

const extractErrorMessage = (error: unknown): string => {
  console.log("=== ERROR EXTRACTION STARTED ===");
  console.log("Raw error:", error);
  console.log("Error type:", typeof error);
  console.log("Error instanceof Error:", error instanceof Error);

  // Handle standard Error objects
  if (error instanceof Error) {
    console.log("Matched: Error instance");
    return error.message;
  }

  // Handle string errors
  if (typeof error === "string") {
    console.log("Matched: String error");
    return error;
  }

  // Handle objects
  if (typeof error === "object" && error !== null) {
    const err = error as Record<string, unknown>;
    console.log("Error object keys:", Object.keys(err));
    console.log("Error object:", JSON.stringify(err, null, 2));

    // RTK Query specific error structure
    if ("status" in err) {
      console.log("Found 'status' property:", err.status);
    }

    // Check for response.data structure (RTK Query errors)
    if (err.data !== undefined) {
      console.log("Found 'data' property:", err.data);

      if (typeof err.data === "string") {
        console.log("Matched: err.data is string");
        return err.data;
      }

      if (typeof err.data === "object" && err.data !== null) {
        const dataObj = err.data as Record<string, unknown>;
        console.log("data object keys:", Object.keys(dataObj));
        console.log("data object:", JSON.stringify(dataObj, null, 2));

        // Check for nested message properties
        if (typeof dataObj.message === "string" && dataObj.message) {
          console.log("Matched: dataObj.message");
          return dataObj.message;
        }
        if (typeof dataObj.error === "string" && dataObj.error) {
          console.log("Matched: dataObj.error");
          return dataObj.error;
        }
        if (typeof dataObj.msg === "string" && dataObj.msg) {
          console.log("Matched: dataObj.msg");
          return dataObj.msg;
        }
        if (typeof dataObj.main === "string" && dataObj.main) {
          console.log("Matched: dataObj.main");
          return dataObj.main;
        }
      }
    }

    // Check for common error properties at top level
    if (typeof err.message === "string" && err.message) {
      console.log("Matched: err.message");
      return err.message;
    }
    if (typeof err.error === "string" && err.error) {
      console.log("Matched: err.error");
      return err.error;
    }
    if (typeof err.msg === "string" && err.msg) {
      console.log("Matched: err.msg");
      return err.msg;
    }

    // Check for status code with statusText
    if (typeof err.statusText === "string" && err.statusText) {
      console.log("Matched: err.statusText");
      return err.statusText;
    }

    // Check for response body
    if (typeof err.originalStatus === "number") {
      console.log("Found originalStatus:", err.originalStatus);
    }

    // As last resort, try to extract any string value from the object
    for (const [key, value] of Object.entries(err)) {
      if (typeof value === "string" && value.length > 0 && value.length < 200) {
        console.log(`Matched: err[${key}] (fallback)`);
        return value;
      }
    }
  }

  console.log("No match found, returning default");
  return "An error occurred";
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
  } catch (error: any) {
    let errorMessage = "An error occurred";

    // RTK Query error structure: { error: { data: { message: "..." }, status: 500 }, ... }
    if (error?.error?.data?.message) {
      errorMessage = error.error.data.message;
    }
    // Alternative structure: { status: number, data: { message: "..." } }
    else if (error?.data?.message) {
      errorMessage = error.data.message;
    }
    // String response
    else if (typeof error?.data === "string") {
      errorMessage = error.data;
    }
    // Direct message property
    else if (error?.message) {
      errorMessage = error.message;
    }
    // Fallback to provided error message
    else if (messages.error) {
      errorMessage = messages.error;
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
