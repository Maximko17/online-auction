"use client";

import { toRuDate } from "@/lib/utils";
import { Lot, Status } from "@/types";
import { useEffect, useState } from "react";
import Countdown, { zeroPad } from "react-countdown";

interface ILotCountdownTimer {
  status: Lot["status"];
  startTime: Date;
  endTime: Date;
}

interface ITimerRenderer {
  onCountDownEnd?: Function;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  completed: boolean;
}

function TimerRenderer({
  onCountDownEnd,
  days,
  hours,
  minutes,
  seconds,
  completed,
}: ITimerRenderer) {
  if (completed) {
    return onCountDownEnd!();
  } else {
    return (
      <div className="flex gap-2 items-center justify-around w-full">
        <div className="flex flex-col justify-center items-center gap-1">
          <span className="text-sm text-black font-medium">Дней</span>
          <span className="py-2 px-3 flex justify-center items-center bg-primary text-white text-2xl rounded-md">
            {zeroPad(days)}
          </span>
        </div>
        <span className="text-primary text-[20px] sm:text-[40px] mt-5">:</span>
        <div className="flex flex-col justify-center items-center gap-1">
          <span className="text-sm text-black font-medium">Часов</span>
          <span className="py-2 px-3 bg-primary text-white text-2xl  rounded-md">
            {zeroPad(hours)}
          </span>
        </div>
        <span className="text-primary text-[20px] sm:text-[40px]  mt-5">:</span>
        <div className="flex flex-col justify-center items-center gap-1">
          <span className="text-sm text-black font-medium">Минут</span>
          <span className="py-2 px-3  bg-primary text-white text-2xl rounded-md">
            {zeroPad(minutes)}
          </span>
        </div>
        <span className="text-primary text-[20px] sm:text-[40px]  mt-5">:</span>
        <div className="flex flex-col justify-center items-center gap-1">
          <span className="text-sm text-black font-medium">Секунд</span>
          <span className="py-2 px-3  bg-primary text-white text-2xl  rounded-md">
            {zeroPad(seconds)}
          </span>
        </div>
      </div>
    );
  }
}

export default function LotCountdownTimer({
  status,
  startTime,
  endTime,
}: ILotCountdownTimer) {
  // const router = useRouter();
  const [countdownDate, setCountdownDate] = useState<Date | null>(null);

  useEffect(() => {
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);
    const nowDate = new Date();
    if (status === Status.NEW) {
      setCountdownDate(startDate);
    } else if (status === Status.ACTIVE) {
      setCountdownDate(endDate);
    } else {
      setCountdownDate(nowDate);
    }
  }, []);

  const onCountDownEnd = () => {
    if (status === Status.CLOSED) {
      return null;
    } else {
      window.location.reload();
    }
  };

  const getStatus = () => {
    switch (status) {
      case Status.NEW:
        return "Дата начала аукциона:";
      case Status.ACTIVE:
        return "Дата окончания аукциона:";
      case Status.CLOSED:
        return "Аукцион завершен";
    }
  };

  return (
    <>
      <ul className="w-full *:flex *:justify-between *:border-b-[1px] *:border-b-slate-200 [&>*:first-child]:pt-0 *:py-3 *:text-sm *:font-medium mb-[5px]">
        <li>
          <span>{getStatus()}</span>
          <span>
            {countdownDate &&
              status !== Status.CLOSED &&
              toRuDate(countdownDate)}
          </span>
        </li>
      </ul>
      {countdownDate && (
        <Countdown
          date={countdownDate}
          renderer={(props) => (
            <TimerRenderer {...props} onCountDownEnd={onCountDownEnd} />
          )}
        />
      )}
    </>
  );
}
