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

export async function apiAuthFecth<T>(
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
  return apiFecth(input, reqOptions);
}

export async function apiFecth<T>(
  input: string | URL | globalThis.Request,
  reqInit: RequestInit,
): ApiFetchResponse<T> {
  try {
    const res = await fetch(`${process.env.BACKEND_HOST}${input}`, reqInit);
    return {
      status: res.status,
      data: res.ok ? ((await res.json()) as T) : null,
    };
  } catch (error) {
    return {
      status: 500,
      data: null,
    };
  }
}
