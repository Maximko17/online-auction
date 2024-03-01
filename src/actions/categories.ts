"use server";
import { apiFetch } from "@/lib/fetch";
import { Lot, LotCategory } from "@/types";

type GetCategotiesTreeRequestData = {
  startDepth: number;
  endDepth: number;
};

export async function getCategotiesTree({
  startDepth,
  endDepth,
}: GetCategotiesTreeRequestData) {
  const res = await apiFetch<LotCategory[]>(
    `/api/v1/categories/tree?startDepth=${startDepth}&endDepth=${endDepth}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    },
  );
  return res;
}
