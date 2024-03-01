"use server";

import { SignInFormFields } from "@/app/(auth)/sign-in/page";
import { SignUpFormFields } from "@/app/(auth)/sign-up/sign-up-form";
import { apiFetch } from "@/lib/fetch";
import { User } from "@/types";
import { JwtPayload, jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type SignInResponseData = { accessToken: string; refreshToken: string };
type VerifyEmailRequestData = { email: string };
type SignUpResponseData = SignInResponseData;

const accessTokenCookie = "accessToken";
const refreshTokenCookie = "refreshToken";

export const setTokenCookies = (accessToken: string, refreshToken: string) => {
  const { exp: accessTokenExp } = jwtDecode(accessToken);
  const { exp: refreshTokenExp } = jwtDecode(refreshToken);
  cookies().set(accessTokenCookie, accessToken, {
    secure: process.env.NODE_ENV !== "development",
    httpOnly: true,
    expires: new Date(accessTokenExp! * 1000),
    sameSite: "strict",
    path: "/",
  });
  cookies().set(refreshTokenCookie, refreshToken, {
    secure: process.env.NODE_ENV !== "development",
    httpOnly: true,
    sameSite: "strict",
    expires: new Date(refreshTokenExp! * 1000),
    path: "/",
  });
};

export const getAccessToken = () => {
  const accessToken = cookies().get(accessTokenCookie)?.value ?? null;
  if (accessToken) {
    return accessToken;
  }
  return null;
  // const refreshToken = cookies().get(refreshTokenCookie)?.value ?? null;
  // if (!refreshToken) {
  //   return null;
  // }
  // try {
  //   const resData = await apiFecth(`/api/v1/auth/refresh`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     cache: "no-store",
  //     body: JSON.stringify({ refreshToken }),
  //   });
  //   const { accessToken } = resData;
  //   setTokenCookies(accessToken, refreshToken);
  //   return accessToken;
  // } catch (error) {
  //   console.log(error);
  // }
};

export const isAuthenticated = () => {
  return !!getAccessToken();
};

export const getAuthUserData = (): User | null => {
  const token = getAccessToken();
  if (!token) {
    return null;
  }
  const data: JwtPayload & User = jwtDecode(token);
  return { ...data, email: data.sub! };
};

export async function signIn(formData: SignInFormFields) {
  const res = await apiFetch<SignInResponseData>("/api/v1/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify({ ...formData }),
  });
  if (res.data) {
    const { accessToken, refreshToken } = res.data;
    setTokenCookies(accessToken, refreshToken);
  }
  return res;
}

export async function signUp(formData: SignUpFormFields) {
  const res = await apiFetch<SignUpResponseData>("/api/v1/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify({ ...formData }),
  });
  if (res.data) {
    const { accessToken, refreshToken } = res.data;
    setTokenCookies(accessToken, refreshToken);
  }

  return res;
}

export async function verifyEmail(formData: VerifyEmailRequestData) {
  const res = await apiFetch("/api/v1/auth/verification", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify({ ...formData }),
  });

  return res;
}

export const logout = () => {
  cookies().delete(accessTokenCookie);
  cookies().delete(refreshTokenCookie);
  redirect("/");
};
