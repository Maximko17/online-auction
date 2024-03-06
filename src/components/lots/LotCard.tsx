import React from "react";
import { Lot } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { formatToRub, toRuDate } from "@/lib/utils";
import { Icons } from "../icons";
import TrackLotButton from "./TrackLotButton";

interface ILotCard {
  lot: Lot;
}

export const LotCard = (props: ILotCard) => {
  const {
    id,
    name,
    description,
    images,
    startBid,
    lastBid,
    totalBids,
    startTime,
    endTime,
    isTracking,
    seller,
  } = props.lot;

  const getStatusAndTime = () => {
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);
    const nowDate = new Date();

    if (nowDate < startDate) {
      return <span>Начинается: {toRuDate(startDate)}</span>;
    } else if (nowDate > startDate && nowDate < endDate) {
      return <span>Завершается: {toRuDate(endDate)}</span>;
    } else {
      return "Аукцион завершен";
    }
  };

  return (
    // <Card className="overflow-hidden rounded-xl bg-white shadow-lg dark:bg-zinc-800">
    //   <div className="relative">
    //     <Image
    //       alt="Auction item"
    //       className="aspect-[3/2] h-64 w-full object-cover"
    //       src={`${process.env.NEXT_PUBLIC_S3_URL}/${images[0]}`}
    //       width="420"
    //       height="280"
    //     />
    //   </div>
    //   <CardContent className="p-6">
    //     <CardTitle className="mb-2 text-2xl font-semibold">{name}</CardTitle>
    //     <CardDescription className="mb-4 text-gray-700 dark:text-zinc-100">
    //       {description}
    //     </CardDescription>
    //     <div className="mb-4">
    //       <span className="text-lg font-semibold">Текущая ставка:</span>
    //       <span className="ml-2 text-2xl font-bold text-green-500">
    //         {formatValue({
    //           value: `${startBid}`,
    //           intlConfig: { locale: "ru-RU", currency: "RUB" },
    //         })}
    //       </span>
    //     </div>
    //   </CardContent>
    //   <CardFooter className="bg-gray-50 p-4 dark:bg-zinc-900 justify-center">
    //     <Link
    //       href={`/lots/${id}`}
    //       className="bg-primary text-primary-foreground shadow hover:bg-primary/90 py-2 px-5 rounded-md text-sm  transition-colors"
    //     >
    //       Перейти
    //     </Link>
    //   </CardFooter>
    // </Card>

    <div className="w-full flex flex-col items-stretch border-b pb-5 border-gray-200 md:flex-row">
      <Link href={`/lots/${id}`}>
        <div className="w-[189px] h-[189px] relative">
          <Image
            alt="Auction item"
            className="rounded-lg"
            src={`${process.env.NEXT_PUBLIC_S3_URL}/${images[0]}`}
            fill
          />
        </div>
      </Link>

      <div className="flex pl-4 py-1 leading-normal">
        <div className="flex flex-col justify-between pr-2">
          <div>
            <Link href={`/lots/${id}`}>
              <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 ">
                Noteworthy technology acquisitions 2021
              </h5>
            </Link>
            <p className="font-normal text-gray-700 line-clamp-2">
              Here are the biggest enterprise technology acquisitions of 2021 so
              far, in reverse chronological order.
            </p>
          </div>

          <div className="flex justify-between pb-1 text-sm items-center">
            {getStatusAndTime()}
            <Link
              href={`/users/${id}/lots`}
              className="text-sm flex justify-self-end"
            >
              <Icons.user width={15} className="" />
              <span className="underline line-clamp-1 ml-[3px] pt-[2px]">
                {seller.username}
              </span>
            </Link>
            <Icons.track />
            {/* <TrackLotButton lotId={id} isTracking={isTracking} /> */}
          </div>
        </div>
        <div className="flex flex-col justify-between items-center min-w-40">
          <div className="flex flex-col w-full text-center">
            <span className="text-xl">{formatToRub(startBid || lastBid)}</span>
            <span className="text-sm text-gray-400 mt-2">
              Ставок: {totalBids || 0}
            </span>
          </div>
          <Link
            href={`/lots/${id}`}
            className="flex items-center bg-primary text-primary-foreground shadow hover:bg-primary/90 py-1 px-5 rounded-md text-sm transition-colors"
          >
            <span>Перейти</span>
            <Icons.nextArrow width={15} className="mt-[2px] ml-[5px]" />
          </Link>
        </div>
      </div>
    </div>
  );
};
