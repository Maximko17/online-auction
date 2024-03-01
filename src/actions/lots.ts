"use server";
import { apiAuthFetch, apiOptionalAuthFetch } from "@/lib/fetch";
import { Lot, LotListFilters, LotListOrder } from "@/types";

type NewLotResponseData = { id: number };
type GetLotsListRequestData = {
  filters: LotListFilters;
  order?: LotListOrder;
  limit: number;
  page: number;
};
type GetLotsListResponseData = {
  content: Lot[];
  totalPages: number;
};
type ToggleTrackLotRequestData = {
  lotId: number;
  isTracking: boolean;
};

export async function createNewLot(data: FormData) {
  const res = await apiAuthFetch<NewLotResponseData>("/api/v1/lots/new", {
    method: "POST",
    cache: "no-store",
    body: data,
  });
  return res;
}

export async function getLotData(lotId: number) {
  const res = await apiOptionalAuthFetch<Lot>(`/api/v1/lots/${lotId}`, {
    method: "GET",
    cache: "no-store",
  });
  return res;
}

export async function getLotList(reqData: GetLotsListRequestData) {
  const res = await apiOptionalAuthFetch<GetLotsListResponseData>(
    `/api/v1/lots`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
      body: JSON.stringify({ ...reqData }),
    },
  );
  return res;
}

export async function toggleTrackLot({
  lotId,
  isTracking,
}: ToggleTrackLotRequestData) {
  const res = await apiAuthFetch<GetLotsListResponseData>(
    `/api/v1/lots/${lotId}/track`,
    {
      method: isTracking ? "DELETE" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    },
  );
  return res;
}
