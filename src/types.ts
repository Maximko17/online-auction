export type User = {
  id: number;
  email: string;
  username: string;
  role: string;
  image?: string;
  rating: number;
};

export type Lot = {
  id: number;
  name: string;
  description: string;
  bidIncrement: number;
  startBid: number;
  startTime: Date;
  endTime: Date;
  status: Status;
  images: LotImage[];
  seller: User;
};

type OrderBy = "ASC" | "DESC";
export type LotListFilters = { sellerId?: number };
export type LotListOrder = { lotId?: OrderBy };

export type LotImage = {
  image: string;
};

export enum Status {
  REVIEW = "REVIEW",
  NEW = "NEW",
  ACTIVE = "ACTIVE",
  CLOSED = "CLOSED",
}
