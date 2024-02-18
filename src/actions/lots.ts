"use server";
import { apiAuthFecth, apiFecth } from "@/lib/fetch";

export async function createNewLot(data: FormData) {
  await apiAuthFecth("/api/v1/lots/new", {
    method: "POST",
    cache: "no-store",
    body: data,
  });
}

export async function getLotData(lotId: number) {
  const res = await apiFecth(`/api/v1/lots/${lotId}`, {
    method: "GET",
    cache: "no-store",
  });
  return res;
}
