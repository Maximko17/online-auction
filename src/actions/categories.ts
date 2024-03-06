"use server";
import { apiFetch } from "@/lib/fetch";
import { LotCategory } from "@/types";

export async function getCategotyTree(lotId: number) {
  const res = await apiFetch<LotCategory[]>(
    `/api/v1/categories/${lotId}/tree`,
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

export async function getRootCategories() {
  const res = await apiFetch<LotCategory[]>(`/api/v1/categories/root`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });
  return res;
}
