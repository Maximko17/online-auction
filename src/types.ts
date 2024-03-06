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
  lastBid: number | null;
  totalBids: number | null;
  startTime: Date;
  endTime: Date;
  status: Status;
  images: string[];
  seller: User;
  isTracking: boolean;
};

export type LotCategory = {
  id: number;
  name: string;
  parentId: LotCategory;
  childCategories: LotCategory[];
};

type OrderBy = "ASC" | "DESC";
export type LotListFilters = { sellerId?: number };
export type LotListOrder = { lotId?: OrderBy };

export enum Status {
  REVIEW = "REVIEW",
  NEW = "NEW",
  ACTIVE = "ACTIVE",
  CLOSED = "CLOSED",
  SOLD = "SOLD",
}
