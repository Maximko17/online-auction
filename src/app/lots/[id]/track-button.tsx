"use client";
import { toggleTrackLot } from "@/actions/lots";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useServerAction } from "@/hooks/user-server-action";
import { Check, Loader2 } from "lucide-react";
import { useState } from "react";

interface ITrackLotButton {
  lotId: number;
  isTracking: boolean;
}

export default function TrackLotButton({ lotId, isTracking }: ITrackLotButton) {
  const [isTracked, setIsTracked] = useState(isTracking);
  const [runAction, isRunning] = useServerAction(toggleTrackLot);
  const { toast } = useToast();

  const toggleTracking = async () => {
    const res = await runAction({ lotId, isTracking: isTracked });
    if (res?.status === 204) {
      setIsTracked(!isTracked);
      toast({
        variant: "success",
        title: isTracked
          ? "Лот удален из отслеживаемых."
          : "Лот добавлен в отслеживаемые.",
      });
    } else if (res?.status === 401) {
      return toast({
        variant: "destructive",
        title: "Сессия истекла!",
        description: "Перезагрузите страницу",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Произошла ошибка!",
        description: "Попробуйте еще раз или повторите позже",
      });
    }
  };

  const getButtonText = () => {
    if (isRunning) {
      return (
        <>
          <Loader2 className="mr-1 w-5 h-5 animate-spin" />
          <span>Загрузка...</span>
        </>
      );
    } else if (isTracked) {
      return (
        <>
          <Check className="mr-1 w-5 h-5" />
          <span>Лот отслеживается</span>
        </>
      );
    } else {
      return <span>Отслеживать лот</span>;
    }
  };

  return (
    <Button
      onClick={toggleTracking}
      disabled={isRunning}
      type="submit"
      variant={isTracked ? "success" : "default"}
      className={"w-full mt-[15px]"}
    >
      {getButtonText()}
    </Button>
  );
}
