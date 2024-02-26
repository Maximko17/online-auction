import {
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";
import React from "react";
import { Lot } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { formatValue } from "react-currency-input-field";

interface ILotCard {
  lot: Lot;
}

export const LotCard = (props: ILotCard) => {
  const { id, name, description, images, startBid } = props.lot;

  return (
    <Card className="overflow-hidden rounded-xl bg-white shadow-lg dark:bg-zinc-800">
      <div className="relative">
        <Image
          alt="Auction item"
          className="aspect-[3/2] h-64 w-full object-cover"
          src={`${process.env.NEXT_PUBLIC_S3_URL}/${images[0].image}`}
          width="420"
          height="280"
        />
      </div>
      <CardContent className="p-6">
        <CardTitle className="mb-2 text-2xl font-semibold">{name}</CardTitle>
        <CardDescription className="mb-4 text-gray-700 dark:text-zinc-100">
          {description}
        </CardDescription>
        <div className="mb-4">
          <span className="text-lg font-semibold">Текущая ставка:</span>
          <span className="ml-2 text-2xl font-bold text-green-500">
            {formatValue({
              value: `${startBid}`,
              intlConfig: { locale: "ru-RU", currency: "RUB" },
            })}
          </span>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 p-4 dark:bg-zinc-900 justify-center">
        <Link
          href={`/lots/${id}`}
          className="bg-primary text-primary-foreground shadow hover:bg-primary/90 py-2 px-5 rounded-md text-sm  transition-colors"
        >
          Перейти
        </Link>
      </CardFooter>
    </Card>
  );
};
