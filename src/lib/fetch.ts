import { getAccessToken } from "@/actions/auth";

export type ApiFetchResponse<T> = Promise<{
  status: number;
  data: T | null;
}>;

export type ApiFetchErrorResponse = {
  message: string;
  errors: {
    [key: string]: string;
  };
};

export async function apiAuthFetch<T>(
  input: string | URL | globalThis.Request,
  reqOptions: RequestInit,
): ApiFetchResponse<T> {
  const accessToken = getAccessToken();
  if (!accessToken) {
    return {
      status: 401,
      data: null,
    };
  }
  reqOptions.headers = {
    ...reqOptions.headers,
    Authorization: `Bearer ${accessToken}`,
  };
  return apiFetch(input, reqOptions);
}

export async function apiOptionalAuthFetch<T>(
  input: string | URL | globalThis.Request,
  reqOptions: RequestInit,
): ApiFetchResponse<T> {
  const accessToken = getAccessToken();
  reqOptions.headers = {
    ...reqOptions.headers,
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  };
  return apiFetch(input, reqOptions);
}

export async function apiFetch<T>(
  input: string | URL | globalThis.Request,
  reqInit: RequestInit,
): ApiFetchResponse<T> {
  try {
    const res = await fetch(`${process.env.BACKEND_HOST}${input}`, reqInit);
    return {
      status: res.status,
      data: res.ok && res.body ? ((await res.json()) as T) : null,
    };
  } catch (error) {
    return {
      status: 500,
      data: null,
    };
  }
}
