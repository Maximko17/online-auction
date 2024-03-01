"use server";
import { apiAuthFetch, apiFetch } from "@/lib/fetch";
import { User } from "@/types";

type CreateNewBidRequestData = {
  lotId: number;
  bid: number;
};

type CreateNewBidResponseData = {
  id: number;
};

type GetLotBidsResponseData = {
  id: number;
  bid: number;
  bidTime: Date;
  user: User;
};

export async function createNewBid(reqData: CreateNewBidRequestData) {
  const res = await apiAuthFetch<CreateNewBidResponseData>(
    `/api/v1/lots/${reqData.lotId}/bids/new`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
      body: JSON.stringify({ bid: reqData.bid }),
    },
  );
  return res;
}

export async function getLotBids(lotId: number) {
  const res = await apiFetch<GetLotBidsResponseData[]>(
    `/api/v1/lots/${lotId}/bids`,
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
