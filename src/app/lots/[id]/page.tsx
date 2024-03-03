import { getLotData } from "@/actions/lots";
import ToastServerApiErrorMessage from "../../../components/ui/toast/toast-api-status";
import LotImages from "../../../components/lots/LotImages";
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
import BidForm from "../../../components/lots/BidForm";
import { formatValue } from "react-currency-input-field";
import LotCountdownTimer from "@/components/countdown-timer";
import TrackLotButton from "../../../components/lots/TrackLot";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getLotBids } from "@/actions/bids";
import UserAvatar from "@/components/user-avatar";
import { getAuthUserData } from "@/actions/auth";
import { cn } from "@/lib/utils";
import { Lot, Status } from "@/types";
import { log } from "console";
import Link from "next/link";

let eventSource: EventSource;

const createBidEventSource = (lot: Lot) => {
  eventSource = new EventSource(
    `${process.env.BACKEND_HOST}/api/v1/lots/${lot.id}/bids-stream`,
  );
  eventSource.onmessage = (e) => {
    const response = JSON.parse(e.data);
    console.log(response);
  };
  eventSource.onopen = (e) => {
    console.log(`Connection to lot ${lot.id} opened`);
  };
  eventSource.onerror = (e) => {
    log(e);
    console.log(`Connection to lot ${lot.id} closed`);
    // if (isLotClosed()) {
    eventSource.close();
    // }
  };
  return eventSource;
};

export default async function Lot({ params }: { params: { id: number } }) {
  const { data: lot } = await getLotData(params.id);
  if (!lot) {
    return notFound();
  }
  if (lot.status === Status.ACTIVE) {
    // createBidEventSource(lot);
  }
  const authUser = getAuthUserData();

  const canEdit = () => {
    return (
      lot.seller.id === authUser?.id &&
      (lot.status === Status.NEW || lot.status === Status.REVIEW)
    );
  };

  const canBid = () => {
    return lot.status === Status.ACTIVE && lot.seller.id !== authUser?.id;
  };

  const canTrack = () => {
    return (
      lot.isTracking ||
      (lot.status !== Status.CLOSED && lot.seller.id !== authUser?.id)
    );
  };

  return (
    <main className="py-10">
      {/* <ToastServerApiErrorMessage status={lot.status} /> */}
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
                  {lot.lastBid
                    ? formatValue({
                        value: `${lot.lastBid}`,
                        intlConfig: { locale: "ru-RU", currency: "RUB" },
                      })
                    : "-"}
                </span>
              </li>
              <li>
                <span>Всего ставок</span>
                <span>{lot.totalBids || "-"}</span>
              </li>
            </ul>
            {canBid() && (
              <BidForm
                bidIncrement={lot.bidIncrement}
                lastBid={lot.startBid}
                lotId={lot.id}
              />
            )}
          </CardContent>
          <CardFooter className="flex flex-col items-start">
            <LotCountdownTimer
              startTime={lot.startTime}
              endTime={lot.endTime}
            />
            {canEdit() && (
              <Link
                href={`/lots/${params.id}/edit`}
                className="w-full text-center mt-[15px] bg-violet-700 text-zinc-100 shadow hover:bg-violet-700/90 py-2 px-5 rounded-md text-sm transition-colors"
              >
                Редактировать лот
              </Link>
            )}
            {canTrack() && (
              <TrackLotButton lotId={lot.id} isTracking={lot.isTracking} />
            )}
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
          <p className="p-5 text-sm ">{lot.description}</p>
        </TabsContent>
        <TabsContent value="bids">
          {lot.status !== Status.NEW && lot.status !== Status.REVIEW ? (
            <BidsTable lotId={params.id} />
          ) : (
            <p className="text-sm font-medium text-center p-5">
              Ставки будут доступны после начала аукциона
            </p>
          )}
        </TabsContent>
      </Tabs>
    </main>
  );
}

async function BidsTable({ lotId }: { lotId: number }) {
  const res = await getLotBids(lotId);
  if (!res.data?.length) {
    return <p className="py-3 px-4">Ставок пока нет</p>;
  }
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
