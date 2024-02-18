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
  lotImages: string[];
  seller: User;
};

export enum Status {
  REVIEW,
  NEW,
  ACTIVE,
  CLOSED,
}
