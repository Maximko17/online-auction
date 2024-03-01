import { apiAuthFetch } from "@/lib/fetch";
import { Lot, LotListFilters, LotListOrder } from "@/types";

type GetTrackingLotsListRequestData = {
  filters: LotListFilters;
  order?: LotListOrder;
  limit: number;
  page: number;
};
type GetLotsListResponseData = {
  content: Lot[];
  totalPages: number;
};

export async function getTrackingLots(reqData: GetTrackingLotsListRequestData) {
  const res = await apiAuthFetch<GetLotsListResponseData>(
    `/api/v1/users/me/lots/tracking`,
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

export async function getBidsLots(reqData: GetTrackingLotsListRequestData) {
  const res = await apiAuthFetch<GetLotsListResponseData>(
    `/api/v1/users/me/bids/lots`,
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
