import { getLotData } from "@/actions/lots";
import ToastApiErrorMessage from "../../../components/ui/toast/toast-api-status";
import LotImages from "./lot-images";
import { notFound } from "next/navigation";
import EventSource from "eventsource";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import BidForm from "./bid-form";
import { formatValue } from "react-currency-input-field";
import LotCountdownTimer from "@/components/countdown-timer";
import TrackLotButton from "./track-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { log } from "console";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getLotBids } from "@/actions/bids";
import UserAvatar from "@/components/user-avatar";
import { getAuthUserData } from "@/actions/auth";
import { cn } from "@/lib/utils";
import { Status } from "@/types";

let eventSource: EventSource;

const createBidEventSource = (lotId: number) => {
  const eventSource = new EventSource(
    `${process.env.BACKEND_HOST}/api/v1/lots/${lotId}/bids-stream`,
  );
  eventSource.onmessage = (e) => {
    const response = JSON.parse(e.data);
    console.log(response);
  };
  eventSource.onopen = (e) => {
    console.log(`Connection to lot ${lotId} opened`);
  };
  eventSource.onerror = (e) => {
    console.log(`Connection to lot ${lotId} closed`);
  };
  return eventSource;
};

export default async function Lot({ params }: { params: { id: number } }) {
  const res = await getLotData(params.id);
  if (!res.data) {
    return notFound();
  }
  const lot = res.data;

  // if (!eventSource) {
  //   createBidEventSource(lot.id);
  // }

  return (
    <main className="py-10">
      <ToastApiErrorMessage status={res.status} />
      <div className="flex">
        <LotImages images={lot.images} />
        <Card className="w-[450px] ml-5 flex flex-col justify-between">
          <CardHeader className="text-2xl font-semibold">
            <CardTitle>{lot.name}</CardTitle>
            <CardDescription>{lot.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="*:flex *:justify-between *:border-b-[1px] *:border-b-slate-200 [&>*:first-child]:pt-0 *:py-3 *:text-sm *:font-medium">
              <li>
                <span>Начальная цена</span>
                <span>
                  {formatValue({
                    value: `${lot.startBid}`,
                    intlConfig: { locale: "ru-RU", currency: "RUB" },
                  })}
                </span>
              </li>
              <li>
                <span>Шаг цены</span>
                <span>
                  {formatValue({
                    value: `${lot.bidIncrement}`,
                    intlConfig: { locale: "ru-RU", currency: "RUB" },
                  })}
                </span>
              </li>
              <li>
                <span>Последняя ставка</span>
                <span>
                  {formatValue({
                    value: `${lot.bidIncrement}`,
                    intlConfig: { locale: "ru-RU", currency: "RUB" },
                  })}
                </span>
              </li>
              <li>
                <span>Всего ставок</span>
                <span>20</span>
              </li>
            </ul>
            {lot.status !== Status.CLOSED && (
              <BidForm
                bidIncrement={lot.bidIncrement}
                lastBid={lot.startBid}
                lotId={lot.id}
              />
            )}
          </CardContent>
          <CardFooter className="flex flex-col items-start">
            <LotCountdownTimer
              status={lot.status}
              startTime={lot.startTime}
              endTime={lot.endTime}
            />
            <TrackLotButton lotId={lot.id} isTracking={true} />
          </CardFooter>
        </Card>
      </div>
      <Tabs defaultValue="description" className="w-full mt-10">
        <TabsList className="w-full">
          <TabsTrigger value="description" className="flex-1">
            Описание
          </TabsTrigger>
          <TabsTrigger value="bids" className="flex-1">
            Ставки
          </TabsTrigger>
        </TabsList>
        <TabsContent value="description">
          <p className="py-3 px-4">{lot.description}</p>
        </TabsContent>
        <TabsContent value="bids">
          <BidsTable lotId={params.id} />
        </TabsContent>
      </Tabs>
    </main>
  );
}

async function BidsTable({ lotId }: { lotId: number }) {
  const res = await getLotBids(lotId);
  const authUser = getAuthUserData();
  return (
    <div className="relative w-full overflow-auto max-h-[500px]">
      <Table>
        <TableHeader className="sticky top-0 bg-white z-10">
          <TableRow className="*:w-[33%] *:text-center">
            <TableHead>Пользователь</TableHead>
            <TableHead>Ставка</TableHead>
            <TableHead>Дата</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {res.data?.map((bidInfo) => (
            <TableRow
              key={bidInfo.id}
              className={cn(authUser?.id === bidInfo.user.id && "bg-green-50")}
            >
              <TableCell className="flex flex-col items-center gap-2">
                <UserAvatar user={bidInfo.user} />
                <span>{bidInfo.user.username}</span>
              </TableCell>
              <TableCell className="text-center">
                {formatValue({
                  value: `${bidInfo.bid}`,
                  intlConfig: { locale: "ru-RU", currency: "RUB" },
                })}
              </TableCell>
              <TableCell className="text-center">
                {new Intl.DateTimeFormat("ru-RU", {
                  dateStyle: "long",
                  timeStyle: "short",
                }).format(new Date(bidInfo.bidTime))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
