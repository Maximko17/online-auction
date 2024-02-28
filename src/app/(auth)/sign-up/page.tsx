import { jwtDecode } from "jwt-decode";

import SignUpForm from "./sign-up-form";
import { redirect } from "next/navigation";

export default ({
  params,
  searchParams,
}: {
  params: { id: number };
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const token = (searchParams["token"] as string) ?? null;
  if (!token) {
    redirect("/");
  }

  let decodedToken: { exp: number; sub: string };
  try {
    decodedToken = jwtDecode(token);
    if (
      Date.now() > new Date(decodedToken.exp * 1000).getTime() ||
      !decodedToken.sub
    ) {
      throw new Error("Invalid Token");
    }
  } catch (error) {
    redirect("/");
  }

  return <SignUpForm email={decodedToken.sub} token={token} />;
};
